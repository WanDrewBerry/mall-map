import { jwtDecode } from "jwt-decode";

const AuthService = {
  login: (token: string): void => {
    localStorage.setItem("accessToken", token);

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.id) {
        localStorage.setItem("userId", decoded.id);
        localStorage.setItem("username", decoded.username || "Guest");
        localStorage.setItem("role", decoded.role || "user"); // 🔥 Stores role
        console.log("✅ Stored user:", decoded);
      } else {
        console.error("🚨 Error: No user ID found in decoded token!");
      }
    } catch (error) {
      console.error("❌ Token decoding failed:", error);
    }
  },

  logout: (navigate?: (path: string) => void): void => {
    console.log("🚨 Logging out...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("role"); // 🔥 Removes role on logout

    window.dispatchEvent(new Event("storage")); // ✅ Notify components of logout
    
    if (navigate) {
      navigate("/"); // ✅ Uses React Router if provided
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        console.log("🚨 Session expired! Auto logging out...");
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Token decoding failed:", error);
      return false;
    }
  },

  checkSessionExpiration: (navigate?: (path: string) => void): void => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        console.log("🚨 Token expired, logging out...");
        AuthService.logout(navigate); // ✅ Properly handle logout when session expires
      }
    } catch (error) {
      console.error("❌ Token decoding failed:", error);
    }
  },

  getUser: (): { id: string; username: string; role: string } | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return { id: decoded.id, username: decoded.username, role: decoded.role };
    } catch (error) {
      console.error("❌ Token decoding failed:", error);
      return null;
    }
  },
};

export default AuthService;