import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTeams } from "../api/teams";

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setError("Unable to load teams.");
      }
    }
    fetchTeams();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!teams.length) return <p className="loading">Loading teams...</p>;

  return (
    <div className="teams-wrapper">
      <h1 className="teams-title">Teams</h1>
      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <h2 className="team-name">{team.name}</h2>
            <p className="team-base">
              <strong>Base:</strong> {team.base_of_operations}
            </p>
            <Link to={`/teams/${team.id}`} className="team-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
