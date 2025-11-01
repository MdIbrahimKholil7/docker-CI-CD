const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb://root:example@mongodb:27017/simplUser", {
    authSource: "admin",
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Define a simple schema and model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model("User", userSchema);

// 🏠 Home route
app.get("/", (req, res) => {
    res.send("Welcome to Node + MongoDB Server 🚀");
});

// 📜 Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➕ Create a new user
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).json({ message: "User created", user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 🗑️ Delete user by ID
app.delete("/users/:id", async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✏️ Update user by ID
app.put("/users/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User updated", user: updatedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
