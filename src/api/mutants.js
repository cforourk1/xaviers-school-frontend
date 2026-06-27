
// conection
const API = import.meta.env.VITE_API;

//call back all mutants
export async function getMutants() {
  const res = await fetch(`${API}/mutants`)
  return res.json()
}

// get a mutant by ID number
export async function getMutantById(id) {
  const res = await fetch(`${API}/mutants/${id}`)
  return res.json()
}

// create a mutant
export async function createMutant(mutant, token) {
  const res = await fetch(`${API}/mutants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mutant),
  })
  return res.json()
}

// post update a mutants information
export async function updateMutant(id, mutant, token) {
  const res = await fetch(`${API}/mutants/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(mutant),
  })
  return res.json()
}

//delete a mutant

export async function deleteMutant(id, token) {
  await fetch(`${API}/mutants/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}
