import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import logo from "./images/logo.png";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("warden");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axios.post("${process.env.REACT_APP_API_URL}/api/signup", {
        email,
        first_name,
        last_name,
        password,
        role,
      });
      navigate("/");
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-banner">
            <img src={logo} alt="University of Winchester" className="login-logo" />
          </div>

          <form className="login-form" onSubmit={handleSignup}>
            <h1>Sign Up</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="styled-dropdown">
              <option value="warden">Fire Warden</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>

          <p>Already have an account? <a href="/">Login</a></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
