import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("🔍 Registration Response:", data);

      if (response.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.dispatchEvent(new Event("storage"));

        console.log("🚀 Registration successful! Logging in & redirecting...");
        navigate("/mall-map");
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error("🚨 Error during registration:", err);
      setErrorMessage("An error occurred during registration.");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Register</h2>

      {errorMessage && <p style={errorStyle}>{errorMessage}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required style={inputStyle} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />

        {/* ✅ Button with dynamic hover & click effects */}
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1.0)"}
          onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
          onMouseUp={(e) => e.currentTarget.style.transform = "scale(1.05)"}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

/* ✅ Professional Styling */
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "#white",
  animation: "fadeIn 1s ease-in-out",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const errorStyle = {
  color: "red",
  fontSize: "16px",
  marginBottom: "10px",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  background: "white",
  width: "320px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "16px",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(90deg, #007BFF, #0056b3)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  transition: "all 0.3s ease-in-out",
};

export default Register;