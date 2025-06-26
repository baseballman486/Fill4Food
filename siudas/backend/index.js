const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const registerRoute = require("./routes/register");
app.use("/api/auth", registerRoute);

const redemptionRoutes = require("./routes/redemption");
app.use("/api/redemption", redemptionRoutes);

// MongoDB connection
mongoose
	.connect(process.env.MONGO_URI)

	.then(() => console.log("✅ Connected to MongoDB"))
	.catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});

