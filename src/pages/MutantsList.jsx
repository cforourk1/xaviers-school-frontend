import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMutants } from "../api/mutants";

export default function MutantsList() {
  const [mutants, setMutants] = useState([]);

  useEffect(() => {
    getMutants()
      .then(setMutants)
      .catch((err) => console.error("Failed to fetch mutants:", err));
  }, []);

  return (
    <div className="page">
      <h1>Mutant Registry</h1>
      <ul>
        {mutants.map((m) => (
          <li key={m.id}>
            <Link to={`/mutants/${m.id}`}>{m.alias}</Link> — {m.name} (
            {m.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
