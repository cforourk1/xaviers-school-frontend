import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getMutantById } from "../api/mutants";
import "../css/MutantDetail.css";

export default function MutantDetail() {
  const { id } = useParams();
  const [mutant, setMutant] = useState(null);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  // fetch mutant by id and also fetch all teams this mutant belongs to
  // useEffect cannot be async directly so we define fetchData inside it
  useEffect(() => {
    async function fetchData() {
      try {
        const mutantData = await getMutantById(id);
        setMutant(mutantData);
        // fetch teams this mutant belongs to via junction table route
        const teamsRes = await fetch(`${import.meta.env.VITE_API}/mutants/${id}/teams`);
        setTeams(await teamsRes.json());
      } catch (err) {
        console.error("Failed to fetch mutant:", err);
        setError("Unable to load mutant details.");
      }
    }
    fetchData();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!mutant) return <p>Loading mutant...</p>;

  return (
    <div className="mutant-detail">
      <div className="mutant-detail-header">
        <h1>{mutant.alias}</h1>
        {mutant.image_url && (
          <img
            className="mutant-detail-image"
            src={`${import.meta.env.VITE_API}${mutant.image_url}`}
            alt={`${mutant.alias} profile`}
          />
        )}
        {/* status badge with color based on active/deceased/unknown */}
        <span className={`mutant-detail-status ${mutant.status}`}>
          {mutant.status}
        </span>
      </div>

      {/* real name */}
      <div className="mutant-detail-section">
        <h2>Real name</h2>
        <p>{mutant.name}</p>
      </div>

      {/* powers */}
      <div className="mutant-detail-section">
        <h2>Powers</h2>
        <p>{mutant.power_description}</p>
      </div>

      {/* biography */}
      <div className="mutant-detail-section">
        <h2>Biography</h2>
        <p>{mutant.biography}</p>
      </div>

      {/* teams this mutant belongs to - fetched via junction table */}
      <h2 className="mutant-teams-title">Teams</h2>
      {teams.length ? (
        <ul className="mutant-teams-list">
          {teams.map(team => (
            <li key={team.id}>
              <Link to={`/teams/${team.id}`}>{team.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No teams found.</p>
      )}

      <Link to="/mutants" className="back-link">← Back to Mutants</Link>
    </div>
  );
}
