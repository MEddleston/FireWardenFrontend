import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaList, FaCog, FaBars, FaTimes, FaTrash } from "react-icons/fa";
import logo from "./images/logo.png";
import "./styles.css";
import { getRecentWardenEntries, getWardenCountByLocation } from "../utils/mapUtils";

function WardenDashboard() {
  const [entries, setEntries] = useState([]);
  const [location, setLocation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allEntries, setAllEntries] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const navigate = useNavigate();
  const site_location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const imgRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const baseMapSize = { width: 3240, height: 2928 };

  const locationsOnMap = [
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
      setSelectedPin(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



useEffect(() => {
  if (!selectedPin || !popupRef.current || !imgRef.current) return;

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
}, [selectedPin, imageSize]);

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setImageSize({ width: imgRef.current.clientWidth, height: imgRef.current.clientHeight });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const scaleX = imageSize.width / baseMapSize.width;
  const scaleY = imageSize.height / baseMapSize.height;

  const fetchEntries = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/fire-wardens/${user.staff_number}`)
      .then((response) => setEntries(response.data))
      .catch((error) => console.error("Error fetching entries:", error));
  };

  const handleLogLocation = async (e, locOverride = null) => {
    e?.preventDefault();
    const locName = locOverride || location;
    if (!locName) return;
    await axios.post("${process.env.REACT_APP_API_URL}/api/fire-wardens", {
      staff_number: user.staff_number,
      first_name: user.first_name,
      last_name: user.last_name,
      location: locName,
    });
    setLocation("");
    setSelectedPin(null);
    fetchEntries();
    axios.get("${process.env.REACT_APP_API_URL}/api/fire-wardens").then((res) => setAllEntries(res.data));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteEntry = async (entry_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/fire-wardens/${entry_id}`);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry.");
    }
  };

  const recentEntries = getRecentWardenEntries(allEntries);

  const getColor = (count) => {
    if (count === 0) return "red";
    if (count >= 1) return "green";
    return "red";
  };

  const formatWardenCount = (count) => {
    return `${count} warden${count === 1 ? "" : "s"}`;
  };

  return (
    <div className="dashboard">
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="University Logo" className="logo" />
          <h2>Warden Panel</h2>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/warden")} className={site_location.pathname === "/warden" ? "active" : ""}>
            <FaList /> My Entries
          </li>
          <li onClick={() => navigate("/warden-settings")}><FaCog /> Settings</li>
          <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
        </ul>
      </div>

      <div className="main">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1>Log Your Location</h1>
        </div>

        <div className="log-form">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">-- Select a location --</option>
            {locationsOnMap.map((loc) => (
              <option key={loc.id} value={loc.title}>
                {loc.title}
              </option>
            ))}
          </select>

          <button onClick={handleLogLocation}>Log Location</button>
        </div>

        <div className="map-wrapper">
          <div className="map-pdf-container">
          <img
  ref={imgRef}
  src="/Campus_Map.png"
  alt="Campus Map"
  className="map-image"
  onLoad={() => {
    if (imgRef.current) {
      setImageSize({
        width: imgRef.current.clientWidth,
        height: imgRef.current.clientHeight
      });
    }
  }}
/>

            <div className="pin-overlay">
              {locationsOnMap.map((loc) => {
                const people = getWardenCountByLocation(recentEntries, loc.title);
                const count = people.length;
                return (
                  <div
                    key={loc.id}
                    className="map-pin"
                    onClick={() =>
                      setSelectedPin(
                        selectedPin && selectedPin.id === loc.id ? null : { ...loc, count, people }
                      )
                    }
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
                      cursor: "pointer"
                    }}
                    title={`${loc.title} — ${formatWardenCount(count)}`}
                  />
                );
              })}
              {selectedPin && (
                <div
  ref={popupRef}
  className="pin-popup"
  style={{
    position: "absolute",
    left: `${selectedPin.x * scaleX}px`,
    top: `${selectedPin.y * scaleY - 20}px`,
    background: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    transform: popupTransform,
    zIndex: 999,
    maxWidth: "250px"
  }}
>


                  <strong>{selectedPin.title}</strong>
                  <p>{formatWardenCount(selectedPin.count)}:</p>
                  <ul>
                    {selectedPin.people.map((p, index) => (
                      <li key={index}>{p.first_name} {p.last_name}</li>
                    ))}
                  </ul>
                  <button className="map-log-button" onClick={(e) => handleLogLocation(e, selectedPin.title)}>
  Log here
</button>

                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="entries-heading">My Logged Locations</h2>
        {entries.length > 0 ? (
          <ul className="entries">
            {entries.map((entry) => (
              <li key={entry.id} className="entry warden-entry">
                <span role="img" aria-label="location">📍</span> {entry.location} - {new Date(entry.entry_time).toLocaleString()}
                <FaTrash className="delete-icon" onClick={() => handleDeleteEntry(entry.id)} title="Delete entry" />
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent entries found.</p>
        )}
      </div>
    </div>
  );
}

export default WardenDashboard;