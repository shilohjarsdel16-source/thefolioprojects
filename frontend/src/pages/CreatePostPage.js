import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../App.css";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.append("title", title);
    fd.append("body", body);
    if (image) fd.append("image", image);
    try {
      await API.post("/posts", fd);
      setSuccess("Post is successfully posted!");
      setTitle("");
      setBody("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        setSuccess("");
        navigate("/home");
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <main className="page-main">
        <h2 className="page-title">Write a New Post</h2>
        {success && (
          <div className="success-banner">
            <div className="success-msg">{success}</div>
          </div>
        )}
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title..."
              required
              disabled={loading || !!success}
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Post Content</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post here..."
              rows={12}
              required
              disabled={loading || !!success}
            />
          </div>
          <div className="admin-upload form-group">
            <label htmlFor="image">Upload Cover Image:</label>
            <input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              disabled={loading || !!success}
            />
          </div>
          <button type="submit" disabled={loading} className="publish-btn">
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreatePostPage;
