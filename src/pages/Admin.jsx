import React from "react";
import { useNavigate, Link } from "react-router";
import "../css/Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  // get the token from sessionStorage - if null, user is not logged in
  const token = sessionStorage.getItem("token");

  // if no token redirect to login
  React.useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* navigation cards to the two admin sections */}
      <div className="admin-nav-grid">
        <Link to="/admin/teams" className="admin-nav-card">
          <h2>Manage Teams</h2>
          <p>Add, edit, or remove teams from the registry</p>
        </Link>
        <Link to="/admin/mutants" className="admin-nav-card">
          <h2>Manage Mutants</h2>
          <p>Add, edit, or remove mutants from the registry</p>
        </Link>
      </div>
    </div>
  );
}
