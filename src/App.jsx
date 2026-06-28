import React from "react";
import { Routes, Route } from "react-router";
import Layout from "./pages/Layout.jsx";
import "./css/App.css";
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


/*
App defines all routes for the site.
Layout wraps every page with shared UI (like Navbar).
TeamsList is the default landing page.
*/

export default function App() {
  return (
    <Routes>
      {/* Parent route - Layout wraps all pages with the Navbar */}
      <Route path="/" element={<Layout />}>
        {/* Default landing page */}
        <Route index element={<TeamsList />} />

        {/* Public routes */}
        <Route path="teams/:id" element={<TeamDetail />} />
        <Route path="mutants" element={<MutantsList />} />
        <Route path="mutants/:id" element={<MutantDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Admin routes */}
        <Route path="admin" element={<Admin />} />
        <Route path="admin/teams" element={<AdminTeams />} />
        <Route path="admin/mutants" element={<AdminMutants />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
