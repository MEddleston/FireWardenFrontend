import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import logo from "./images/logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/login`,
      { email, password }
    );
    localStorage.setItem("user", JSON.stringify(response.data));
    response.data.role === "admin" ? navigate("/admin") : navigate("/warden");
  } catch (error) {
    alert("Invalid credentials");
  }
};


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-banner">
            <img src={logo} alt="University of Winchester" className="login-logo" />
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <h1>Login</h1>
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
            <button type="submit">Login</button>
          </form>

          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
