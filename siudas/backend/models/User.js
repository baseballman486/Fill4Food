const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: String },
	pin: { type: String, required: true },
	nfcTagId: { type: String, required: true, unique: true },
	code: { type: String, required: true, unique: true },
	balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);

