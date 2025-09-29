import React, { useState } from "react";

interface ImageUploaderProps {
  mallId: string;
  userRole: string; // ✅ Add userRole to properly receive the prop
  onUploadSuccess: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ mallId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  // ✅ Retrieve and validate user role
  const userRole = (localStorage.getItem("userRole") || "").toLowerCase().trim();
  console.log("User Role:", userRole); // ✅ Debugging: Check stored role value

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

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
    if (!file) return setMessage("❌ Select an image first.");

    const token = localStorage.getItem("accessToken");
    if (!token) return setMessage("❌ User not authenticated.");

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
      if (!response.ok) throw new Error(data.message || "❌ Upload failed.");

      console.log("✅ Upload successful!");
      setMessage(`✅ ${data.message}`);

      if (onUploadSuccess) onUploadSuccess();

      setTimeout(() => {
        setFile(null);
        (document.getElementById("fileInput") as HTMLInputElement).value = "";
      }, 500);
    } catch (err) {
      setMessage(`❌ Upload failed: ${(err instanceof Error ? err.message : "Unknown error")}`);
    }
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "10px 0" }}>
      {/* ✅ Only display upload section if the user is an admin */}
      {userRole === "admin" ? (
        <>
          <input type="file" accept="image/*" onChange={handleFileChange} id="fileInput" />
          {file && <p style={{ color: "green", fontSize: "14px" }}>📂 {file.name} ({(file.size / 1024).toFixed(2)} KB)</p>}
          <button onClick={handleUpload} disabled={!file} style={{ padding: "6px 10px", cursor: file ? "pointer" : "not-allowed" }}>
            Upload Image
          </button>
          {message && <p style={{ color: "blue", fontSize: "12px" }}>{message}</p>}
        </>
      ) : (
        <p style={{ color: "red", fontSize: "14px" }}>❌ You do not have permission to upload images.</p>
      )}
    </div>
  );
};

export default ImageUploader;