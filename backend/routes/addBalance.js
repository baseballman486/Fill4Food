app.post("/api/addBalance", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: "Missing userId or amount" });
    }
    // Find user by ID and update balance
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.balance += amount;
    await user.save();

    res.json({ success: true, balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
