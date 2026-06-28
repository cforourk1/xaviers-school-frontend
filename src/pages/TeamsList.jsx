import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { getTeams } from "../api/teams";
import "../css/TeamsList.css";

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  // fetch all teams from backend on load
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
            {/* team banner image */}
            {team.image_url && (
              <img
                src={`${import.meta.env.VITE_API}${team.image_url}`}
                alt={`${team.name} banner`}
              />
            )}
            <h2 className="team-name">{team.name}</h2>
            <p className="team-base">{team.base_of_operations}</p>
            <Link to={`/teams/${team.id}`} className="team-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
