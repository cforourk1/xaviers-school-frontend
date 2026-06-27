import { Routes, Route } from "react-router";
import Layout from "./layout/Layout";
import TeamsList from "./pages/TeamsList";
import TeamDetail from "./pages/TeamDetail";
import MutantsList from "./pages/MutantsList";
import MutantDetail from "./pages/MutantDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Error404 from "./pages/Error404";
import "./App.css";

/*
import routes the parent route any URL using / will use layout as A wrapper it will wrap all other pages with the navbar and main content area. added layout and 404
*/
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TeamsList />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/mutants" element={<MutantsList />} />
        <Route path="/mutants/:id" element={<MutantDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}
