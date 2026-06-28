import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teams";
import { getMutants, createMutant, updateMutant, deleteMutant } from "../api/mutants";

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
  // sends delete request to backend, removes team from the list
  async function handleDeleteTeam(id) {
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
  // sends delete request to backend, removes mutant from the list
  async function handleDeleteMutant(id) {
    await deleteMutant(id, token);
    setMutants(mutants.filter(m => m.id !== id));
  }

  // clears the token and sends the user back to the home page
  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* ── TEAMS SECTION ── */}
      <section>
        <h2>Add New Team</h2>

        {/* create team form - controlled inputs update teamForm state as you type */}
        <form onSubmit={handleCreateTeam}>
          <input placeholder="Team Name" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
          <input placeholder="Base of Operations" value={teamForm.base_of_operations} onChange={(e) => setTeamForm({ ...teamForm, base_of_operations: e.target.value })} />
          <input placeholder="Description" value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} />
          <input placeholder="Image URL" value={teamForm.image_url} onChange={(e) => setTeamForm({ ...teamForm, image_url: e.target.value })} />
          <button type="submit">Create Team</button>
        </form>

        <h3>Existing Teams</h3>
        <ul>
          {teams.map(team => (
            <li key={team.id}>
              {team.name} — {team.base_of_operations}
              {/* clicking edit sets editingTeam to this team, which shows the edit form below */}
              <button onClick={() => setEditingTeam(team)}>Edit</button>
              <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
            </li>
          ))}
        </ul>

        {/* edit team form only shows when editingTeam is not null */}
        {editingTeam && (
          <form onSubmit={handleUpdateTeam}>
            <h3>Editing: {editingTeam.name}</h3>
            {/* inputs are pre-filled with the current team data from editingTeam */}
            {/* as you type, editingTeam state updates with the new values */}
            <input value={editingTeam.name} onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })} />
            <input value={editingTeam.base_of_operations} onChange={(e) => setEditingTeam({ ...editingTeam, base_of_operations: e.target.value })} />
            <input value={editingTeam.description} onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })} />
            <input value={editingTeam.image_url} onChange={(e) => setEditingTeam({ ...editingTeam, image_url: e.target.value })} />
            <button type="submit">Save Changes</button>
            {/* cancel clears editingTeam without saving */}
            <button type="button" onClick={() => setEditingTeam(null)}>Cancel</button>
          </form>
        )}
      </section>

      {/* ── MUTANTS SECTION ── */}
      <section>
        <h2>Add New Mutant</h2>

        {/* create mutant form - controlled inputs update mutantForm state as you type */}
        <form onSubmit={handleCreateMutant}>
          <input placeholder="Name" value={mutantForm.name} onChange={(e) => setMutantForm({ ...mutantForm, name: e.target.value })} />
          <input placeholder="Alias" value={mutantForm.alias} onChange={(e) => setMutantForm({ ...mutantForm, alias: e.target.value })} />
          <input placeholder="Status" value={mutantForm.status} onChange={(e) => setMutantForm({ ...mutantForm, status: e.target.value })} />
          <input placeholder="Power Description" value={mutantForm.power_description} onChange={(e) => setMutantForm({ ...mutantForm, power_description: e.target.value })} />
          <input placeholder="Biography" value={mutantForm.biography} onChange={(e) => setMutantForm({ ...mutantForm, biography: e.target.value })} />
          <input placeholder="Image URL" value={mutantForm.image_url} onChange={(e) => setMutantForm({ ...mutantForm, image_url: e.target.value })} />
          <button type="submit">Create Mutant</button>
        </form>

        <h3>Existing Mutants</h3>
        <ul>
          {mutants.map(m => (
            <li key={m.id}>
              {m.alias} ({m.status})
              {/* clicking edit sets editingMutant to this mutant, which shows the edit form below */}
              <button onClick={() => setEditingMutant(m)}>Edit</button>
              <button onClick={() => handleDeleteMutant(m.id)}>Delete</button>
            </li>
          ))}
        </ul>

        {/* edit mutant form only shows when editingMutant is not null */}
        {editingMutant && (
          <form onSubmit={handleUpdateMutant}>
            <h3>Editing: {editingMutant.alias}</h3>
            {/* inputs are pre-filled with the current mutant data from editingMutant */}
            {/* as you type, editingMutant state updates with the new values */}
            <input value={editingMutant.name} onChange={(e) => setEditingMutant({ ...editingMutant, name: e.target.value })} />
            <input value={editingMutant.alias} onChange={(e) => setEditingMutant({ ...editingMutant, alias: e.target.value })} />
            <input value={editingMutant.status} onChange={(e) => setEditingMutant({ ...editingMutant, status: e.target.value })} />
            <input value={editingMutant.power_description} onChange={(e) => setEditingMutant({ ...editingMutant, power_description: e.target.value })} />
            <input value={editingMutant.biography} onChange={(e) => setEditingMutant({ ...editingMutant, biography: e.target.value })} />
            <input value={editingMutant.image_url} onChange={(e) => setEditingMutant({ ...editingMutant, image_url: e.target.value })} />
            <button type="submit">Save Changes</button>
            {/* cancel clears editingMutant without saving */}
            <button type="button" onClick={() => setEditingMutant(null)}>Cancel</button>
          </form>
        )}
      </section>
    </div>
  );
}