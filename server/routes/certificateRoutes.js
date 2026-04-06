const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const Certificate = require("../models/certificate");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

function formatExcelDate(excelDate) {
  if (typeof excelDate === "number") {
    const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
    return jsDate.toISOString().split("T")[0];
  }
  return excelDate;
}

// Search certificate by ID
router.get("/search/:id", async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      certificateId: req.params.id,
    });

    if (!cert) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excel bulk upload
router.post("/upload-excel", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = data.map((row) => ({
      certificateId: row.certificateId,
      studentName: row.studentName,
      domain: row.domain,
      startDate: formatExcelDate(row.startDate),
      endDate: formatExcelDate(row.endDate),
      issuedBy: row.issuedBy || "Amdox",
      status: row.status || "Verified",
    }));

    const result = await Certificate.insertMany(formattedData, {
      ordered: false,
    });

    res.json({
      message: "Excel uploaded successfully",
      insertedCount: result.length,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single admin upload
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { studentName, domain, startDate, endDate, issuedBy } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const certificateId = "CERT" + Date.now();

    const newCert = new Certificate({
      certificateId,
      studentName,
      domain,
      startDate,
      endDate,
      issuedBy,
      status: "Verified",
      file: req.file.filename,
    });

    await newCert.save();

    res.json({
      message: "Uploaded successfully",
      certificateId,
      data: newCert,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;