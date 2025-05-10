import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import logo from "./images/logo.png";
import {
  FaSignOutAlt,
  FaList,
  FaCog,
  FaBars,
  FaTimes,
  FaPencilAlt,
  FaSave,
  FaTimesCircle
} from "react-icons/fa";

function WardenSettings() {
  const navigate = useNavigate();
  const site_location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    password: "********",
    new_password: "",
    confirm_password: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      password: "********",
      new_password: "",
      confirm_password: ""
    });
    setEditingField(null);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (editingField === "password") {
        const newPass = formData.new_password.trim();
        const confirmPass = formData.confirm_password.trim();

        if (!newPass || !confirmPass) {
          alert("Please fill in both password fields.");
          setIsSaving(false);
          return;
        }

        if (newPass !== confirmPass) {
          alert("Passwords do not match.");
          setIsSaving(false);
          return;
        }

        await axios.put("${process.env.REACT_APP_API_URL}/api/update-password", {
          staff_number: user.staff_number,
          new_password: newPass
        });

      } else if (editingField === "first_name") {
        if (!formData[editingField].trim()) {
          alert("This field cannot be empty.");
          setIsSaving(false);
          return;
        }

        const updatedValue = formData[editingField].trim();
        await axios.put("${process.env.REACT_APP_API_URL}/api/update-user", {
          staff_number: user.staff_number,
          last_name: user.last_name,
          [editingField]: updatedValue
        });

        const updatedUser = { ...user, [editingField]: updatedValue };
        localStorage.setItem("user", JSON.stringify(updatedUser));

      } else if (editingField === "last_name") {
        if (!formData[editingField].trim()) {
          alert("This field cannot be empty.");
          setIsSaving(false);
          return;
        }

        const updatedValue = formData[editingField].trim();
        await axios.put("${process.env.REACT_APP_API_URL}/api/update-user", {
          staff_number: user.staff_number,
          first_name: user.first_name,
          [editingField]: updatedValue
        });

        const updatedUser = { ...user, [editingField]: updatedValue };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setSuccessMessage("Changes saved successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditingField(null);
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="University Logo" className="logo" />
          <h2>Warden Panel</h2>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/warden")} className={site_location.pathname === "/warden" ? "active" : ""}>
            <FaList /> My Entries
          </li>
          <li className="active">
            <FaCog /> Settings
          </li>
          <li onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <div className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1>Settings</h1>
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="settings-section styled-settings">
          {[{ key: "first_name", label: "First Name:" }, { key: "last_name", label: "Last Name:" }, { key: "password", label: "Password:" }].map(({ key, label }) => (
            <div key={key} className={`settings-item bordered ${editingField === key ? "editing" : ""}`}>
              <label>{label}</label>
              {editingField === key ? (
                key === "password" ? (
                  <div className="password-edit-fields expanded">
                    <input
                      name="new_password"
                      type="password"
                      placeholder="New Password"
                      value={formData.new_password}
                      onChange={handleChange}
                      className="settings-input"
                    />
                    <input
                      name="confirm_password"
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="settings-input"
                    />
                    <div className="button-group">
                      <FaSave className={`edit-icon clickable bordered-button ${isSaving ? "disabled" : ""}`} onClick={handleSave} />
                      <FaTimesCircle className="edit-icon clickable bordered-button" onClick={handleCancel} />
                    </div>
                  </div>
                ) : (
                  <div className="field-edit expanded">
                    <input
                      name={key}
                      type="text"
                      value={formData[key]}
                      onChange={handleChange}
                      className="settings-input"
                    />
                    <div className="button-group">
                      <FaSave className={`edit-icon clickable bordered-button ${isSaving ? "disabled" : ""}`} onClick={handleSave} />
                      <FaTimesCircle className="edit-icon clickable bordered-button" onClick={handleCancel} />
                    </div>
                  </div>
                )
              ) : (
                <>
                  <span className="settings-value">{key === "password" ? "********" : formData[key]}</span>
                  <FaPencilAlt className="edit-icon clickable bordered-button" onClick={() => handleEdit(key)} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WardenSettings;
