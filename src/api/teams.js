import { request } from "./client";

export const getTeams = () => request("/teams", { method: "GET" });
export const getTeam = (id) => request(`/teams/${id}`, { method: "GET" });
