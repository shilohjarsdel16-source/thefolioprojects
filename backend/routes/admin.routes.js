//backend/routes/admin.routes.js
const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Message = require("../models/Message");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/role.middleware");
const router = express.Router();

//Allroutesbelowrequire:(1)valid token AND (2) admin role
router.use(protect, adminOnly);

//GET/api/admin/users—Listall non-admin members
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//PUT/api/admin/users/:id/status—Toggle member active/inactive
router.put("/users/:id/status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role === "admin")
      return res.status(404).json({ message: "User not found" });
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();
    res.json({ message: `User is now ${user.status}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET/api/admin/posts—ListALL posts including removed ones
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//PUT/api/admin/posts/:id/remove—Mark post as removed (inappropriate)
router.put("/posts/:id/remove", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.status = "removed";
    await post.save();
    res.json({ message: "Post has been removed", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); // GET /api/admin/comments — All comments grouped by post
router.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("post", "title body author status image createdAt")
      .populate("author", "name profilePic")
      .sort({ createdAt: 1 });

    const grouped = {};
    comments.forEach((comment) => {
      const postId = comment.post._id.toString();
      if (!grouped[postId]) {
        grouped[postId] = {
          post: comment.post.toObject(),
          comments: [],
        };
      }
      grouped[postId].comments.push(comment.toObject());
    });

    const result = Object.values(grouped).sort(
      (a, b) => new Date(b.post.createdAt) - new Date(a.post.createdAt),
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/messages — List all contact messages populated with sender
router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "name email profilePic")
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
