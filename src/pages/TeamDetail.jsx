import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getTeamById } from "../api/teams";


export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

/* updated this useEffect to handle the team info. based on the change made to the junction table on the back end. use effect cannot handle async directly so another function exists inside it. then the try anc catch error to see if the team exists.

*/
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

     <Link to="/">← Back to Teams</Link>
    </div>
  );
}
