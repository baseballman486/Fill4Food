// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nfcTagId: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
