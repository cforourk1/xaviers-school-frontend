import React from "react";
import { Link, useNavigate } from "react-router";
import "../css/Navbar.css";

export default function Navbar({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  // check if user is logged in by looking for token in sessionStorage
  const token = sessionStorage.getItem("token");

  function handleLogout() {
    sessionStorage.removeItem("token");
    // clear the current user from app state on logout
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">
          X-Men<br />Registry
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Teams</Link>
        <Link to="/mutants">Mutants</Link>

        {token ? (
          <>
            {/* only show Admin link if user has admin role */}
            {currentUser?.role === 'admin' && (
              <Link to="/admin">Admin</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}