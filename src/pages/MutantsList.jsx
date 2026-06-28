import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { getMutants } from "../api/mutants";
import "../css/MutantsList.css";

export default function MutantsList() {
  const [mutants, setMutants] = useState([]);

  // fetch all mutants on load
  useEffect(() => {
    getMutants()
      .then(setMutants)
      .catch((err) => console.error("Failed to fetch mutants:", err));
  }, []);

  return (
    <div className="mutants-page">
      <h1 className="mutants-title">Mutant Registry</h1>
      <div className="mutants-grid">
        {mutants.map((m) => (
          // each mutant links to their detail page
          <Link to={`/mutants/${m.id}`} key={m.id} className="mutant-card">
            {m.image_url && (
              <img
                src={`${import.meta.env.VITE_API}${m.image_url}`}
                alt={`${m.alias} profile`}
              />
            )}
            <div className="mutant-card-body">
              <p className="mutant-card-alias">{m.alias}</p>
              <p className="mutant-card-name">{m.name}</p>
              <span className={`mutant-status ${m.status}`}>{m.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
