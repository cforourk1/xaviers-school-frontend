import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMutant } from "../api/mutants";

export default function MutantDetails() {
  const { id } = useParams();
  const [mutant, setMutant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMutant(id)
      .then(setMutant)
      .catch((err) => {
        console.error("Failed to fetch mutant:", err);
        setError("Unable to load mutant details.");
      });
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!mutant) return <h2>Loading mutant details...</h2>;

  return (
    <div className="page">
      <h1>{mutant.alias}</h1>
      <img
        src={mutant.image_url}
        alt={mutant.alias}
        style={{ width: "250px", borderRadius: "8px" }}
      />
      <p>
        <strong>Name:</strong> {mutant.name}
      </p>
      <p>
        <strong>Status:</strong> {mutant.status}
      </p>
      <p>
        <strong>Power Description:</strong> {mutant.power_description}
      </p>
      <p>
        <strong>Bio:</strong> {mutant.bio}
      </p>
      <p>
        <strong>Team:</strong> {mutant.team?.name}
      </p>

      {mutant.team && (
        <Link to={`/teams/${mutant.team.id}`}>
          View {mutant.team.name} Details
        </Link>
      )}
    </div>
  );
}
