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

router.post("/register", async (req, res) => {
	const { firstName, lastName, phone, pin, nfcTagId } = req.body;

	if (!firstName || !lastName || !pin || !nfcTagId) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		// Check if NFC tag already registered
		const existing = await User.findOne({ nfcTagId });
		if (existing) {
			return res.status(409).json({ error: "NFC tag already registered" });
		}

		// Generate unique user code
		const code = await generateUniqueCode();
		console.log("Generated code:", code);

		if (!code) {
			return res.status(500).json({ error: "Failed to generate a unique code, please try again." });
		}

		// Hash PIN
		const hashedPin = await bcrypt.hash(pin, 10);

		// Create new user
		const newUser = new User({
			firstName,
			lastName,
			phone,
			pin: hashedPin,
			nfcTagId,
			code,
			balance: 0,
		});

		await newUser.save();

		res.status(201).json({ message: "User registered successfully", code });
	} catch (err) {
		console.error("Register error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;
