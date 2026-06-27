import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import TeamsList from "./pages/TeamsList.jsx";
import TeamDetail from "./pages/TeamDetail.jsx";
import MutantsList from "./pages/MutantsList.jsx";
import MutantDetail from "./pages/MutantDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";
import Error404 from "./pages/Error404.jsx";
import "./App.css";

/*
App defines all routes for the site.
Layout wraps every page with shared UI (like Navbar).
TeamsList is the default landing page.
*/

export default function App() {
  return (
    <Routes>
      {/* Parent route */}
      <Route path="/" element={<Layout />}>
        {/* Default landing page */}
        <Route index element={<TeamsList />} />

        {/* Nested routes */}
        <Route path="teams/:id" element={<TeamDetail />} />
        <Route path="mutants" element={<MutantsList />} />
        <Route path="mutants/:id" element={<MutantDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<Admin />} />

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
