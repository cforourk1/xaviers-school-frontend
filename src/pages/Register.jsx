import React, { useState } from "react";
import { useNavigate } from "react-router";
import { register, getMe } from "../api/users";
import "../css/Login.css";

export default function Register({ setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  // submits registration to the backend
  // on success stores token, fetches user object, redirects to admin
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const token = await register(formData.username, formData.password);
      if (!token) throw new Error("Registration failed");
      sessionStorage.setItem("token", token);
      // fetch the full user object including role and store in app state
      const user = await getMe(token);
      setCurrentUser(user);
      navigate("/admin");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create User Account</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Username
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Choose a username"
              required
              aria-label="Username"
            />
          </label>
          <label className="auth-label">
            Password
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Choose a password"
              required
              aria-label="Password"
            />
          </label>
          <button className="auth-submit" type="submit">Register</button>
        </form>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Log in here</span>
        </p>
      </div>
    </div>
  );
}