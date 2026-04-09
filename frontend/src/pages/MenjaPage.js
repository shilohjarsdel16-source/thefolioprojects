import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MenjaPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        navigate("/home");
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (footer) footer.style.display = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [navigate]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      <button className="menja-back-btn" onClick={() => navigate("/home")}>
        ← Back to Home
      </button>
      <iframe
        title="MENJA Game"
        src="/menja.html"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
          minHeight: "100vh",
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

export default MenjaPage;
