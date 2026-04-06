import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminUploadPage() {
  const [studentName, setStudentName] = useState("");
  const [domain, setDomain] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentName || !domain || !startDate || !endDate || !issuedBy || !file) {
      alert("Please fill all fields ❌");
      return;
    }

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("domain", domain);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("issuedBy", issuedBy);
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/certificates/upload",
        formData
      );

      alert("Uploaded Successfully ✅ ID: " + res.data.certificateId);

      setStudentName("");
      setDomain("");
      setStartDate("");
      setEndDate("");
      setIssuedBy("");
      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Upload Failed ❌");
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Upload Page</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Domain / Course"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Issued By"
          value={issuedBy}
          onChange={(e) => setIssuedBy(e.target.value)}
        />

        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Upload 🚀</button>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </form>
    </div>
  );
}

export default AdminUploadPage;