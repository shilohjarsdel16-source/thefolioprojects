import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import "../App.css";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
        setLikes(res.data.likes || 0);
        const commentsRes = await API.get(`/comments/${id}`);
        setComments(commentsRes.data);
      } catch (err) {
        setError("Post not found or error loading post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = () => {
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmType, setDeleteConfirmType] = useState(""); // 'post' or 'comment'
  const [targetId, setTargetId] = useState("");

  // Post delete handlers
  const handleDeleteClick = () => {
    setDeleteConfirmType("post");
    setTargetId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await API.delete(`/posts/${targetId}`);
      navigate("/profile");
    } catch (err) {
      setError("Failed to delete post");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Comment delete handlers
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const handleDeleteCommentClick = (commentId) => {
    setDeleteConfirmType("comment");
    setTargetId(commentId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCommentConfirm = async () => {
    setDeletingCommentId(targetId);
    try {
      await API.delete(`/comments/${targetId}`);
      setComments(comments.filter((c) => c._id !== targetId));
    } catch (err) {
      setError("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteConfirmType("");
    setTargetId("");
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      const res = await API.post(`/comments/${id}`, { body: newComment });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  if (loading) return <div className="loading-post">Loading post...</div>;
  if (error)
    return (
      <section className="single-post-page">
        <div style={{ textAlign: "center", padding: "40px", color: "#beaedb" }}>
          {error}
          <br />
          <button className="back-btn" onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </section>
    );

  const isOwner =
    user && post && (user._id === post.author?._id || user.role === "admin");

  // Format timestamp
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <section className="single-post-page">
      {/* Facebook-style Post Card */}
      <div className="fb-post-container">
        {/* Post Header with Author Info */}
        <div className="fb-post-header">
          <div className="fb-author-info">
            <img
              src={
                post.author?.profilePic
                  ? post.author.profilePic.startsWith("avatar")
                    ? `/avatars/${post.author.profilePic}`
                    : `${process.env.REACT_APP_BACKEND_URL}/uploads/${post.author.profilePic}`
                  : "/default-avatar.png"
              }
              alt="Author avatar"
              className="fb-avatar"
              onError={(e) => {
                e.target.src = "/avatars/avatar1.png";
                e.target.onerror = null;
              }}
            />
            <div className="fb-author-details">
              <h4 className="fb-author-name">
                {post.author?.name || "Anonymous"}
              </h4>
              <span className="fb-post-time">{formatDate(post.createdAt)}</span>
            </div>
          </div>
          {isOwner && (
            <div className="fb-post-menu">
              <details className="dropdown-menu">
                <summary>⋯</summary>
                <div className="dropdown-content">
                  <Link to={`/edit-post/${id}`} className="dropdown-item">
                    ✏️ Edit Post
                  </Link>
                  <button
                    onClick={handleDeleteClick}
                    className="dropdown-item delete-item"
                  >
                    🗑️ Delete Post
                  </button>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="fb-post-content">
          <p className="fb-post-body">{post.body}</p>
        </div>

        {/* Post Image */}
        {post.image && (
          <div className="fb-post-image">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`}
              alt="Post content"
            />
          </div>
        )}

        {/* Post Stats */}
        <div className="fb-post-stats">
          <span className="fb-stat">
            👍 {likes} {likes === 1 ? "like" : "likes"}
          </span>
          <span className="fb-stat">
            💬 {comments.length}{" "}
            {comments.length === 1 ? "comment" : "comments"}
          </span>
        </div>

        {/* Post Action Buttons */}
        <div className="fb-post-actions">
          <button
            className={`fb-action-btn ${hasLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            👍 Like
          </button>
          <button className="fb-action-btn">💬 Comment</button>
          <button className="fb-action-btn">↗️ Share</button>
        </div>

        {/* Comments Section */}
        <div className="fb-comments-section">
          {/* New Comment Form */}
          {user && (
            <div className="fb-new-comment">
              <img
                src={
                  user.profilePic
                    ? user.profilePic.startsWith("avatar")
                      ? `/avatars/${user.profilePic}`
                      : `${process.env.REACT_APP_BACKEND_URL}/uploads/${user.profilePic}`
                    : "/default-avatar.png"
                }
                alt="Your avatar"
                className="fb-comment-avatar"
                onError={(e) => {
                  e.target.src = "/avatars/avatar1.png";
                  e.target.onerror = null;
                }}
              />
              <form onSubmit={handleAddComment} className="fb-comment-form">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="fb-comment-input"
                  required
                />
                <button type="submit" className="fb-comment-submit">
                  Post
                </button>
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="fb-comments-list">
            {comments.length === 0 ? (
              <p className="fb-no-comments">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => {
                const isCommentOwner = user && user._id === comment.author?._id;
                const canDeleteComment =
                  isCommentOwner || (user && user.role === "admin");
                return (
                  <div key={comment._id} className="fb-comment">
                    <img
                      src={
                        comment.author?.profilePic
                          ? comment.author.profilePic.startsWith("avatar")
                            ? `/avatars/${comment.author.profilePic}`
                            : `${process.env.REACT_APP_BACKEND_URL}/uploads/${comment.author.profilePic}`
                          : "/default-avatar.png"
                      }
                      alt="Commenter avatar"
                      className="fb-comment-avatar"
                      onError={(e) => {
                        e.target.src = "/avatars/avatar1.png";
                        e.target.onerror = null;
                      }}
                    />
                    <div className="fb-comment-content">
                      <div className="fb-comment-bubble">
                        <strong className="fb-comment-author">
                          {comment.author?.name || "Anonymous"}
                        </strong>
                        <p className="fb-comment-text">{comment.body}</p>
                      </div>
                      {canDeleteComment && (
                        <button
                          onClick={() => handleDeleteCommentClick(comment._id)}
                          className="fb-comment-delete"
                          title="Delete comment"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fb-modal-overlay" onClick={handleDeleteCancel}>
          <div
            className="fb-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="fb-modal-title">
              {deleteConfirmType === "post"
                ? "Delete Post?"
                : "Delete Comment?"}
            </h3>
            <p className="fb-modal-message">
              {deleteConfirmType === "post"
                ? "This action cannot be undone. This will permanently delete the post and all its comments."
                : "This action cannot be undone. This will permanently delete your comment."}
            </p>
            <div className="fb-modal-actions">
              <button
                onClick={
                  deleteConfirmType === "post"
                    ? handleDeleteConfirm
                    : handleDeleteCommentConfirm
                }
                disabled={deleting || deletingCommentId === targetId}
                className="fb-btn-delete"
              >
                {deleting || deletingCommentId === targetId
                  ? deleteConfirmType === "post"
                    ? "Deleting..."
                    : "Deleting..."
                  : deleteConfirmType === "post"
                    ? "Delete Post"
                    : "Delete Comment"}
              </button>
              <button onClick={handleDeleteCancel} className="fb-btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostPage;
