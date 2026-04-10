import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../api/axios";

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [interestLevel, setInterestLevel] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const avatarOptions = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

  // Auto-clear success message
  useEffect(() => {
    if (msg && msg.includes("successfully")) {
      const timeout = setTimeout(() => {
        setMsg("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [msg]);

  // Load register extras
  useEffect(() => {
    const registerData = localStorage.getItem("registerData");
    if (registerData && user) {
      try {
        const data = JSON.parse(registerData);
        setUsername(data.username || "");
        setDateOfBirth(data.dateOfBirth || "");
        setInterestLevel(data.interestLevel || "");
        localStorage.removeItem("registerData");
      } catch (e) {
        console.error("Invalid register data");
      }
    }
  }, [user]);

  // Fetch user's posts
  // Load profile fields from user data
  useEffect(() => {
    if (user) {
      setInterestLevel(user.interestLevel || "");
      // Load other fields if needed
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchMyPosts = async () => {
      try {
        const res = await API.get("/posts");
        const userPosts = res.data.filter(
          (p) => user.role === "admin" || p.author?._id === user._id,
        );
        setMyPosts(userPosts);
      } catch (err) {
        console.error("Error fetching posts");
      } finally {
        setPostsLoading(false);
      }
    };
    fetchMyPosts();
  }, [user]);

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg("");

    const fd = new FormData();
    fd.append("name", name);
    fd.append("bio", bio);

    // Handle file upload
    if (pic) {
      fd.append("profilePic", pic);
      console.log("Uploading custom file:", pic.name, pic.size);
    }
    // Handle avatar selection - send as text field, backend stores `avatar-X.png`
    else if (selectedAvatar) {
      fd.append("profilePic", `avatar${selectedAvatar}.png`);
      console.log("Using avatar:", `avatar${selectedAvatar}.png`);
    }

    if (username) fd.append("username", username);
    if (dateOfBirth) fd.append("dateOfBirth", dateOfBirth);
    fd.append("interestLevel", interestLevel || "");

    // Log FormData
    console.log("FormData entries:", Array.from(fd.entries()));

    try {
      const { data } = await API.put("/auth/profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Profile update success:", data.profilePic);

      setUser(data);
      setMsg("Profile updated successfully!");

      // Reset states
      setPic(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSelectedAvatar(null);

      // Refresh full user data
      try {
        const meRes = await API.get("/auth/me");
        setUser(meRes.data);
      } catch (refreshErr) {
        console.warn("User refresh failed:", refreshErr);
      }
    } catch (err) {
      console.error("Profile update failed:", err.response?.data || err);
      setMsg(
        err.response?.data?.message || "Error updating profile. Check console.",
      );
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.put("/auth/change-password", {
        currentPassword: curPw,
        newPassword: newPw,
      });
      setMsg("Password changed successfully!");
      setCurPw("");
      setNewPw("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const picSrc = selectedAvatar
    ? `/avatars/avatar${selectedAvatar}.png`
    : user?.profilePic
      ? user.profilePic.startsWith("avatar")
        ? `/avatars/${user.profilePic}`
        : `${process.env.REACT_APP_API_URL}/uploads/${user.profilePic}`
      : "/avatars/avatar1.png"; // Better default fallback

  return (
    <main className="profile-container ProfilePage">
      <div className="profile-card">
        <article className="profile-preview">
          <h2 className="profile-title">My Profile</h2>
          <figure className="profile-pic-container">
            <img
              src={picSrc}
              alt="Current profile"
              className="profile-pic-preview"
              onError={(e) => {
                console.error("Profile preview load failed:", e.target.src);
                e.target.src = "/avatars/avatar1.png";
                e.target.onerror = null;
              }}
            />
            <figcaption className="profile-name">
              {user?.name || "No name set"}
            </figcaption>
            <p className="profile-username">
              {user?.username || "No username set"}
            </p>
            <p className="profile-email">{user?.email || "No email set"}</p>
            <p className="profile-bio">{user?.bio || "No bio entered yet"}</p>
          </figure>
        </article>
      </div>
      <div style={{ padding: "30px 0", textAlign: "center" }}>
        <button
          onClick={logout}
          className="logout-btn publish-btn"
          style={{
            background: "#dc3545",
            color: "white",
            padding: "12px 24px",
            fontSize: "16px",
            minWidth: "120px",
          }}
        >
          Logout
        </button>
      </div>
      {msg && (
        <div className="success-banner">
          <p className="success-msg">{msg}</p>
        </div>
      )}

      <div className="avatar-choice-card profile-form">
        <h3>Choose Default Avatar</h3>
        <p>Pick a default avatar if you don&apos;t want to upload a picture</p>
        <div className="avatars-grid">
          {avatarOptions.map((option) => (
            <div
              key={option.id}
              className={`avatar-option ${selectedAvatar === option.id ? "selected" : ""}`}
              onClick={() => setSelectedAvatar(option.id)}
              title={`Avatar ${option.id}`}
            >
              <img
                src={`/avatars/avatar${option.id}.png`}
                alt={`Avatar ${option.id}`}
                onError={(e) => {
                  e.target.src = "/avatars/avatar1.png";
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="profile-forms">
        <form onSubmit={handleProfile} className="profile-form">
          <h3>Edit Profile</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display name"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio..."
            rows={3}
          />

          <label>Change Profile Picture (optional):</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setPic(e.target.files?.[0] || null)}
          />
          <button
            type="submit"
            disabled={
              !pic &&
              !selectedAvatar &&
              name === user?.name &&
              bio === user?.bio
            }
          >
            Save Profile
          </button>
        </form>

        <form onSubmit={handlePassword} className="profile-form">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current password"
            value={curPw}
            onChange={(e) => setCurPw(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password (min 6 chars)"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit">Change Password</button>
        </form>
      </div>

      {/* New My Posts section */}
      <section className="my-posts-section" style={{ marginTop: "40px" }}>
        <h3
          style={{
            textAlign: "center",
            color: "#e6eff7",
            marginBottom: "20px",
          }}
        >
          Posts ({myPosts.length})
        </h3>
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : myPosts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#beaedb" }}>
            No posts yet. <Link to="/create-post">Create one!</Link>
          </p>
        ) : (
          <div className="profile-posts-horizontal">
            {myPosts.map((post) => (
              <div
                key={post._id}
                className="post-card"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                {post.image && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${post.image}`}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
                <h4 style={{ margin: "10px 0" }}>
                  <Link
                    to={`/post/${post._id}`}
                    style={{ color: "#031a2e", textDecoration: "none" }}
                  >
                    {post.title}
                  </Link>
                </h4>
                <p style={{ color: "#4813ab" }}>
                  {post.body.substring(0, 100)}...
                </p>
                <div style={{ marginTop: "10px" }}>
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="publish-btn"
                    style={{
                      display: "inline-block",
                      marginRight: "10px",
                      padding: "8px 16px",
                      fontSize: "14px",
                    }}
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/post/${post._id}`}
                    style={{ color: "#330c7a", fontSize: "14px" }}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
