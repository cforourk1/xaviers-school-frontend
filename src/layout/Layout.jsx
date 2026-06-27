import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

/*
Layout acts as the wrapper for all pages.
Any URL using "/" will use Layout as a wrapper.
It includes the Navbar and main content area.
All nested routes render inside <Outlet />.
*/

export default function Layout() {
  return (
    <>
      {/* Navbar is layout, not page content */}
      <Navbar />

      {/* Main content area for nested routes */}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}
