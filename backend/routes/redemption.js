// backend/routes/redemption.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/add", async (req, res) => {
  const { nfcTagId, amount } = req.body;

  if (!nfcTagId || typeof amount !== "number") {
    return res.status(400).json({ error: "Missing or invalid input" });
  }

  try {
    const user = await User.findOne({ nfcTagId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance += amount;
    await user.save();

    res
      .status(200)
      .json({ message: "Balance updated", newBalance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
