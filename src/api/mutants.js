import { request } from "./client";

export const getMutants = () => request("/mutants", { method: "GET" });
export const getMutant = (id) => request(`/mutants/${id}`, { method: "GET" });
