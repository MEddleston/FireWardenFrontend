import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css";
import logo from "./images/logo.png";
import { FaSignOutAlt, FaUsers, FaHome, FaArchive, FaBars, FaTimes } from "react-icons/fa";
import { getRecentWardenEntries, getWardenCountByLocation } from "../utils/mapUtils";

function AdminDashboard() {
  const [wardens, setWardens] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [activePin, setActivePin] = useState(null);
  const imgRef = useRef(null);

  const navigate = useNavigate();
  const site_location = useLocation();

  const baseMapSize = { width: 3240, height: 2928 };

  const locations = [
    { id: 1, x: 1360, y: 2135, title: "Alwyn Hall" },
    { id: 2, x: 2670, y: 2650, title: "Beech Glade" },
    { id: 3, x: 1650, y: 2188, title: "Bowers Building" },
    { id: 4, x: 1650, y: 1685, title: "Burma Road Student Village" },
    { id: 5, x: 1754, y: 2340, title: "Center For Sport" },
    { id: 6, x: 2071, y: 1925, title: "Chapel" },
    { id: 7, x: 1736, y: 1793, title: "Cottage" },
    { id: 8, x: 1828, y: 2132, title: "Fred Wheeler Building" },
    { id: 9, x: 1899, y: 1851, title: "Herbert Jarman Builing" },
    { id: 10, x: 2386, y: 999, title: "Holm Lodge" },
    { id: 11, x: 1834, y: 1958, title: "Kenneth Kettle Building" },
    { id: 12, x: 2575, y: 1957, title: "King Alfred Centre" },
    { id: 13, x: 2065, y: 2082, title: "Martial Rose Library" },
    { id: 14, x: 164, y: 1104, title: "Masters Lodge" },
    { id: 15, x: 2882, y: 2749, title: "Medecroft" },
    { id: 16, x: 3118, y: 2702, title: "Medcroft Annexe" },
    { id: 17, x: 1591, y: 2339, title: "Paul Chamberlain Building" },
    { id: 18, x: 1056, y: 2022, title: "Queen's Road Student Village" },
    { id: 19, x: 2293, y: 2135, title: "St Alphage" },
    { id: 20, x: 2260, y: 2044, title: "St Edburga" },
    { id: 21, x: 2608, y: 1489, title: "St Elizabeth's Hall" },
    { id: 22, x: 2605, y: 1649, title: "St Grimbald's Court" },
    { id: 23, x: 2522, y: 1247, title: "St James' Hall" },
    { id: 24, x: 1589, y: 1826, title: "St Swithun's Lodge" },
    { id: 25, x: 2480, y: 2209, title: "The Stripe" },
    { id: 26, x: 384, y: 926, title: "Business School" },
    { id: 27, x: 1923, y: 2117, title: "Tom Atkinson Building" },
    { id: 28, x: 825, y: 780, title: "West Downs Centre" },
    { id: 29, x: 521, y: 373, title: "West Downs Student Village" },
    { id: 30, x: 2260, y: 1893, title: "Winton Building" },
    { id: 31, x: 2563, y: 2080, title: "Students' Union" },
  ];

  const popupRef = useRef();
  const [popupTransform, setPopupTransform] = useState("translate(-50%, -100%)");
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !e.target.classList.contains("map-pin")
      ) {
        setActivePin(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  
  
  useEffect(() => {
    if (!activePin || !popupRef.current || !imgRef.current) return;
  
    const popup = popupRef.current.getBoundingClientRect();
    const map = imgRef.current.getBoundingClientRect();
  
    let xTransform = "-50%";
    let yTransform = "-100%";
  
    // Check horizontal overflow
    if (popup.left < map.left) {
      xTransform = "0%";
    } else if (popup.right > map.right) {
      xTransform = "-100%";
    }
  
    // Check vertical overflow
    if (popup.top < map.top) {
      yTransform = "0%";
    }
  
    setPopupTransform(`translate(${xTransform}, ${yTransform})`);
  }, [activePin, imageSize]);

  useEffect(() => {
    axios
      .get(`https://${process.env.REACT_APP_API_URL}/api/fire-wardens`)
      .then((response) => {
        const data = response.data;
        setWardens(data);
      })
      .catch((error) => console.error("Error fetching wardens:", error));
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setImageSize({
          width: imgRef.current.clientWidth,
          height: imgRef.current.clientHeight,
        });
      }
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleImageLoad = () => {
    if (imgRef.current) {
      setImageSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight,
      });
    }
  };

  const scaleX = imageSize.width / baseMapSize.width;
  const scaleY = imageSize.height / baseMapSize.height;

  const getColor = (count) => {
    if (count === 0) return "red";
    if (count >= 1) return "green";
    return "red";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const recentEntries = getRecentWardenEntries(wardens);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="University Logo" className="logo" />
          <h2>Admin Panel</h2>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/admin")} className={site_location.pathname === "/admin" ? "active" : ""}>
            <FaHome /> Home
          </li>
          <li onClick={() => navigate("/all-warden-entries")} className={site_location.pathname === "/all-warden-entries" ? "active" : ""}>
            <FaUsers /> Warden Entries
          </li>
          <li onClick={() => navigate("/archive")} className={site_location.pathname === "/archive" ? "active" : ""}>
            <FaArchive /> Archive
          </li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1>Admin Dashboard</h1>
        </div>

        <p>Manage fire wardens efficiently.</p>

        {/* Map Section */}
        <section>
          <h2>Live Warden Locations</h2>
          <div className="map-wrapper">
            <div className="map-pdf-container">
              <img
                ref={imgRef}
                onLoad={handleImageLoad}
                src="/Campus_Map.png"
                alt="Campus Map"
                className="map-image"
              />
              <div className="pin-overlay">
                {locations.map((loc) => {
                  const people = getWardenCountByLocation(recentEntries, loc.title);
                  const count = people.length;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => setActivePin(activePin?.id === loc.id ? null : { ...loc, count, people })}
                      style={{
                        position: "absolute",
                        left: `${loc.x * scaleX}px`,
                        top: `${loc.y * scaleY}px`,
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: getColor(count),
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                        border: "2px solid white",
                        cursor: "pointer",
                      }}
                      title={loc.title}
                    />
                  );
                })}

                {activePin && (
                  <div
  ref={popupRef}
  className="pin-popup"
  style={{
    position: "absolute",
    left: `${activePin.x * scaleX}px`,
    top: `${activePin.y * scaleY - 20}px`,
    background: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transform: popupTransform,
    zIndex: 999,
    maxWidth: "250px"
  }}
>
                    <strong>{activePin.title}</strong>
                    <br />
                    {activePin.count} warden{activePin.count !== 1 ? "s" : ""}
                    <ul style={{ paddingLeft: 0, listStyle: "none", marginTop: 5 }}>
                      {activePin.people.map((p, i) => (
                        <li key={i}>{p.first_name} {p.last_name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Entries Section */}
        <h2 className="entries-heading">Recent Fire Warden Entries</h2>
        <ul className="entries">
          {[...wardens]
            .sort((a, b) => new Date(b.entry_time) - new Date(a.entry_time))
            .map((warden) => (
              <li key={warden.id} className="entry admin-entry">
                <strong>{warden.first_name} {warden.last_name}</strong>&nbsp;&mdash;
                Location: {warden.location} &mdash;
                Logged: {new Date(warden.entry_time).toLocaleString()}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;