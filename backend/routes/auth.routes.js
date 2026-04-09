// backend/routes/auth.routes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");
const Message = require("../models/Message");
const router = express.Router();

// Helper function — generates a JWT token that expires in 7 days
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/auth/register ───────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    // Log full request body for debugging
    console.log("📝 Register payload:", req.body);

    // Whitelist ONLY expected fields (ignore frontend extras)
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    console.log("✅ User created:", user._id, user.email);

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({
      message: err.message || "Registration failed - server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    if (user.status === "inactive")
      return res.status(403).json({
        message: "Your account is deactivated. Please contact the admin.",
      });
    const match = await user.matchPassword(password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });
    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Returns the currently logged-in user's data (requires token)
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

//──PUT/api/auth/profile─────────────────────────────────────
//Update name, bio, or upload a new profile picture
router.put(
  "/profile",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      console.log("Profile update:", {
        hasFile: !!req.file,
        filename: req.file?.filename,
        body: req.body,
      });
      const user = await User.findById(req.user._id);
      if (req.body.name) user.name = req.body.name;
      if (req.body.bio) user.bio = req.body.bio;

      // gender field removed
      if (req.body.interestLevel) {
        user.interestLevel = req.body.interestLevel;
      }
      if (req.body.username) user.username = req.body.username;
      if (req.body.dateOfBirth) user.dateOfBirth = req.body.dateOfBirth;

      // Handle profilePic: either uploaded file or avatar string from FormData
      if (req.file) {
        // Custom uploaded file
        user.profilePic = req.file.filename;
        console.log("Updated profilePic (file):", user.profilePic);
      } else if (req.body.profilePic) {
        // Avatar selection or other text profilePic
        user.profilePic = req.body.profilePic;
        console.log("Updated profilePic (avatar/text):", user.profilePic);
      }
      try {
        await user.save();
        console.log("DB save complete, new profilePic:", user.profilePic);
        const updated = await User.findById(user._id).select("-password");
        res.json(updated);
      } catch (saveErr) {
        console.error("Save error:", saveErr.message);
        res.status(400).json({ message: saveErr.message });
      }
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({ message: err.message });
    }
  },
);

//──PUT/api/auth/change-password────────────────────────────
router.put("/change-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    const match = await user.matchPassword(currentPassword);
    if (!match)
      return res.status(400).json({ message: "Current password is incorrect" });
    user.password = newPassword; // pre-save hook will hash this
    await user.save();
    res.json({ message: "Passwordupdated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/auth/contact ── (protected)
router.post("/contact", protect, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message?.trim()) {
      return res
        .status(400)
        .json({ message: "Name, email, and message required" });
    }
    const messageDoc = new Message({
      sender: req.user._id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
    });
    await messageDoc.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
