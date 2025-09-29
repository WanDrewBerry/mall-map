import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/AuthService";

const SessionHandler: React.FC = () => {
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false); // ✅ Track redirection

  useEffect(() => {
    if (!AuthService.isAuthenticated() && !hasRedirected) {
      console.log("🚨 Redirecting to homepage due to session expiration...");
      setHasRedirected(true); // ✅ Prevents infinite redirects
      navigate("/");
    }
  }, [navigate, hasRedirected]); // ✅ Includes hasRedirected to prevent re-runs

  return null;
};

export default SessionHandler;