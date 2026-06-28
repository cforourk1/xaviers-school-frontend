import React from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar.jsx";
import "../css/Navbar.css";

/*
Layout wraps every page with the Navbar.
Outlet renders whatever child route is currently active.
Any URL under "/" uses this as the wrapper.
currentUser and setCurrentUser are passed down from App.jsx
so the Navbar can show/hide the Admin link based on role.
*/

export default function Layout({ currentUser, setCurrentUser }) {
  return (
    <>
      {/* Navbar sits above all page content - receives user info for role-based display */}
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />

      {/* all nested routes render here */}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}