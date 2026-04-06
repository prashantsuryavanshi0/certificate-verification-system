import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import SearchPage from "./SearchPage";
import AdminUploadPage from "./AdminUploadPage";
import AdminLoginPage from "./AdminLoginPage";
import "./App.css";

function ProtectedRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
  return isAdminLoggedIn ? children : <Navigate to="/admin-login" />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <Link to="/">Certificate Search</Link>
          <Link to="/admin-login">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminUploadPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;