import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaUsers, FaHome, FaArchive, FaBars, FaTimes } from "react-icons/fa";
import logo from "./images/logo.png";
import "./styles.css";

function AllWardenEntries() {
  const [wardens, setWardens] = useState([]);
  const [selectedWarden, setSelectedWarden] = useState("");
  const [entries, setEntries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const site_location = useLocation();
  

  useEffect(() => {
    axios
      .get(`https://${process.env.REACT_APP_API_URL}/api/wardens/warden`)
      .then((response) => {
        const uniqueWardens = [...new Map(response.data.map(entry => [entry.staff_number, entry])).values()];
        setWardens(uniqueWardens);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleWardenChange = (e) => {
    const staffNumber = e.target.value;
    setSelectedWarden(staffNumber);
    if (staffNumber) {
      axios
        .get(`https://${process.env.REACT_APP_API_URL}/api/fire-wardens/${staffNumber}`)
        .then((response) => setEntries(response.data))
        .catch((error) => console.error(error));
    } else {
      setEntries([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="University Logo" className="logo" />
          <h2>Admin Panel</h2>
        </div>
        <ul className="sidebar-menu">
            <li
                onClick={() => navigate("/admin")}
                className={site_location.pathname === "/admin" ? "active" : ""}
            >
                <FaHome /> Home
            </li>
            <li
                onClick={() => navigate("/all-warden-entries")}
                className={site_location.pathname === "/all-warden-entries" ? "active" : ""}
            >
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
          <h1>All Warden Entries</h1>
        </div>

        <div className="log-form">
          <label htmlFor="warden-select">Select a Warden</label>
          <select id="warden-select" value={selectedWarden} onChange={handleWardenChange} className="styled-dropdown">
            <option value="">Select Warden</option>
            {wardens.map((warden) => (
              <option key={warden.staff_number} value={warden.staff_number}>
                {warden.first_name} {warden.last_name}
              </option>
            ))}
          </select>
          
        
        </div>

        {entries.length > 0 ? (
          <ul className="entries">
            {entries.map((entry) => (
              <li key={entry.id} className="entry">
                <strong>{entry.location}</strong> — {new Date(entry.entry_time).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No entries available.</p>
        )}
      </div>
    </div>
  );
}

export default AllWardenEntries;