import React from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          X‑Men Registry
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/">| Teams |</Link>
        <Link to="/mutants">| Mutants |</Link>

        {token ? (
          <>
            <Link to="/admin">Admin</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">| Login |</Link>
            <Link to="/register">| Register |</Link>
          </>
        )}
      </div>
    </nav>
  );
}
