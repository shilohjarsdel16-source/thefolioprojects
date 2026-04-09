import { useState, useEffect } from "react";
import API from "../api/axios";

// Fixed and styled AdminPage.js
const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, postsRes, messagesRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/posts"),
          API.get("/admin/messages"),
        ]);
        setUsers(usersRes.data);
        setPosts(postsRes.data);
        setMessages(messagesRes.data);
      } catch (err) {
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const toggleStatus = async (id) => {
    if (!window.confirm("Toggle user status?")) return;
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(users.map((u) => (u._id === id ? data.user : u)));
    } catch (err) {
      alert("Failed to update status");
    }
  };
  const removePost = async (id) => {
    if (!window.confirm("Remove this post?")) return;
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(
        posts.map((p) => (p._id === id ? { ...p, status: "removed" } : p)),
      );
    } catch (err) {
      alert("Failed to remove post");
    }
  };
  if (loading)
    return (
      <div className="create-post-container">
        {" "}
        <h2 className="page-title">Loading Admin Dashboard...</h2>
      </div>
    );
  if (error)
    return (
      <div className="create-post-container">
        <div className="error-msg">{error}</div>
      </div>
    );

  return (
    <div className="create-post-container">
      <h2 className="page-title">Admin Dashboard</h2>
      <nav className="admin-tabs" style={{ marginBottom: "30px" }}>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            gap: "10px",
            padding: 0,
          }}
        >
          <li>
            <button
              onClick={() => setTab("users")}
              className={`nav-btn ${tab === "users" ? "active" : ""}`}
              style={{ padding: "12px 24px", fontSize: "16px" }}
            >
              Members ({users.length})
            </button>
          </li>
          <li>
            <button
              onClick={() => setTab("posts")}
              className={`nav-btn ${tab === "posts" ? "active" : ""}`}
              style={{ padding: "12px 24px", fontSize: "16px" }}
            >
              All Posts ({posts.length})
            </button>
          </li>
          <li>
            <button
              onClick={() => setTab("messages")}
              className={`nav-btn ${tab === "messages" ? "active" : ""}`}
              style={{ padding: "12px 24px", fontSize: "16px" }}
            >
              Messages ({messages.length})
            </button>
          </li>
        </ul>
      </nav>
      {tab === "users" && (
        <div
          className="preview-card"
          style={{ padding: "25px", marginBottom: "20px" }}
        >
          <table
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              borderCollapse: "collapse",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(45deg, #3f2a52, #75619d)",
                }}
              >
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ padding: "15px" }}>{u.name}</td>
                  <td style={{ padding: "15px" }}>{u.email}</td>
                  <td style={{ padding: "15px" }}>
                    <span
                      className="status-badge"
                      style={{
                        background:
                          u.status === "active" ? "#3f2a52" : "#dc3545",
                        color: "#e6eff7",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        textShadow: "0 0 10px #beaedb",
                        boxShadow: "0 0 15px rgba(190,174,219,0.5)",
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <button
                      onClick={() => toggleStatus(u._id)}
                      className="publish-btn"
                      style={{
                        background:
                          u.status === "active" ? "#dc3545" : "#3f2a52",
                        margin: 0,
                        padding: "10px 20px",
                        fontSize: "14px",
                        minWidth: "120px",
                      }}
                    >
                      {u.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "posts" && (
        <div
          className="preview-card"
          style={{ padding: "25px", marginBottom: "20px" }}
        >
          <table
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              borderCollapse: "collapse",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(45deg, #3f2a52, #75619d)",
                }}
              >
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Title
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Author
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id}>
                  <td style={{ padding: "15px" }}>{p.title}</td>
                  <td style={{ padding: "15px" }}>
                    {p.author?.name || "Unknown"}
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span
                      className="status-badge"
                      style={{
                        background:
                          p.status === "published"
                            ? "#28a745"
                            : p.status === "removed"
                              ? "#dc3545"
                              : "#ffc107",
                        color: "#e6eff7",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        textShadow: "0 0 10px #beaedb",
                        boxShadow: "0 0 15px rgba(190,174,219,0.5)",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    {p.status === "published" && (
                      <button
                        className="publish-btn btn-danger"
                        onClick={() => removePost(p._id)}
                        style={{
                          background: "#dc3545",
                          padding: "10px 20px",
                          fontSize: "14px",
                          minWidth: "100px",
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "messages" && (
        <div
          className="preview-card"
          style={{ padding: "25px", marginBottom: "20px" }}
        >
          <table
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              borderCollapse: "collapse",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(45deg, #3f2a52, #75619d)",
                }}
              >
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Sender
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Message Preview
                </th>
                <th
                  style={{
                    padding: "15px",
                    color: "#e6eff7",
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m._id}>
                  <td style={{ padding: "15px" }}>{m.name}</td>
                  <td style={{ padding: "15px" }}>{m.email}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ fontSize: "14px", color: "#e6eff7" }}>
                      {m.message.substring(0, 100)}...
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
