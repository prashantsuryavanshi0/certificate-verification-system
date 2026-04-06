const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, "secretkey");

    return res.json({
      message: "Login successful",
      token
    });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;