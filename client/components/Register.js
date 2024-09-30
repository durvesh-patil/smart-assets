// components/Register.js
import React, { useState } from 'react';
import './Register.css'; // Adjust if the path is different

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for error messages
    const [success, setSuccess] = useState(null); // State for success messages

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if email and password are provided
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        fetch("http://localhost:5000/api/v1/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { 
                    throw new Error(text); // Log the response body
                });
            }
            return response.json();
        })
        .then(data => {
            setSuccess("Registration successful!"); // Set success message
            console.log("Registration successful:", data);
        })
        .catch(error => {
            setError("Error during registration: " + error.message); // Set error message
            console.error("Error during registration:", error);
        });
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    autoComplete="current-password"
                />
                <button type="submit" className="register-button">Register</button>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </form>
        </div>
    );
};

export default Register;
