import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teams";
import { getMutants, createMutant, updateMutant, deleteMutant } from "../api/mutants";
import "../css/Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  // get the token from sessionStorage - if null, user is not logged in
  const token = sessionStorage.getItem("token");

  // holds the full list of teams and mutants fetched from the backend
  const [teams, setTeams] = useState([]);
  const [mutants, setMutants] = useState([]);

  // holds the team or mutant currently being edited
  // starts as null (nothing being edited)
  // when edit is clicked, this gets set to that team/mutant object
  // when save or cancel is clicked, this gets set back to null
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingMutant, setEditingMutant] = useState(null);

  // holds the values for the CREATE new team form - starts empty
  const [teamForm, setTeamForm] = useState({
    name: "",
    base_of_operations: "",
    description: "",
    image_url: "",
  });

  // holds the values for the CREATE new mutant form - starts empty
  const [mutantForm, setMutantForm] = useState({
    name: "",
    alias: "",
    status: "",
    power_description: "",
    biography: "",
    image_url: "",
  });

  // if there is no token, redirect to login immediately
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // when the page loads, fetch all teams and mutants from the backend
  useEffect(() => {
    getTeams().then(setTeams);
    getMutants().then(setMutants);
  }, []);

  // ── TEAM HANDLERS ──────────────────────────────

  // called when the create team form is submitted
  // sends the form data to the backend, adds the new team to the list
  async function handleCreateTeam(e) {
    e.preventDefault();
    const newTeam = await createTeam(teamForm, token);
    setTeams([...teams, newTeam]);
    // reset the form back to empty after creating
    setTeamForm({ name: "", base_of_operations: "", description: "", image_url: "" });
  }

  // called when the edit team form is submitted
  // sends the updated team data to the backend
  // replaces the old team in the list with the updated one
  // clears editingTeam back to null to close the form
  async function handleUpdateTeam(e) {
    e.preventDefault();
    await updateTeam(editingTeam.id, editingTeam, token);
    setTeams(teams.map(t => t.id === editingTeam.id ? editingTeam : t));
    setEditingTeam(null);
  }

  // called when delete is clicked on a team
  // asks for confirmation before deleting
  // sends delete request to backend, removes team from the list
  async function handleDeleteTeam(id, name) {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    await deleteTeam(id, token);
    setTeams(teams.filter(t => t.id !== id));
  }

  // ── MUTANT HANDLERS ──────────────────────────────

  // called when the create mutant form is submitted
  // sends the form data to the backend, adds the new mutant to the list
  async function handleCreateMutant(e) {
    e.preventDefault();
    const newMutant = await createMutant(mutantForm, token);
    setMutants([...mutants, newMutant]);
    // reset the form back to empty after creating
    setMutantForm({ name: "", alias: "", status: "", power_description: "", biography: "", image_url: "" });
  }

  // called when the edit mutant form is submitted
  // sends the updated mutant data to the backend
  // replaces the old mutant in the list with the updated one
  // clears editingMutant back to null to close the form
  async function handleUpdateMutant(e) {
    e.preventDefault();
    await updateMutant(editingMutant.id, editingMutant, token);
    setMutants(mutants.map(m => m.id === editingMutant.id ? editingMutant : m));
    setEditingMutant(null);
  }

  // called when delete is clicked on a mutant
  // asks for confirmation before deleting
  // sends delete request to backend, removes mutant from the list
  async function handleDeleteMutant(id, alias) {
    if (!window.confirm(`Are you sure you want to delete ${alias}?`)) return;
    await deleteMutant(id, token);
    setMutants(mutants.filter(m => m.id !== id));
  }

  // clears the token and sends the user back to the home page
  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  // helper to get the right status badge class
  function getStatusClass(status) {
    if (status === "active") return "status-badge status-active";
    if (status === "deceased") return "status-badge status-deceased";
    return "status-badge status-unknown";
  }

  return (
    <div className="admin-page">

      {/* header with title and logout button */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* ── TEAMS SECTION ── */}
      <section className="admin-section">
        <h2>Teams</h2>

        {/* create team form - vertical layout, controlled inputs update teamForm state as you type */}
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
            placeholder="Image path (e.g. /images/xmen.jpg)"
            value={teamForm.image_url}
            onChange={(e) => setTeamForm({ ...teamForm, image_url: e.target.value })}
            aria-label="Image URL"
          />
          <button className="btn-primary" type="submit">Add team</button>
        </form>

        <h3>Existing teams</h3>

        {/* list of existing teams with edit and delete buttons */}
        <ul className="admin-list" aria-label="Existing teams">
          {teams.map(team => (
            <li key={team.id} className="admin-list-item">
              <div className="admin-list-item-info">
                {/* team image if available */}
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
                {/* clicking edit sets editingTeam to this team, showing the edit form below */}
                <button className="btn-edit" onClick={() => setEditingTeam(team)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteTeam(team.id, team.name)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        {/* edit team form - only shows when editingTeam is not null */}
        {editingTeam && (
          <div className="edit-form-wrapper">
            <h3>Editing: {editingTeam.name}</h3>
            {/* inputs are pre-filled with the current team data
                as you type, editingTeam state updates with the new values */}
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

      {/* ── MUTANTS SECTION ── */}
      <section className="admin-section">
        <h2>Mutants</h2>

        {/* create mutant form - vertical layout, controlled inputs update mutantForm state as you type */}
        <form className="admin-form" onSubmit={handleCreateMutant}>
          <input
            placeholder="Full name"
            value={mutantForm.name}
            onChange={(e) => setMutantForm({ ...mutantForm, name: e.target.value })}
            aria-label="Full name"
          />
          <input
            placeholder="Alias / codename"
            value={mutantForm.alias}
            onChange={(e) => setMutantForm({ ...mutantForm, alias: e.target.value })}
            aria-label="Alias"
          />
          <input
            placeholder="Status (active, deceased, unknown)"
            value={mutantForm.status}
            onChange={(e) => setMutantForm({ ...mutantForm, status: e.target.value })}
            aria-label="Status"
          />
          <input
            placeholder="Power description"
            value={mutantForm.power_description}
            onChange={(e) => setMutantForm({ ...mutantForm, power_description: e.target.value })}
            aria-label="Power description"
          />
          <input
            placeholder="Biography"
            value={mutantForm.biography}
            onChange={(e) => setMutantForm({ ...mutantForm, biography: e.target.value })}
            aria-label="Biography"
          />
          <input
            placeholder="Image path (e.g. /images/wolverine.png)"
            value={mutantForm.image_url}
            onChange={(e) => setMutantForm({ ...mutantForm, image_url: e.target.value })}
            aria-label="Image URL"
          />
          <button className="btn-primary" type="submit">Add mutant</button>
        </form>

        <h3>Existing mutants</h3>

        {/* list of existing mutants with profile image, status badge, edit and delete buttons */}
        <ul className="admin-list" aria-label="Existing mutants">
          {mutants.map(m => (
            <li key={m.id} className="admin-list-item">
              <div className="admin-list-item-info">
                {/* mutant profile image if available */}
                {m.image_url && (
                  <img
                    src={`${import.meta.env.VITE_API}${m.image_url}`}
                    alt={`${m.alias} profile`}
                  />
                )}
                <div>
                  <div className="admin-list-item-name">{m.alias}</div>
                  <div className="admin-list-item-sub">{m.name}</div>
                </div>
                {/* status badge - color changes based on active/deceased/unknown */}
                <span className={getStatusClass(m.status)}>{m.status}</span>
              </div>
              <div className="admin-list-item-actions">
                {/* clicking edit sets editingMutant to this mutant, showing the edit form below */}
                <button className="btn-edit" onClick={() => setEditingMutant(m)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDeleteMutant(m.id, m.alias)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        {/* edit mutant form - only shows when editingMutant is not null */}
        {editingMutant && (
          <div className="edit-form-wrapper">
            <h3>Editing: {editingMutant.alias}</h3>
            {/* inputs are pre-filled with the current mutant data
                as you type, editingMutant state updates with the new values */}
            <form className="admin-form" onSubmit={handleUpdateMutant}>
              <input
                value={editingMutant.name}
                onChange={(e) => setEditingMutant({ ...editingMutant, name: e.target.value })}
                aria-label="Full name"
              />
              <input
                value={editingMutant.alias}
                onChange={(e) => setEditingMutant({ ...editingMutant, alias: e.target.value })}
                aria-label="Alias"
              />
              <input
                value={editingMutant.status}
                onChange={(e) => setEditingMutant({ ...editingMutant, status: e.target.value })}
                aria-label="Status"
              />
              <input
                value={editingMutant.power_description}
                onChange={(e) => setEditingMutant({ ...editingMutant, power_description: e.target.value })}
                aria-label="Power description"
              />
              <input
                value={editingMutant.biography}
                onChange={(e) => setEditingMutant({ ...editingMutant, biography: e.target.value })}
                aria-label="Biography"
              />
              <input
                value={editingMutant.image_url}
                onChange={(e) => setEditingMutant({ ...editingMutant, image_url: e.target.value })}
                aria-label="Image URL"
              />
              <div className="form-actions">
                <button className="btn-primary" type="submit">Save changes</button>
                {/* cancel clears editingMutant without saving */}
                <button className="btn-cancel" type="button" onClick={() => setEditingMutant(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}