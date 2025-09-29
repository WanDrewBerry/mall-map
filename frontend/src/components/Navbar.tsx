import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../utils/AuthService"; // ✅ Fixed import path

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  const [user, setUser] = useState(AuthService.getUser());
  const navigate = useNavigate();

  // ✅ Listen for authentication changes & session expiration
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(AuthService.getUser()); // ✅ Ensure Navbar updates on login/logout
    };

    window.addEventListener("storage", handleAuthChange); // ✅ Detect token changes
    return () => window.removeEventListener("storage", handleAuthChange); // ✅ Cleanup event listener
  }, []);

  // ✅ Handle logout properly using AuthService
  const handleLogout = () => {
    AuthService.logout();
    setUser(null); // ✅ Update state immediately
    navigate("/"); // ✅ Redirect to home page after logout
  };

  return (
    <nav style={{
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      backgroundColor: "#ffffff",
      padding: "6px 12px", /* ✅ Reduced padding for a cleaner look */
      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "visible"
    }}>
      {/* Left Section: Home, Register & Login Together */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link to="/" style={{
          fontWeight: "bold",
          fontSize: "18px",
          textDecoration: "none",
          color: "#333"
        }}>
          Home
        </Link>
        {!isLoggedIn && (
          <>
            <Link to="/register" style={{
              textDecoration: "none",
              color: "#007BFF"
            }}>
              Register
            </Link>
            <Link to="/login" style={{
              textDecoration: "none",
              color: "#007BFF"
            }}>
              Login
            </Link>
          </>
        )}
      </div>

      {/* Right Section: User Greeting & Logout Button */}
      {isLoggedIn && (
        <div style={{ display: "flex", alignItems: "center", marginRight: "15px", gap: "10px" }}>
          <p style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333"
          }}>
            Hi, {user?.username}!  👋
          </p>
          <button onClick={handleLogout} style={{
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: "#ff4d4d",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px"
          }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;