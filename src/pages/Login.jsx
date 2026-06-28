import React, { useState } from "react";
import { useNavigate } from "react-router";
import { login, getMe } from "../api/users";
import "../css/Login.css";

export default function Login({ setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  // submits login credentials to the backend
  // on success stores token, fetches user object, redirects to admin
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const token = await login(formData.username, formData.password);
      if (!token) throw new Error("Invalid credentials");
      sessionStorage.setItem("token", token);
      // fetch the full user object including role and store in app state
      const user = await getMe(token);
      setCurrentUser(user);
      navigate("/admin");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Check your username and password.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>User Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Username
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
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
              placeholder="Enter password"
              required
              aria-label="Password"
            />
          </label>
          <button className="auth-submit" type="submit">Login</button>
        </form>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <p className="auth-switch">
          Need an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
}