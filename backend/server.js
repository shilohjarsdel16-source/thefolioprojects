require("dotenv").config(); // Load .env variables FIRST
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

//Importroutes(youwillcreatethese files in the next steps)
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
connectDB(); //Connect to MongoDB

//──Middleware─────────────────────────────────────────────────
//Allow React frontend calls to this server
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PREVIEW_URL,
  process.env.FRONTEND_URL_PRODUCTION,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  }),
);

//Parse incomingJSONrequestbodies
app.use(express.json());

//Serveuploadedimagefilesaspublic URLs
//e.g.http://localhost:5000/uploads/my-image.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

//──Routes────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

//──StartServer──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
