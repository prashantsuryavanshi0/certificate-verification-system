import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const adminPassword = "admin123";

    if (password === adminPassword) {
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Wrong password ❌");
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Login</h2>

      <form onSubmit={handleLogin} className="admin-form">
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default AdminLoginPage;