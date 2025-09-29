import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/AuthService";

const LandingPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AuthService.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate("/mall-map", { replace: true });
    }
    const handleAuthChange = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
    };
    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, [navigate]);

  const handleExploreClick = () => {
    isAuthenticated ? navigate("/mall-map") : navigate("/login");
  };

  return (
    <>
      {/* ✅ Main container - Full Page Design */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        overflow: "hidden",
        background: "white",
        textAlign: "center",
        padding: "20px",
        animation: "fadeIn 1s ease-in-out", // ✅ Added fade-in effect
      }}>
        {/* ✅ Emojis positioned at the top */}
        <div style={{ fontSize: "48px", marginBottom: "15px" }}>
          🏢🗺️
        </div>

        {/* ✅ Title */}
        <h1 style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#333",
          textShadow: "3px 3px 6px rgba(0,0,0,0.1)",
        }}>
          Welcome to Mall Map
        </h1>

        {/* ✅ Paragraph */}
        <p style={{
          fontSize: "20px",
          color: "#444",
          maxWidth: "650px",
          marginBottom: "25px",
        }}>
          Discover malls, explore stores, and find your next favorite shopping spot with ease.
        </p>

        {/* ✅ User & Admin Info */}
        <p style={{
          fontSize: "18px",
          color: "#666",
          maxWidth: "550px",
          fontStyle: "italic",
          marginBottom: "25px",
        }}>
          <strong>Admin:</strong> Can upload and delete images & reviews. <br />
          <strong>User:</strong> Can add reviews only.
        </p>

        {/* ✅ Dynamic Button */}
        <button
          onClick={handleExploreClick}
          style={{
            padding: "14px 30px",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "linear-gradient(90deg, #007bff, #0056b3)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease-in-out",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.07)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1.0)"}
        >
          Explore Malls 🚀
        </button>
      </div>

      {/* ✅ Fixed Full-Width Footer */}
      <footer style={{
        padding: "15px",
        backgroundColor: "#222",
        color: "white",
        width: "100vw",
        textAlign: "center",
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        fontSize: "14px",
        margin: "0",
      }}>
        <p style={{ marginBottom: "8px" }}>© 2025 Mall Map | All Rights Reserved</p>
        <p>
          <a href="/terms" style={{ color: "#bbb", textDecoration: "none", marginRight: "15px" }}>Terms of Service</a>
          <a href="/privacy" style={{ color: "#bbb", textDecoration: "none" }}>Privacy Policy</a>
        </p>
      </footer>
    </>
  );
};

/* ✅ Ensure fadeIn animation is defined */
const fadeInAnimation = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;

/* ✅ Inject animation into the document */
const styleSheet = document.createElement("style");
styleSheet.innerText = fadeInAnimation;
document.head.appendChild(styleSheet);

export default LandingPage;