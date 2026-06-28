import React from "react";
import { Link } from "react-router";
import "../css/Error404.css";

export default function Error404() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>This is not the mutant you are looking for.</p>
      <Link to="/">Return to registry</Link>
    </div>
  );
}
