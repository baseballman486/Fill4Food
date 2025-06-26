const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");

// Generate unique 14-character hex code
async function generateUniqueCode() {
	let code;
	const maxAttempts = 10;
	let attempts = 0;

	do {
		code = crypto.randomBytes(7).toString("hex");
		const existing = await User.findOne({ code });
		if (!existing) return code;
		attempts++;
	} while (attempts < maxAttempts);

	return null; // failed to find unique code
}

// Register route with PIN hashing and unique code generation
router.post("/register", async (req, res) => {
	const { firstName, lastName, phone, pin, nfcTagId } = req.body;

	if (!firstName || !lastName || !pin || !nfcTagId) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		// Check if NFC Tag ID already exists
		const existing = await User.findOne({ nfcTagId });
		if (existing) return res.status(409).json({ error: "NFC Tag ID already registered" });

		// Generate unique user code
		const code = await generateUniqueCode();
		if (!code) return res.status(500).json({ error: "Failed to generate unique user code" });

		// Hash the PIN before saving
		const saltRounds = 10;
		const hashedPin = await bcrypt.hash(pin, saltRounds);

		const user = new User({
			firstName,
			lastName,
			phone,
			pin: hashedPin, // store hashed pin
			nfcTagId,
			code,
			balance: 0,
		});

		await user.save();

		res.status(201).json({
			message: "User created",
			user: { nfcTagId, firstName, lastName, phone, balance: 0, code },
		});
	} catch (err) {
		console.error("Register error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// Login route with PIN verification
router.post("/login", async (req, res) => {
	const { RFID, pin } = req.body;

	if (!RFID) return res.status(400).json({ error: "RFID required" });

	try {
		const user = await User.findOne({ nfcTagId: RFID });
		if (!user) return res.status(404).json({ error: "User not found" });

		// If PIN provided, verify it
		if (pin) {
			const match = await bcrypt.compare(pin, user.pin);
			if (!match) return res.status(401).json({ error: "Incorrect PIN" });
		}

		res.status(200).json({
			message: "Login successful",
			user: {
				nfcTagId: user.nfcTagId,
				balance: user.balance,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;

