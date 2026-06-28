import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teams";
import "../css/Admin.css";

export default function AdminTeams() {
  const navigate = useNavigate();

  // get token from sessionStorage - if null redirect to login
  const token = sessionStorage.getItem("token");

  // holds the full list of teams fetched from the backend
  const [teams, setTeams] = useState([]);

  // holds the team currently being edited - null means nothing is being edited
  const [editingTeam, setEditingTeam] = useState(null);

  // holds the values for the create new team form - starts empty
  const [teamForm, setTeamForm] = useState({
    name: "",
    base_of_operations: "",
    description: "",
    image_url: "",
  });

  // redirect to login if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // fetch all teams from backend when page loads
  useEffect(() => {
    getTeams().then(setTeams);
  }, []);

  // called when the create team form is submitted
  // sends form data to backend, adds new team to list, resets form
  async function handleCreateTeam(e) {
    e.preventDefault();
    const newTeam = await createTeam(teamForm, token);
    setTeams([...teams, newTeam]);
    setTeamForm({ name: "", base_of_operations: "", description: "", image_url: "" });
  }

  // called when the edit team form is submitted
  // sends updated data to backend, replaces old team in list, closes form
  async function handleUpdateTeam(e) {
    e.preventDefault();
    await updateTeam(editingTeam.id, editingTeam, token);
    setTeams(teams.map(t => t.id === editingTeam.id ? editingTeam : t));
    setEditingTeam(null);
  }

  // called when delete is clicked - asks for confirmation first
  async function handleDeleteTeam(id, name) {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    await deleteTeam(id, token);
    setTeams(teams.filter(t => t.id !== id));
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Teams</h1>
        <Link to="/admin" className="btn-cancel">← Back to dashboard</Link>
      </div>

      <section className="admin-section">
        <h2>Add new team</h2>

        {/* vertical form for creating a new team */}
        <form className="admin-form" onSubmit={handleCreateTeam}>
          <input
            placeholder="Team name"
            value={teamForm.name}
            onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
            aria-label="Team name"
          />
          <input
            placeholder="Base of operations"
            value={teamForm.base_of_operations}
            onChange={(e) => setTeamForm({ ...teamForm, base_of_operations: e.target.value })}
            aria-label="Base of operations"
          />
          <input
            placeholder="Description"
            value={teamForm.description}
            onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
            aria-label="Description"
          />
          <input
            placeholder="Image path (e.g. /images/xmen.png)"
            value={teamForm.image_url}
            onChange={(e) => setTeamForm({ ...teamForm, image_url: e.target.value })}
            aria-label="Image URL"
          />
          <button className="btn-primary" type="submit">Add team</button>
        </form>

        <h3>Existing teams</h3>

        {/* list of all teams with image, name, base, edit and delete buttons */}
        <ul className="admin-list" aria-label="Existing teams">
          {teams.map(team => (
            <li key={team.id} className="admin-list-item">
              <div className="admin-list-item-info">
                {team.image_url && (
                  <img
                    src={`${import.meta.env.VITE_API}${team.image_url}`}
                    alt={`${team.name} team logo`}
                  />
                )}
                <div>
                  <div className="admin-list-item-name">{team.name}</div>
                  <div className="admin-list-item-sub">{team.base_of_operations}</div>
                </div>
              </div>
              <div className="admin-list-item-actions">
                {/* clicking edit stores this team in editingTeam state, showing the edit form */}
                <button className="btn-edit" onClick={() => setEditingTeam(team)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteTeam(team.id, team.name)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        {/* edit form only shows when editingTeam is not null */}
        {editingTeam && (
          <div className="edit-form-wrapper">
            <h3>Editing: {editingTeam.name}</h3>
            {/* inputs pre-filled with current team data - updates editingTeam as you type */}
            <form className="admin-form" onSubmit={handleUpdateTeam}>
              <input
                value={editingTeam.name}
                onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                aria-label="Team name"
              />
              <input
                value={editingTeam.base_of_operations}
                onChange={(e) => setEditingTeam({ ...editingTeam, base_of_operations: e.target.value })}
                aria-label="Base of operations"
              />
              <input
                value={editingTeam.description}
                onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
                aria-label="Description"
              />
              <input
                value={editingTeam.image_url}
                onChange={(e) => setEditingTeam({ ...editingTeam, image_url: e.target.value })}
                aria-label="Image URL"
              />
              <div className="form-actions">
                <button className="btn-primary" type="submit">Save changes</button>
                {/* cancel clears editingTeam without saving */}
                <button className="btn-cancel" type="button" onClick={() => setEditingTeam(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
