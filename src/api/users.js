//register a user
export async function register(username, password) {
  const res = await fetch('http://localhost:3000/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return res.text()
}

// login function - takes in username password, verifies it against token.
export async function login(username, password) {
  const res = await fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return res.text()
}

// get current user information to check against for put and delete req 
export async function getMe(token) {
  const res = await fetch(`${import.meta.env.VITE_API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}