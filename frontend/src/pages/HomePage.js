import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    API.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to My World</h1>
          <p>
            Discover my favorite games, movies, books, and music that inspire
            creativity and joy in my life.
          </p>
          <Link to="/menja" className="snake-btn">
            <img src="menjaicon.png" alt="Snake Game" />
            <span className="play-word">PLAY</span>
          </Link>
        </div>
        <div className="hero-image">
          <a
            href="hero.png"
            target="_blank"
            rel="noopener noreferrer"
            className="hex"
          >
            <img
              src="hero.png"
              alt="Person listening to music with headphone"
            />
          </a>
        </div>
      </section>

      <section className="previews-cards">
        <div className="preview-card">
          <img src="gicon.png" alt="Gaming Icon" />
          <h2>Gaming</h2>
          <p>
            Exploring new worlds, mastering challenges, and enjoying epic
            stories through games.
          </p>
        </div>
        <div className="preview-card">
          <img src="micon.png" alt="Movie Icon" />
          <h2>Movies &amp; Series</h2>
          <p>
            Immersing in inspiring stories, amazing visuals, and creative
            storytelling.
          </p>
        </div>
        <div className="preview-card">
          <img src="bicon.png" alt="Book Icon" />
          <h2>Books</h2>
          <p>
            Reading fuels imagination, while music relaxes the mind and sparks
            creativity.
          </p>
        </div>
        <div className="preview-card">
          <img src="muicon.png" alt="Music Icon" />
          <h2>Music</h2>
          <p>
            Reading fuels imagination, while music relaxes the mind and sparks
            creativity.
          </p>
        </div>
      </section>

      <section className="highlights">
        <h3>Key Highlights</h3>
        <ul>
          <li>Exploring games from RPGs to strategy genres</li>
          <li>Watching movies and anime for inspiration</li>
          <li>Reading books to expand knowledge and imagination</li>
          <li>Listening to music to enhance mood and creativity</li>
        </ul>
      </section>

      <section className="posts-section">
        <div className="home-page">
          <h2>Latest Posts</h2>
          {loading && <p>Loading posts...</p>}
          {!loading && posts.length === 0 && (
            <p>No posts yet. Be the first to write one!</p>
          )}
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card-wrapper">
                <Link to={`/post/${post._id}`} className="post-card-link">
                  <div className="post-card">
                    {post.image && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${post.image}`}
                        alt={post.title}
                      />
                    )}
                    <h3>{post.title}</h3>
                    <p>{post.body?.substring(0, 120)}...</p>
                    <small>
                      <img
                        src={
                          post.author?.profilePic
                            ? post.author.profilePic.startsWith("avatar")
                              ? `/avatars/${post.author.profilePic}`
                              : `${process.env.REACT_APP_API_URL}/uploads/${post.author.profilePic}`
                            : "/default-avatar.png"
                        }
                        alt="Author avatar"
                        className="author-avatar"
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          verticalAlign: "middle",
                          marginRight: "8px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          console.error(
                            "Author avatar load failed:",
                            e.target.src,
                          );
                          e.target.src = "/avatars/avatar1.png";
                          e.target.onerror = null; // prevent loop
                        }}
                      />
                      {post.author?.name} ({post.author?.role}) ·{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </Link>
                {user &&
                  (user._id === post.author?._id || user.role === "admin") && (
                    <Link
                      to={`/edit-post/${post._id}`}
                      className="publish-btn"
                      style={{
                        display: "block",
                        marginTop: "10px",
                        textAlign: "center",
                      }}
                    >
                      Edit Post
                    </Link>
                  )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
