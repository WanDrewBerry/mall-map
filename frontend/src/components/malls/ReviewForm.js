import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const ReviewForm = ({ mallId, onReviewAdded, setShowReviewForm }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading)
            return;
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
            if (!response.ok)
                throw new Error(data.message || "❌ Failed to submit review.");
            alert("✅ Review added!");
            setRating(5);
            setComment("");
            onReviewAdded();
            setShowReviewForm(false);
        }
        catch (error) {
            console.error("🚨 Error submitting review:", error);
            setError(error.message);
        }
        setLoading(false);
    };
    return (_jsxs("form", { onSubmit: handleSubmit, style: {
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
        }, children: [_jsx("button", { onClick: () => setShowReviewForm(false), style: {
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "transparent",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#999",
                }, children: "\u274C" }), _jsx("h3", { style: { marginBottom: "15px", color: "#333" }, children: "Write a Review" }), error && _jsx("p", { style: { color: "red", fontWeight: "bold" }, children: error }), _jsx("label", { style: { display: "block", marginBottom: "5px", color: "#555" }, children: "Rating:" }), _jsx("div", { style: { display: "flex", gap: "5px", marginBottom: "15px" }, children: [...Array(5)].map((_, index) => (_jsx("span", { onClick: () => setRating(index + 1), style: {
                        cursor: "pointer",
                        fontSize: "24px",
                        color: index < rating ? "#FFD700" : "#ccc"
                    }, children: "\u2605" }, index))) }), _jsx("label", { style: { display: "block", marginBottom: "5px", color: "#555" }, children: "Comment:" }), _jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), style: {
                    width: "100%",
                    minHeight: "100px",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "16px",
                    lineHeight: "1.5",
                    boxSizing: "border-box",
                    marginBottom: "15px"
                } }), _jsx("button", { type: "submit", style: {
                    padding: "10px 20px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "all 0.3s ease-in-out",
                }, disabled: loading, children: loading ? "Submitting..." : "Submit Review" })] }));
};
export default ReviewForm;
