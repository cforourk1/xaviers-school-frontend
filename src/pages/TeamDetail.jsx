import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getTeamById } from "../api/teams";
import "../css/TeamDetail.css";

export default function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

  // fetch team by id - mutants are already included in the response
  // useEffect cannot be async directly so we define fetchData inside it
  useEffect(() => {
    async function fetchData() {
      try {
        const teamData = await getTeamById(id);
        setTeam(teamData);
      } catch (err) {
        console.error(err);
        setError("Unable to load team details.");
      }
    }
    fetchData();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!team) return <p className="loading">Loading team...</p>;

  return (
    <div className="team-detail">
      <div className="team-detail-header">
        <h1>{team.name}</h1>
        {team.image_url && (
          <img
            className="team-detail-banner"
            src={`${import.meta.env.VITE_API}${team.image_url}`}
            alt={`${team.name} banner`}
          />
        )}
      </div>

      {/* team info block */}
      <div className="team-detail-meta">
        <p><strong>Base of operations:</strong> {team.base_of_operations}</p>
        <p><strong>Description:</strong> {team.description}</p>
      </div>

      {/* mutant roster */}
      <h2 className="mutant-roster-title">Mutants in this team</h2>
      {team.mutants && team.mutants.length ? (
        <ul className="mutant-roster">
          {team.mutants.map((m) => (
            <li key={m.id}>
              <Link to={`/mutants/${m.id}`} className="mutant-roster-item">
                <span>{m.alias}</span>
                <em>{m.name}</em>
                <em className={`status-${m.status}`}>({m.status})</em>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No mutants found for this team.</p>
      )}

      <Link to="/" className="back-link">← Back to Teams</Link>
    </div>
  );
}
