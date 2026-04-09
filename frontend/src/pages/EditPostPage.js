import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import "../App.css";

const EditPostPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  useAuth();
  const navigate = useNavigate();

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        const postData = res.data;
        setTitle(postData.title || "");
        setBody(postData.body || "");
        setError("");
      } catch (err) {
        setError("Post not found or you don't have permission to edit");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdating(true);
    try {
      await API.put(`/posts/${id}`, { title, body });
      alert("Post updated successfully!");
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <section className="register">
        <div className="postpage-loading">Loading post...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="register">
        <div className="postpage-error">{error}</div>
        <button className="publish-btn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </section>
    );
  }

  return (
    <section className="register">
      <div className="register-content">
        <div className="register-form">
          <h2 className="map-caption">Edit Post: {title}</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="body">Content:</label>
            <textarea
              id="body"
              placeholder="Post Content"
              rows="10"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            {error && (
              <p className="error-msg" style={{ color: "red" }}>
                {error}
              </p>
            )}
            <button type="submit" disabled={updating} className="publish-btn">
              {updating ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditPostPage;
