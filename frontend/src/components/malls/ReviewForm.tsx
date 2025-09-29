import React, { useState } from "react";

interface ReviewFormProps {
  mallId: string;
  onReviewAdded: () => void;
  setShowReviewForm: (visible: boolean) => void; // ✅ Hide form after submission
}

const ReviewForm: React.FC<ReviewFormProps> = ({ mallId, onReviewAdded, setShowReviewForm }) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    const token = localStorage.getItem("accessToken");

    console.log("Mall ID before sending review:", mallId);
    console.log("Access Token:", token);
    console.log("Review Data:", { rating, comment });

    if (!token) {
      setError("❌ You must be logged in to submit a review.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/malls/${mallId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      console.log("🔍 Server Response:", data);

      if (!response.ok) throw new Error(data.message || "❌ Failed to submit review.");

      alert("✅ Review added!");
      setRating(5);
      setComment("");
      onReviewAdded();
      setShowReviewForm(false);
    } catch (error) {
      console.error("🚨 Error submitting review:", error);
      setError((error as Error).message);
    }

    setLoading(false);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        marginBottom: "10px",
        padding: "20px", 
        border: "1px solid #ccc", 
        borderRadius: "10px", 
        textAlign: "left",
        width: "92%", 
        maxWidth: "100%",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        position: "relative" /* ✅ Allows the cancel button to be positioned */
      }}
    >
      {/* ✅ Cancel Button (Upper Right Corner) */}
      <button 
        onClick={() => setShowReviewForm(false)} 
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
          color: "#999",
        }}
      >
        ❌
      </button>

      <h3 style={{ marginBottom: "15px", color: "#333" }}>Write a Review</h3>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Rating:</label>
      <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => setRating(index + 1)}
            style={{
              cursor: "pointer",
              fontSize: "24px",
              color: index < rating ? "#FFD700" : "#ccc"
            }}
          >
            ★
          </span>
        ))}
      </div>

      <label style={{ display: "block", marginBottom: "5px", color: "#555" }}>Comment:</label>
      <textarea 
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
        style={{ 
          width: "100%", 
          minHeight: "100px", 
          padding: "10px", 
          borderRadius: "5px", 
          border: "1px solid #ddd", 
          fontSize: "16px",
          lineHeight: "1.5",
          boxSizing: "border-box", 
          marginBottom: "15px"
        }}
      />

      <button
        type="submit"
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "all 0.3s ease-in-out",
        }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;