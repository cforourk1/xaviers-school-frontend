import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getMutantById } from "../api/mutants";

export default function MutantDetails() {
  const { id } = useParams();
  const [mutant, setMutant] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const mutantData = await getMutantById(id);
        setMutant(mutantData);
        const teamsRes = await fetch(`${import.meta.env.VITE_API}/mutants/${id}/teams`);
        setTeams(await teamsRes.json());
      } catch (err) {
        console.error("Failed to fetch mutant:", err);
        setError("Unable to load mutant details.");
      }
    }
    fetchData();
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!mutant) return <h2>Loading mutant details...</h2>;

  return (
    <div className="page">
      <h1>{mutant.alias}</h1>
      <img
        src={`${import.meta.env.VITE_API}${mutant.image_url}`}
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
        <strong>Bio:</strong> {mutant.biography}
      </p>

      <h2>Teams</h2>
      {teams.length ? (
        <ul>
          {teams.map(team => (
            <li key={team.id}>
              <Link to={`/teams/${team.id}`}>{team.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No teams found.</p>
      )}

      <Link to="/">← Back to Teams</Link>
    </div>
  );
}