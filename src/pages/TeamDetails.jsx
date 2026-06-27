import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeam } from "../api/teams";
import { getMutants } from "../api/mutants";

export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const teamData = await getTeam(id);
        const allMutants = await getMutants();
        const teamMutants = allMutants.filter((m) => m.team_id === teamData.id);
        setTeam({ ...teamData, mutants: teamMutants });
      } catch (err) {
        console.error(err);
        setError("Unable to load team details.");
      }
    }
    fetchData();
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!team) return <h2>Loading team details...</h2>;

  return (
    <div className="page">
      <h1>{team.name}</h1>
      <img
        src={team.image_url}
        alt={team.name}
        style={{ width: 400, borderRadius: 8 }}
      />
      <p>
        <strong>Description:</strong> {team.description}
      </p>
      <p>
        <strong>Base:</strong> {team.base_of_operations}
      </p>

      <h2>Mutants in this Team</h2>
      {team.mutants.length ? (
        <ul>
          {team.mutants.map((m) => (
            <li key={m.id}>
              <Link to={`/mutants/${m.id}`}>{m.alias}</Link> — {m.name} (
              {m.status})
            </li>
          ))}
        </ul>
      ) : (
        <p>No mutants found for this team.</p>
      )}

      <Link to="/teams">← Back to Teams</Link>
    </div>
  );
}
