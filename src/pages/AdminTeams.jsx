import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teams";
import "../css/Admin.css";

export default function AdminTeams({ currentUser }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
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

  // helper — returns true if the current user can edit/delete this record
  // admin can edit anything, regular users can only edit what they created
  function canEdit(record) {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return record.created_by === currentUser.id;
  }

  // called when the create team form is submitted
  async function handleCreateTeam(e) {
    e.preventDefault();
    const newTeam = await createTeam(teamForm, token);
    setTeams([...teams, newTeam]);
    setTeamForm({ name: "", base_of_operations: "", description: "", image_url: "" });
  }

  // called when the edit team form is submitted
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
              {/* only show edit/delete if user has permission */}
              {canEdit(team) && (
                <div className="admin-list-item-actions">
                  <button className="btn-edit" onClick={() => setEditingTeam(team)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteTeam(team.id, team.name)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* edit form only shows when editingTeam is not null */}
        {editingTeam && (
          <div className="edit-form-wrapper">
            <h3>Editing: {editingTeam.name}</h3>
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
                <button className="btn-cancel" type="button" onClick={() => setEditingTeam(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}