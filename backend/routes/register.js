// backend/routes/register.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");

// Function to generate a unique 14-character hex code
async function generateUniqueCode() {
  let code;
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(7).toString("hex"); // 14-character hex string
    exists = await User.findOne({ code });
  }

  return code;
}

router.post("/", async (req, res) => {
  const { rfidCode } = req.body;
  if (!rfidCode) return res.status(400).json({ error: "RFID code required" });

  try {
    const existing = await User.findOne({ nfcTagId: rfidCode });
    if (existing) {
      return res.status(409).json({ error: "RFID already exists" });
    }

    const code = await generateUniqueCode();

    if (!code) {
      return res.status(500).json({ error: "Failed to generate unique code" });
    }

    const user = new User({ nfcTagId: rfidCode, code, balance: 0 });
    await user.save();

    res.status(201).json({ message: "User created", code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
