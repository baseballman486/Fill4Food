const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Add to balance
router.post("/add-balance", async (req, res) => {
	const { nfcTagId, amount } = req.body;

	if (!nfcTagId || typeof amount !== "number") {
		return res.status(400).json({ error: "Missing or invalid parameters" });
	}

	try {
		const user = await User.findOne({ nfcTagId });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		user.balance += amount;
		await user.save();

		res.status(200).json({ message: "Balance updated", balance: user.balance });
	} catch (err) {
		console.error("Add balance error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// Redeem meal (subtract $5 if sufficient balance)
router.post("/redeem-meal", async (req, res) => {
	const { nfcTagId } = req.body;

	if (!nfcTagId) {
		return res.status(400).json({ error: "Missing NFC tag ID" });
	}

	try {
		const user = await User.findOne({ nfcTagId });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user.balance < 5) {
			return res.status(400).json({ error: "Insufficient balance to redeem a meal" });
		}

		user.balance -= 5;
		await user.save();

		res.status(200).json({ message: "Meal redeemed", balance: user.balance });
	} catch (err) {
		console.error("Redeem meal error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;
