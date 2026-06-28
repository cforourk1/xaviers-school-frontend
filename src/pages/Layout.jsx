import React from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar.jsx";
import "../css/Navbar.css";

/*
Layout wraps every page with the Navbar.
Outlet renders whatever child route is currently active.
Any URL under "/" uses this as the wrapper.
*/

export default function Layout() {
  return (
    <>
      {/* Navbar sits above all page content */}
      <Navbar />

      {/* all nested routes render here */}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}
