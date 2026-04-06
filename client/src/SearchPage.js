import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";

function SearchPage() {
  const [certificateId, setCertificateId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const certificateRef = useRef(null);

  const fetchCertificate = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/certificates/search/${id}`
      );
      setCertificate(res.data);
      setError("");
    } catch (err) {
      setCertificate(null);
      setError("Certificate not found ❌");
    }
  };

  const handleSearch = async () => {
    if (!certificateId.trim()) {
      setError("Please enter certificate ID ❌");
      setCertificate(null);
      return;
    }
    await fetchCertificate(certificateId);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      setCertificateId(id);
      fetchCertificate(id);
    }
  }, []);

  const downloadPDF = async () => {
    if (!certificateRef.current || !certificate) return;

    const canvas = await html2canvas(certificateRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    pdf.save(`${certificate.certificateId}.pdf`);
  };

  const verificationLink = certificate
    ? `${window.location.origin}/?id=${certificate.certificateId}`
    : "";

  return (
    <div>
      <h1 className="title">Certificate Verification System</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {certificate && (
        <>
          <div className="certificate-card" ref={certificateRef}>
            <h2>Certificate of Completion</h2>
            <p className="certificate-subtitle">Official Verification Certificate</p>
            <p className="certificate-small-text">This is to certify that</p>

            <h3 className="student-name">
              {certificate.studentName || certificate.name}
            </h3>

            <p className="certificate-small-text">
              has successfully completed internship/training in
            </p>

            <h4 className="course-name">
              {certificate.domain || certificate.course}
            </h4>

            <div className="certificate-info">
              <p><strong>Certificate ID:</strong> {certificate.certificateId}</p>
              <p><strong>Start Date:</strong> {certificate.startDate}</p>
              <p><strong>End Date:</strong> {certificate.endDate}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="verified">{certificate.status} ✅</span>
              </p>
              <p><strong>Issued By:</strong> {certificate.issuedBy}</p>
            </div>

            <div className="qr-box">
              <h3>Scan to Verify</h3>
              <QRCodeCanvas value={verificationLink} size={140} />
              <div className="verify-link">{verificationLink}</div>
            </div>

            <div className="signature-row">
              <div className="signature-box">
                <div className="signature-line"></div>
                <div className="signature-label">Authorized Signature</div>
              </div>

              <div className="seal">
                VERIFIED
                <br />
                CERTIFICATE
              </div>

              <div className="signature-box">
                <div className="signature-line"></div>
                <div className="signature-label">Issuing Authority</div>
              </div>
            </div>
          </div>

          <button className="download-btn" onClick={downloadPDF}>
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}

export default SearchPage;