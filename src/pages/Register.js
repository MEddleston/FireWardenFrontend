import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/external_styles.css";


const Register = () => {
    const [formData, setFormData] = useState({
        staffNumber: "",
        firstName: "",
        lastName: "",
        location: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`https://${process.env.REACT_APP_API_URL}/api/fire-wardens`, formData);
        alert("Fire Warden Registered!");
    };

    return (
        <body>
        <div>
            <h1>Register Fire Warden</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="staffNumber" placeholder="Staff Number" onChange={handleChange} required />
                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
           
        </div>
        <div>
        <Link to="/">
            <button>Back to Dashboard</button>
        </Link>
        </div>
        </body>
    );
};

export default Register;
