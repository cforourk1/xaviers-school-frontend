import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../api/teams";
import {
  getMutants,
  createMutant,
  updateMutant,
  deleteMutant,
} from "../api/mutants";

export default function Admin() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const [teams, setTeams] = useState([]);
  const [mutants, setMutants] = useState([]);
  const [teamForm, setTeamForm] = useState({
    name: "",
    base_of_operations: "",
    description: "",
    image_url: "",
  });
  const [mutantForm, setMutantForm] = useState({
    name: "",
    alias: "",
    status: "",
    power_description: "",
    biography: "",
    image_url: "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Load existing data
  useEffect(() => {
    getTeams().then(setTeams);
    getMutants().then(setMutants);
  }, []);

  // Team handlers
  async function handleCreateTeam(e) {
    e.preventDefault();
    const newTeam = await createTeam(teamForm, token);
    setTeams([...teams, newTeam]);
    setTeamForm({
      name: "",
      base_of_operations: "",
      description: "",
      image_url: "",
    });
  }

  async function handleDeleteTeam(id) {
    await deleteTeam(id, token);
    setTeams(teams.filter((t) => t.id !== id));
  }

  // Mutant handlers
  async function handleCreateMutant(e) {
    e.preventDefault();
    const newMutant = await createMutant(mutantForm, token);
    setMutants([...mutants, newMutant]);
    setMutantForm({
      name: "",
      alias: "",
      status: "",
      power_description: "",
      biography: "",
      image_url: "",
    });
  }

  async function handleDeleteMutant(id) {
    await deleteMutant(id, token);
    setMutants(mutants.filter((m) => m.id !== id));
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <section>
        <h2>Add New Team</h2>
        <form onSubmit={handleCreateTeam}>
          <input
            placeholder="Team Name"
            value={teamForm.name}
            onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
          />
          <input
            placeholder="Base of Operations"
            value={teamForm.base_of_operations}
            onChange={(e) =>
              setTeamForm({ ...teamForm, base_of_operations: e.target.value })
            }
          />
          <input
            placeholder="Description"
            value={teamForm.description}
            onChange={(e) =>
              setTeamForm({ ...teamForm, description: e.target.value })
            }
          />
          <input
            placeholder="Image URL"
            value={teamForm.image_url}
            onChange={(e) =>
              setTeamForm({ ...teamForm, image_url: e.target.value })
            }
          />
          <button type="submit">Create Team</button>
        </form>

        <h3>Existing Teams</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.id}>
              {team.name} — {team.base_of_operations}
              <button onClick={() => handleDeleteTeam(team.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Add New Mutant</h2>
        <form onSubmit={handleCreateMutant}>
          <input
            placeholder="Name"
            value={mutantForm.name}
            onChange={(e) =>
              setMutantForm({ ...mutantForm, name: e.target.value })
            }
          />
          <input
            placeholder="Alias"
            value={mutantForm.alias}
            onChange={(e) =>
              setMutantForm({ ...mutantForm, alias: e.target.value })
            }
          />
          <input
            placeholder="Status"
            value={mutantForm.status}
            onChange={(e) =>
              setMutantForm({ ...mutantForm, status: e.target.value })
            }
          />
          <input
            placeholder="Power Description"
            value={mutantForm.power_description}
            onChange={(e) =>
              setMutantForm({
                ...mutantForm,
                power_description: e.target.value,
              })
            }
          />
          <input
            placeholder="Biography"
            value={mutantForm.biography}
            onChange={(e) =>
              setMutantForm({ ...mutantForm, biography: e.target.value })
            }
          />
          <input
            placeholder="Image URL"
            value={mutantForm.image_url}
            onChange={(e) =>
              setMutantForm({ ...mutantForm, image_url: e.target.value })
            }
          />
          <button type="submit">Create Mutant</button>
        </form>

        <h3>Existing Mutants</h3>
        <ul>
          {mutants.map((m) => (
            <li key={m.id}>
              {m.alias} ({m.status})
              <button onClick={() => handleDeleteMutant(m.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
