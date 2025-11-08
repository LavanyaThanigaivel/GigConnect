import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import FreelancerProfile from "./components/FreelancerProfile";
import GigForm from "./components/GigForm";
import GigList from "./components/GigList";
import ClientProfile from "./components/ClientProfile";

export default function App() {
  return (
    <div className="app-root">
      <NavBar />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/freelancer-profile" element={<FreelancerProfile />} />
          <Route path="/client-profile" element={<ClientProfile />} />
          <Route path="/gigs" element={<GigList />} />
          <Route path="/gigs/new" element={<GigForm />} />
        </Routes>
      </main>
    </div>
  );
}
