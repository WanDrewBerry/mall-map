import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/AuthService";
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        console.log("🌐 API_BASE:", API_BASE); // ✅ Debug: confirm correct endpoint
        const checkAuthStatus = async () => {
            try {
                const accessToken = AuthService.getToken();
                const response = await fetch(`${API_BASE}/api/auth/status`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    credentials: "include",
                });
                const data = await response.json();
                if (data.status === true) {
                    console.log("✅ Already authenticated:", data.user);
                    navigate("/mall-map");
                }
                else {
                    console.log("🚫 Not authenticated:", data.message);
                }
            }
            catch (err) {
                console.error("❌ Error checking auth status:", err);
            }
        };
        checkAuthStatus();
    }, [navigate]);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await response.json();
            if (response.ok && data.accessToken) {
                AuthService.login(data.accessToken);
                window.dispatchEvent(new Event("storage"));
                console.log("➡️ Redirecting to /mall-map...");
                navigate("/mall-map");
            }
            else {
                console.warn("🚫 Login failed:", data);
                setErrorMessage(data.message || "❌ Incorrect credentials.");
            }
        }
        catch (err) {
            console.error("❌ Login request error:", err);
            setErrorMessage("❌ Login failed. Please try again.");
        }
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsx("h2", { style: titleStyle, children: "Login" }), errorMessage && _jsx("p", { style: errorStyle, children: errorMessage }), _jsxs("form", { onSubmit: handleSubmit, style: formStyle, children: [_jsx("input", { type: "email", name: "email", placeholder: "Email", onChange: handleChange, required: true, style: inputStyle }), _jsx("input", { type: "password", name: "password", placeholder: "Password", onChange: handleChange, required: true, style: inputStyle }), _jsx("button", { type: "submit", style: buttonStyle, onMouseOver: (e) => (e.currentTarget.style.transform = "scale(1.05)"), onMouseOut: (e) => (e.currentTarget.style.transform = "scale(1.0)"), onMouseDown: (e) => (e.currentTarget.style.transform = "scale(0.95)"), onMouseUp: (e) => (e.currentTarget.style.transform = "scale(1.05)"), children: "Login" })] })] }));
};
// ✅ Styling remains unchanged
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "white",
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
const formStyle = {
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
const buttonStyle = {
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
export default Login;
