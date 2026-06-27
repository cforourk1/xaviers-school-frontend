import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/users";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const token = await login(formData.username, formData.password);
      if (!token) throw new Error("Invalid credentials");
      sessionStorage.setItem("token", token);
      navigate("/admin");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your username and password.");
    }
  }

  return (
    <div className="page">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}
      <p>
        Need an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register here
        </span>
      </p>
    </div>
  );
}
