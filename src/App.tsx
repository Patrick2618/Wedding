import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InvitadoProvider } from "./components/InvitadoContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import InformationPage from "./pages/InformationPage"; // tu página completa actual
import RegistrationPage from "./pages/RegistrationPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import Home from "./pages/HomePage";
import TokenPage from "./pages/TokenPage"; // NUEVA

export default function App() {
  return (
    <InvitadoProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background-light">
          <Routes>
            {/* Admin Dashboard - sin header/footer */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* INICIO (sin Header ni Footer) */}
            <Route path="/" element={<TokenPage />} />

            {/* Resto del sitio con header y footer */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/informacion" element={<InformationPage />} />
                      <Route path="/inicio" element={<Home />} />
                      <Route path="/registro" element={<RegistrationPage />} />
                      <Route path="/confirmacion" element={<ConfirmationPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </InvitadoProvider>
  );
}
