import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/malls/ReviewForm";
import ImageUploader from "../components/malls/ImageUploader";
const MallDetails = () => {
    const { id } = useParams();
    const [mall, setMall] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const storedRole = localStorage.getItem("role") || "";
        console.log("🛠️ Debug: Retrieved role from localStorage:", storedRole); // ✅ Debugging role
        setUserRole(storedRole);
    }, []);
    const fetchMallDetails = async () => {
        try {
            setLoading(true); // ✅ Prevents loading state issues
            const response = await fetch(`http://localhost:5000/api/malls/${id}`);
            if (!response.ok)
                throw new Error("Failed to fetch mall details.");
            const data = await response.json();
            console.log("🛠️ Debug: Full API Response for Mall:", data);
            setMall({
                _id: data._id,
                name: data.name,
                description: data.description,
                address: data.address,
                location: data.location,
                stores: data.stores ?? [],
                reviews: data.reviews ?? [],
                photos: data.images?.map((img) => ({
                    _id: img._id ?? `missing-${Math.random()}`,
                    url: img.url,
                })) ?? [],
            });
        }
        catch (error) {
            console.error("🚨 Error fetching mall details:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log("Mall ID from URL Params:", id);
        fetchMallDetails();
    }, [id]);
    const handleDeletePhoto = async (imageId) => {
        if (!imageId) {
            console.error("🚨 Error: Missing Image ID in delete request.");
            return;
        }
        console.log("🛠️ Debug: Attempting to delete image with ID:", imageId); // ✅ Debug before request
        try {
            const response = await fetch(`http://localhost:5000/api/malls/${id}/images/${imageId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            if (!response.ok)
                throw new Error(`❌ Failed to delete image: ${response.statusText}`);
            console.log("✅ Image deleted successfully!");
            setMall((prev) => prev ? { ...prev, photos: prev.photos.filter((photo) => photo._id !== imageId) } : null);
        }
        catch (error) {
            console.error("🚨 Error deleting image:", error);
        }
    };
    const handleDeleteReview = async (reviewId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/malls/${id}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            if (!response.ok)
                throw new Error("❌ Failed to delete review.");
            setMall((prev) => prev ? { ...prev, reviews: prev.reviews.filter(review => review._id !== reviewId) } : null);
        }
        catch (error) {
            console.error("🚨 Error deleting review:", error);
        }
    };
    if (loading)
        return _jsx("div", { children: "Loading mall details..." });
    if (!mall)
        return _jsx("div", { children: "Error: Mall details not found." });
    return (_jsx("div", { style: {
            padding: "20px",
            maxWidth: "100%",
            margin: "auto",
            marginTop: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "wrap"
        }, children: _jsxs("div", { style: {
                display: isMobile ? "flex" : "grid",
                flexDirection: isMobile ? "column" : undefined,
                gridTemplateColumns: isMobile ? undefined : "55% 45%",
                gap: isMobile ? "20px" : "40px"
            }, children: [_jsxs("div", { id: "mall-details", children: [_jsx("h1", { children: mall.name }), _jsxs("p", { children: [_jsx("b", { children: "Description:" }), " ", mall.description] }), _jsxs("p", { children: [_jsx("b", { children: "Address:" }), " ", mall.address] }), _jsx("h2", { children: "Photos" }), _jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }, children: [_jsx("button", { onClick: () => setPhotoIndex(prev => Math.max(prev - 2, 0)), disabled: photoIndex === 0, style: {
                                        cursor: photoIndex === 0 ? "not-allowed" : "pointer",
                                        opacity: photoIndex === 0 ? 0.5 : 1,
                                        fontSize: "12px",
                                        padding: "2px 4px",
                                        background: "none",
                                        border: "none",
                                        color: "#555",
                                    }, children: "\u25C0" }), _jsxs("div", { style: {
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)", // ✅ Ensure two images are side by side
                                        gap: "15px",
                                        width: isMobile ? "100%" : "750px",
                                        height: "250px",
                                        overflow: "hidden", // ✅ Prevent unexpected clipping
                                        alignItems: "center",
                                    }, children: [mall.photos.slice(photoIndex, photoIndex + 2).map((photo) => (_jsxs("div", { style: {
                                                position: "relative",
                                                width: "100%",
                                                height: "100%",
                                                display: "flex", // ✅ Make sure images & buttons align properly
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }, children: [_jsx("img", { src: `http://localhost:5000${photo.url}`, alt: "Mall", style: {
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: "8px",
                                                        objectFit: "cover",
                                                    } }), userRole === "admin" && (_jsx("button", { onClick: () => handleDeletePhoto(photo._id), style: {
                                                        position: "absolute",
                                                        top: "5px",
                                                        right: "5px",
                                                        background: "red",
                                                        color: "white",
                                                        fontSize: "14px",
                                                        fontWeight: "bold",
                                                        border: "none",
                                                        padding: "4px 6px",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        zIndex: "1000",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }, children: "\u274C" }))] }, photo._id))), mall.photos.length - photoIndex < 2 && (_jsx("div", { style: {
                                                width: "100%",
                                                height: "100%",
                                                visibility: "hidden",
                                            } }))] }), _jsx("button", { onClick: () => setPhotoIndex(prev => Math.min(prev + 2, mall.photos.length - 2)), disabled: photoIndex + 2 >= mall.photos.length, style: {
                                        cursor: photoIndex + 2 >= mall.photos.length ? "not-allowed" : "pointer",
                                        opacity: photoIndex + 2 >= mall.photos.length ? 0.5 : 1,
                                        fontSize: "12px",
                                        padding: "2px 4px",
                                        background: "none",
                                        border: "none",
                                        color: "#555",
                                    }, children: "\u25B6" })] }), _jsx("h4", { children: "Upload Image" }), userRole === "admin" && ( // ✅ Only show uploader if admin
                        _jsx(ImageUploader, { mallId: mall._id, userRole: userRole, onUploadSuccess: fetchMallDetails })), _jsx("h2", { children: "Stores" }), _jsx("ul", { children: mall.stores.map((store, index) => (_jsxs("li", { children: [_jsx("b", { children: store.name }), ": ", store.description] }, index))) })] }), _jsxs("div", { id: "reviews-section", style: { marginTop: isMobile ? "40px" : "180px" }, children: [_jsx("h2", { children: "Reviews" }), _jsx("button", { onClick: () => setShowReviewForm(true), style: { padding: "8px", marginBottom: "10px" }, children: "\u2795 Write a Review" }), showReviewForm && (_jsx(ReviewForm, { mallId: mall._id, onReviewAdded: fetchMallDetails, setShowReviewForm: setShowReviewForm })), _jsx("div", { style: { maxHeight: "400px", overflowY: "auto", padding: "10px", border: "1px solid #ddd" }, children: [...mall.reviews].reverse().map((review, index) => (_jsxs("div", { style: {
                                    position: "relative",
                                    borderBottom: "1px solid #ddd",
                                    padding: "10px",
                                    background: "#f9f9f9",
                                    borderRadius: "5px",
                                }, children: [_jsx("p", { children: _jsx("b", { children: review.username }) }), _jsxs("p", { children: [_jsx("b", { children: "Rating:" }), [...Array(review.rating)].map((_, i) => (_jsx("span", { style: { color: "#FFD700", fontSize: "20px" }, children: "\u2605" }, i)))] }), _jsx("p", { children: review.comment }), userRole === "admin" && (_jsx("button", { onClick: () => handleDeleteReview(review._id), style: {
                                            position: "absolute",
                                            top: "5px",
                                            right: "5px",
                                            background: "red",
                                            color: "white",
                                            border: "none",
                                            padding: "4px 6px",
                                            cursor: "pointer",
                                        }, children: "\u274C" }))] }, index))) })] })] }) }));
};
export default MallDetails;
