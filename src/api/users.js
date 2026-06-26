import { request } from "./client";

export const register = (payload) =>
  request("/users/register", { method: "POST", body: payload });

export const login = (payload) =>
  request("/users/login", { method: "POST", body: payload });
