const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("DB Error:", err));

const certificateRoutes = require("./routes/certificateRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/certificates", certificateRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server + DB working 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});