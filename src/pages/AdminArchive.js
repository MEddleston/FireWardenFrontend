import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaUsers, FaHome, FaArchive, FaBars, FaTimes } from "react-icons/fa";
import logo from "./images/logo.png";
import "./styles.css";

function ArchivePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [archiveEntries, setArchiveEntries] = useState([]);
  const navigate = useNavigate();
  const site_location = useLocation();

  useEffect(() => {
    axios
      .get("${process.env.REACT_APP_API_URL}/api/fire-wardens-log")
      .then((res) => setArchiveEntries(res.data))
      .catch((err) => console.error("Error fetching archive entries:", err));
  }, []);

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
          <li
            onClick={() => navigate("/archive")}
            className={site_location.pathname === "/archive" ? "active" : ""}
          >
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
          <h1>Archive</h1>
        </div>

        {archiveEntries.length > 0 ? (
          <ul className="entries">
            {archiveEntries.map((entry) => (
              <li key={entry.id} className="entry admin-entry">
                <strong>{entry.first_name} {entry.last_name}</strong>&nbsp;&mdash;
                Location: {entry.location} &mdash;
                Logged: {new Date(entry.entry_time).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No archived entries found.</p>
        )}
      </div>
    </div>
  );
}

export default ArchivePage;
