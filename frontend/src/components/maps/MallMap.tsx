import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import L from 'leaflet';
import "leaflet.markercluster"; // Import clustering library
import "leaflet.markercluster/dist/MarkerCluster.Default.css"; // Import clustering styles
import 'leaflet/dist/leaflet.css'; // Import Leaflet styles

const fadeInAnimation = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;

// ✅ Inject the animation styles into the document
const styleSheet = document.createElement("style");
styleSheet.innerText = fadeInAnimation;
document.head.appendChild(styleSheet);

interface Mall {
  _id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  reviews: {
    username: string;
    rating: number;
    comment: string;
  }[];
}

const MallMap: React.FC = () => {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [filter, setFilter] = useState<string>("all"); // State for filtering
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null); // Manage clusters dynamically
  const mallListContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); // Initialize navigation



  // Fetch ALL malls from backend
  useEffect(() => {
    const fetchAllMalls = async () => {
      try {
        const allMalls: Mall[] = [];
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const response = await fetch(`/api/malls?page=${page}&limit=10`);
          const data = await response.json();

          if (data && Array.isArray(data.malls)) {
            allMalls.push(...data.malls);
            totalPages = data.totalPages;
          }

          page++;
        }

        setMalls(allMalls); // Store all malls in state
      } catch (error) {
        console.error("Error fetching all malls:", error);
      }
    };

    fetchAllMalls();
  }, []);

  // Filtered malls based on user selection
  const filteredMalls = malls.filter((mall) => {
    if (filter === "all") return true;
    if (filter === "Metro Manila") return mall.address.includes("Metro Manila");
    if (filter === "Cebu") return mall.address.includes("Cebu");
    if (filter === "Davao") return mall.address.includes("Davao");
    if (filter === "Pampanga") return mall.address.includes("Pampanga");
    if (filter === "rating:5") return mall.reviews[0]?.rating === 5;
    if (filter === "rating:4+") return mall.reviews[0]?.rating >= 4;
    if (filter === "rating:3+") return mall.reviews[0]?.rating >= 3;
    return false;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const mallsPerPage = 8;
  const totalPages = Math.ceil(filteredMalls.length / mallsPerPage);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      mallListContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const paginatedMalls = filteredMalls.slice(
    (currentPage - 1) * mallsPerPage,
    currentPage * mallsPerPage
  );

  useEffect(() => {
    // Initialize map only once
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current!).setView([14.5995, 120.9842], 8); // Adjusted zoom level

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(leafletMapRef.current);
    }

    // Initialize marker cluster group
    if (!markersRef.current) {
      markersRef.current = L.markerClusterGroup();
    }

    // Clear existing markers before adding new ones
    markersRef.current.clearLayers();

    // Add markers for filtered malls
    filteredMalls.forEach((mall) => {
      if (mall.location.lat && mall.location.lng) {
        const marker = L.marker([mall.location.lat, mall.location.lng])
          .bindPopup(`
              <b>${mall.name}</b><br>
              ${mall.description}<br>
              <i>${mall.address}</i>
            `);

        // Redirect to Mall Details page on double-click
        marker.on('dblclick', () => {
          console.log(`Navigating to /mall/${mall._id}`);
          navigate(`/mall/${mall._id}`);
        });

        markersRef.current!.addLayer(marker);
      } else {
        console.warn("Invalid location for mall:", mall.name);
      }
    });

    // Add cluster group to the map
    leafletMapRef.current!.addLayer(markersRef.current);

    // Fit map bounds to marker locations
    if (markersRef.current!.getLayers().length > 0) {
      const bounds = markersRef.current!.getBounds();
      leafletMapRef.current!.fitBounds(bounds, { padding: [50, 50] });
    } else {
      console.warn("No markers to fit bounds for.");
    }

    // Cleanup on unmount or when malls change
    return () => {
      markersRef.current?.clearLayers();
    };
  }, [filteredMalls]);

  return (
    <>
      {/* Dropdown for filter selection */}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filter"
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          <option value="all">All Locations</option>
          <option value="Metro Manila">Metro Manila</option>
          <option value="Cebu">Cebu</option>
          <option value="Davao">Davao</option>
          <option value="Pampanga">Pampanga</option>
          <option value="rating:5">Rating: 5 only</option>
          <option value="rating:4+">Rating: 4+</option>
          <option value="rating:3+">Rating: 3+</option>
        </select>
      </div>

      {/* Responsive Wrapper */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        gap: "20px",
        marginTop: "60px",
        width: "100vw",               // ✅ Full viewport width
        boxSizing: "border-box",
        overflowX: "hidden",          // ✅ Prevent horizontal scroll
      }}>

        {/* Map container */}
        <div id="map" ref={mapRef} style={{
          height: window.innerWidth < 768 ? "300px" : "400px",
          width: "90vw",               // ✅ Responsive width
          maxWidth: "700px",           // ✅ Cap on large screens
          boxSizing: "border-box",
          margin: "0 auto",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          position: "relative",
          perspective: "1000px",
        }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateZ(10px)";
            e.currentTarget.style.zIndex = "2";
            e.currentTarget.style.boxShadow = "0px 6px 16px rgba(0,0,0,0.2)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateZ(0px)";
            e.currentTarget.style.zIndex = "1";
            e.currentTarget.style.boxShadow = "none";
          }}
        ></div>

        {/* Mall List */}
        <div ref={mallListContainerRef} style={{
          marginTop: "10px",
          marginBottom: "60px",
          padding: "10px",
          width: "90vw",
          maxWidth: "700px",
          boxSizing: "border-box",
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h2 style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            padding: "10px 0",
            zIndex: 3,
            borderBottom: "1px solid #ddd"
          }}>
            List of Malls
          </h2>
          <ul style={{ listStyle: "none", padding: "0" }}>
            {paginatedMalls.map((mall) => (
              <li
                key={mall._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  background: "#f9f9f9",
                  borderRadius: "5px",
                  marginBottom: "6px",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                  position: "relative", // ✅ Ensures movement effect works properly
                  perspective: "1000px", // ✅ Enables 3D depth effect
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateZ(10px)"; // ✅ Moves item forward
                  e.currentTarget.style.zIndex = "2"; // ✅ Keeps it above other items
                  e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.2)"; // ✅ Adds subtle shadow effect
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateZ(0px)"; // ✅ Resets position
                  e.currentTarget.style.zIndex = "1";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => {
                  if (leafletMapRef.current) {
                    leafletMapRef.current.setView([mall.location.lat, mall.location.lng], 15);

                    // ✅ Locate marker and open its popup
                    const marker = markersRef.current?.getLayers().find((m) => {
                      const latlng = (m as L.Marker).getLatLng();
                      return latlng.lat === mall.location.lat && latlng.lng === mall.location.lng;
                    });

                    if (marker) {
                      (marker as L.Marker).openPopup();
                    }
                  }
                }}
                onDoubleClick={() => navigate(`/mall/${mall._id}`)} // ✅ Sends user to Mall Detail page on double-click
              >
                {/* Mall Name - Aligned Left */}
                <span>{mall.name}</span>

                {/* Go to Details Icon - Aligned Right */}
                <span
                  style={{ cursor: "pointer", fontSize: "18px", color: "#007BFF" }}
                  onClick={() => navigate(`/mall/${mall._id}`)}
                >
                  ➜
                </span>
              </li>
            ))}
          </ul>
          <div style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "10px"
          }}>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{ padding: "6px 12px", cursor: "pointer" }}
            >
              ◀ Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{ padding: "6px 12px", cursor: "pointer" }}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>



      {/* Mall details container (removed since details are shown on a separate page) */}
    </>
  );
};

export default MallMap;