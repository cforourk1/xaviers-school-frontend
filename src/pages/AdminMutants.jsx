import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { getMutants, createMutant, updateMutant, deleteMutant } from "../api/mutants";
import "../css/Admin.css";

export default function AdminMutants({ currentUser }) {
  const navigate = useNavigate();

  // get token from sessionStorage - if null redirect to login
  const token = sessionStorage.getItem("token");

  // holds the full list of mutants fetched from the backend
  const [mutants, setMutants] = useState([]);

  // holds the mutant currently being edited - null means nothing is being edited
  const [editingMutant, setEditingMutant] = useState(null);

  // holds the values for the create new mutant form - starts empty
  const [mutantForm, setMutantForm] = useState({
    name: "",
    alias: "",
    status: "",
    power_description: "",
    biography: "",
    image_url: "",
  });

  // redirect to login if no token
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // fetch all mutants from backend when page loads
  useEffect(() => {
    getMutants().then(setMutants);
  }, []);

  // helper — returns true if the current user can edit/delete this record
  // admin can edit anything, regular users can only edit what they created
  function canEdit(record) {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return record.created_by === currentUser.id;
  }

  // called when the create mutant form is submitted
  // sends form data to backend, adds new mutant to list, resets form
  async function handleCreateMutant(e) {
    e.preventDefault();
    const newMutant = await createMutant(mutantForm, token);
    setMutants([...mutants, newMutant]);
    setMutantForm({ name: "", alias: "", status: "", power_description: "", biography: "", image_url: "" });
  }

  // called when the edit mutant form is submitted
  // sends updated data to backend, replaces old mutant in list
  async function handleUpdateMutant(e) {
    e.preventDefault();
    await updateMutant(editingMutant.id, editingMutant, token);
    setMutants(mutants.map(m => m.id === editingMutant.id ? editingMutant : m));
    setEditingMutant(null);
  }

  // called when delete is clicked - asks for confirmation first
  async function handleDeleteMutant(id, alias) {
    if (!window.confirm(`Are you sure you want to delete ${alias}?`)) return;
    await deleteMutant(id, token);
    setMutants(mutants.filter(m => m.id !== id));
  }

  // returns the right css class based on mutant status
  function getStatusClass(status) {
    if (status === "active") return "status-badge status-active";
    if (status === "deceased") return "status-badge status-deceased";
    return "status-badge status-unknown";
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Mutants</h1>
        <Link to="/admin" className="btn-cancel">← Back to dashboard</Link>
      </div>

      <section className="admin-section">
        <h2>Add new mutant</h2>

        {/* vertical form for creating a new mutant */}
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

        {/* list of all mutants with profile image, status badge, edit and delete buttons */}
        <ul className="admin-list" aria-label="Existing mutants">
          {mutants.map(m => (
            <li key={m.id} className="admin-list-item">
              <div className="admin-list-item-info">
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
                {/* color coded status badge */}
                <span className={getStatusClass(m.status)}>{m.status}</span>
              </div>

              {/* only show edit/delete if user has permission */}
              {canEdit(m) && (
                <div className="admin-list-item-actions">
                  <button className="btn-edit" onClick={() => setEditingMutant(m)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDeleteMutant(m.id, m.alias)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* edit form only shows when editingMutant is not null */}
        {editingMutant && (
          <div className="edit-form-wrapper">
            <h3>Editing: {editingMutant.alias}</h3>
            {/* inputs pre-filled with current mutant data - updates editingMutant as you type */}
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
                <button className="btn-cancel" type="button" onClick={() => setEditingMutant(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}