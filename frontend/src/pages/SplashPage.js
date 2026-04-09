import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function SplashPage() {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [bouncingIcon, setBouncingIcon] = useState(0);

  useEffect(() => {
    // Icon bounce loop
    const bounceInterval = setInterval(() => {
      setBouncingIcon((prev) => (prev + 1) % 4);
    }, 500);

    // After loading time (4 seconds), fade out and redirect
    const timeout = setTimeout(() => {
      clearInterval(bounceInterval);
      setIsFadingOut(true);

      // Wait for fade animation, then redirect
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    }, 4000);

    return () => {
      clearInterval(bounceInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  const icons = ["🎬", "🎮", "📖", "🎵"];
  const labels = ["Movies", "Gaming", "Books", "Music"];

  return (
    <div
      className="splash-container"
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #a16bd8, #6b2b8c, #8e44ad, #9b59b6)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 6s ease infinite",
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
        @keyframes glow {
          0% { text-shadow: 6px 6px 0 #e48df2, 0 0 20px #ffe3a3, 0 0 40px #e48df2; }
          100% { text-shadow: 6px 6px 0 #e48df2, 0 0 30px #ffe3a3, 0 0 60px #e48df2; }
        }
        @keyframes bounce {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-12px) scale(1.1); }
          60% { transform: translateY(0) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }
        .splash-logo {
          font-size: 4rem;
          font-weight: 800;
          color: #ffe3a3;
          text-shadow: 6px 6px 0 #e48df2, 0 0 20px #ffe3a3, 0 0 40px #e48df2;
          animation: float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate;
        }
        .splash-tagline {
          font-size: 1.2rem;
          color: #ffe3a3;
          margin-top: 10px;
          opacity: 0.8;
          text-shadow: 0 0 10px #e48df2;
        }
        .splash-icons {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
        }
        .splash-icon-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }
        .splash-icon {
          font-size: 2.5rem;
          transition: all 0.3s ease;
        }
        .splash-icon.active {
          opacity: 1;
          transform: scale(1.1);
          animation: bounce 0.6s ease;
        }
        .splash-icon.inactive {
          opacity: 0.5;
        }
        .splash-icon-label {
          font-size: 0.8rem;
          color: #ffe3a3;
          opacity: 0.7;
          text-shadow: 0 0 5px #e48df2;
        }
        @media (max-width: 768px) {
          .splash-logo { font-size: 3rem; }
          .splash-tagline { font-size: 1rem; }
          .splash-icon { font-size: 2rem; }
        }
      `}</style>
      <div
        className="splash"
        style={{
          textAlign: "center",
          opacity: isFadingOut ? 0 : 1,
          transition: "opacity 1.2s ease",
        }}
      >
        <h1 className="splash-logo">LEEVIBES</h1>
        <p className="splash-tagline">Discover My World</p>

        <div className="splash-icons">
          {icons.map((icon, index) => (
            <div key={index} className="splash-icon-container">
              <span
                className={`splash-icon ${index === bouncingIcon ? "active" : "inactive"}`}
              >
                {icon}
              </span>
              <span className="splash-icon-label">{labels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SplashPage;
