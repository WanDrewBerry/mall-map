import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
const ImageUploader = ({ mallId, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    // ✅ Retrieve and validate user role
    const userRole = (localStorage.getItem("userRole") || "").toLowerCase().trim();
    console.log("User Role:", userRole); // ✅ Debugging: Check stored role value
    const handleFileChange = (e) => {
        if (!e.target.files?.[0])
            return;
        const selectedFile = e.target.files[0];
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(selectedFile.type)) {
            setMessage("❌ Invalid file type. Upload PNG or JPEG.");
            setFile(null);
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            setMessage("❌ File size too large. Max 5MB.");
            setFile(null);
            return;
        }
        setFile(selectedFile);
        setMessage("✅ File selected!");
    };
    const handleUpload = async () => {
        if (!file)
            return setMessage("❌ Select an image first.");
        const token = localStorage.getItem("accessToken");
        if (!token)
            return setMessage("❌ User not authenticated.");
        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("mallId", mallId);
            const response = await fetch(`/api/malls/${mallId}/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await response.json();
            if (!response.ok)
                throw new Error(data.message || "❌ Upload failed.");
            console.log("✅ Upload successful!");
            setMessage(`✅ ${data.message}`);
            if (onUploadSuccess)
                onUploadSuccess();
            setTimeout(() => {
                setFile(null);
                document.getElementById("fileInput").value = "";
            }, 500);
        }
        catch (err) {
            setMessage(`❌ Upload failed: ${(err instanceof Error ? err.message : "Unknown error")}`);
        }
    };
    return (_jsx("div", { style: { padding: "10px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "10px 0" }, children: userRole === "admin" ? (_jsxs(_Fragment, { children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileChange, id: "fileInput" }), file && _jsxs("p", { style: { color: "green", fontSize: "14px" }, children: ["\uD83D\uDCC2 ", file.name, " (", (file.size / 1024).toFixed(2), " KB)"] }), _jsx("button", { onClick: handleUpload, disabled: !file, style: { padding: "6px 10px", cursor: file ? "pointer" : "not-allowed" }, children: "Upload Image" }), message && _jsx("p", { style: { color: "blue", fontSize: "12px" }, children: message })] })) : (_jsx("p", { style: { color: "red", fontSize: "14px" }, children: "\u274C You do not have permission to upload images." })) }));
};
export default ImageUploader;
