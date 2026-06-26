const BASE_URL = "http://localhost:3000";

export async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = options.headers || {};

  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}
