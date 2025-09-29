import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "../components/malls/ReviewForm";
import ImageUploader from "../components/malls/ImageUploader";

interface Mall {
  _id: string;
  name: string;
  description: string;
  address: string;
  location: { lat: number; lng: number };
  photos: { _id: string; url: string }[]; // ✅ Fix: Ensure images are objects
  stores: { name: string; description: string }[];
  reviews: { _id: string; username: string; rating: number; comment: string }[];
}

const MallDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mall, setMall] = useState<Mall | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const [photoIndex, setPhotoIndex] = useState(0);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

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
      if (!response.ok) throw new Error("Failed to fetch mall details.");
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
        photos: data.images?.map((img: { _id: string; url: string }) => ({
          _id: img._id ?? `missing-${Math.random()}`,
          url: img.url,
        })) ?? [],
      });

    } catch (error) {
      console.error("🚨 Error fetching mall details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Mall ID from URL Params:", id);
    fetchMallDetails();
  }, [id]);

  const handleDeletePhoto = async (imageId: string | undefined) => {
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

      if (!response.ok) throw new Error(`❌ Failed to delete image: ${response.statusText}`);

      console.log("✅ Image deleted successfully!");

      setMall((prev) =>
        prev ? { ...prev, photos: prev.photos.filter((photo) => photo._id !== imageId) } : null
      );
    } catch (error) {
      console.error("🚨 Error deleting image:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/malls/${id}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      if (!response.ok) throw new Error("❌ Failed to delete review.");

      setMall((prev) => prev ? { ...prev, reviews: prev.reviews.filter(review => review._id !== reviewId) } : null);
    } catch (error) {
      console.error("🚨 Error deleting review:", error);
    }
  };

  if (loading) return <div>Loading mall details...</div>;
  if (!mall) return <div>Error: Mall details not found.</div>;

  return (
    <div style={{
  padding: "20px",
  maxWidth: "100%",
  margin: "auto",
  marginTop: "80px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  flexWrap: "wrap"
}}>
      <div style={{
  display: isMobile ? "flex" : "grid",
  flexDirection: isMobile ? "column" : undefined,
  gridTemplateColumns: isMobile ? undefined : "55% 45%",
  gap: isMobile ? "20px" : "40px"
}}>
        {/* 📸 Mall Details Section */}
        <div id="mall-details">
          <h1>{mall.name}</h1>
          <p><b>Description:</b> {mall.description}</p>
          <p><b>Address:</b> {mall.address}</p>

          <h2>Photos</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            {/* ⬅ Previous Button */}
            <button
              onClick={() => setPhotoIndex(prev => Math.max(prev - 2, 0))} // ✅ Prevents going below 0
              disabled={photoIndex === 0}
              style={{
                cursor: photoIndex === 0 ? "not-allowed" : "pointer",
                opacity: photoIndex === 0 ? 0.5 : 1,
                fontSize: "12px",
                padding: "2px 4px",
                background: "none",
                border: "none",
                color: "#555",
              }}
            >
              ◀
            </button>

            {/* ✅ Maintain fixed space even if only one image exists */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)", // ✅ Ensure two images are side by side
              gap: "15px",
              width: isMobile ? "100%" : "750px",
              height: "250px",
              overflow: "hidden", // ✅ Prevent unexpected clipping
              alignItems: "center",
            }}>
              {mall.photos.slice(photoIndex, photoIndex + 2).map((photo) => (
                <div key={photo._id} style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  display: "flex", // ✅ Make sure images & buttons align properly
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <img src={`http://localhost:5000${photo.url}`} alt="Mall"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }} />

                  {/* ✅ Delete button, ensuring visibility */}
                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDeletePhoto(photo._id)}
                      style={{
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
                      }}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}

              {/* ✅ Placeholder to prevent layout shift when only one image remains */}
              {mall.photos.length - photoIndex < 2 && (
                <div style={{
                  width: "100%",
                  height: "100%",
                  visibility: "hidden",
                }}></div>
              )}
            </div>

            {/* ➡ Next Button */}
            <button
              onClick={() => setPhotoIndex(prev => Math.min(prev + 2, mall.photos.length - 2))} // ✅ Prevents exceeding available images
              disabled={photoIndex + 2 >= mall.photos.length}
              style={{
                cursor: photoIndex + 2 >= mall.photos.length ? "not-allowed" : "pointer",
                opacity: photoIndex + 2 >= mall.photos.length ? 0.5 : 1,
                fontSize: "12px",
                padding: "2px 4px",
                background: "none",
                border: "none",
                color: "#555",
              }}
            >
              ▶
            </button>
          </div>

          <h4>Upload Image</h4>
          {userRole === "admin" && ( // ✅ Only show uploader if admin
            <ImageUploader mallId={mall._id} userRole={userRole} onUploadSuccess={fetchMallDetails} />
          )}

          <h2>Stores</h2>
          <ul>
            {mall.stores.map((store, index) => (
              <li key={index}><b>{store.name}</b>: {store.description}</li>
            ))}
          </ul>
        </div>

        {/* 📝 Reviews Section */}
        <div id="reviews-section" style={{ marginTop: isMobile ? "40px" : "180px" }}>
          <h2>Reviews</h2>
          <button onClick={() => setShowReviewForm(true)} style={{ padding: "8px", marginBottom: "10px" }}>
            ➕ Write a Review
          </button>

          {showReviewForm && (
            <ReviewForm
              mallId={mall._id}
              onReviewAdded={fetchMallDetails}
              setShowReviewForm={setShowReviewForm}
            />
          )}

          {/* ✅ Reviews in Scrollable Section */}
          <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px", border: "1px solid #ddd" }}>
            {[...mall.reviews].reverse().map((review, index) => (
              <div key={index} style={{
                position: "relative",
                borderBottom: "1px solid #ddd",
                padding: "10px",
                background: "#f9f9f9",
                borderRadius: "5px",
              }}>
                <p><b>{review.username}</b></p>

                {/* ✅ Updated Rating: Dynamic Star Display */}
                <p><b>Rating:</b>
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} style={{ color: "#FFD700", fontSize: "20px" }}>★</span>
                  ))}
                </p>

                <p>{review.comment}</p>

                {/* ✅ Delete Button for Admins */}
                {userRole === "admin" && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "4px 6px",
                      cursor: "pointer",
                    }}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MallDetails;