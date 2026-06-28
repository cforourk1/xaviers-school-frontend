import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import Layout from "./pages/Layout.jsx";
import TeamsList from "./pages/TeamsList.jsx";
import TeamDetail from "./pages/TeamDetail.jsx";
import MutantsList from "./pages/MutantsList.jsx";
import MutantDetail from "./pages/MutantDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";
import AdminTeams from "./pages/AdminTeams.jsx";
import AdminMutants from "./pages/AdminMutants.jsx";
import Error404 from "./pages/Error404.jsx";
import { getMe } from "./api/users";
import "./css/App.css";

/*
App defines all routes for the site.
Layout wraps every page with shared UI (like Navbar).
TeamsList is the default landing page.
currentUser holds the logged in user object including their role.
*/

export default function App() {
  // holds the currently logged in user — null if not logged in
  const [currentUser, setCurrentUser] = useState(null);

  // on load check if a token exists and fetch the current user
  // this keeps the user logged in across page refreshes
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      getMe(token).then(setCurrentUser).catch(() => {
        // if token is invalid clear it
        sessionStorage.removeItem("token");
      });
    }
  }, []);

  return (
    <Routes>
      {/* Parent route - Layout wraps all pages with the Navbar */}
      <Route path="/" element={<Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />}>
        {/* Default landing page */}
        <Route index element={<TeamsList />} />

        {/* Public routes */}
        <Route path="teams/:id" element={<TeamDetail />} />
        <Route path="mutants" element={<MutantsList />} />
        <Route path="mutants/:id" element={<MutantDetail currentUser={currentUser} />} />
        <Route path="login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="register" element={<Register setCurrentUser={setCurrentUser} />} />

        {/* Admin routes */}
        <Route path="admin" element={<Admin currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        <Route path="admin/teams" element={<AdminTeams currentUser={currentUser} />} />
        <Route path="admin/mutants" element={<AdminMutants currentUser={currentUser} />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}