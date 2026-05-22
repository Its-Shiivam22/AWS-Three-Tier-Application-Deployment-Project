const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MySQL RDS connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Connect DB
db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("Connected to RDS MySQL");
  }
});

// Create table (run once)
const createTable = `
CREATE TABLE IF NOT EXISTS volunteers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  contact VARCHAR(20),
  district VARCHAR(50)
)
`;

db.query(createTable);

// Register volunteer
app.post("/register", (req, res) => {
  const { name, email, contact, district } = req.body;

  const sql =
    "INSERT INTO volunteers (name, email, contact, district) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, contact, district], (err) => {
    if (err) return res.status(500).send("Error inserting data");
    res.send("Volunteer registered successfully");
  });
});

// Get volunteers
app.get("/volunteers", (req, res) => {
  const district = req.query.district;

  db.query(
    "SELECT * FROM volunteers WHERE district = ?",
    [district],
    (err, results) => {
      if (err) return res.status(500).send("Error fetching data");
      res.json(results);
    }
  );
});

// ---------------- DELETE VOLUNTEER (NEW API) ----------------
app.delete("/volunteers", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email required");
  }

  const sql = "DELETE FROM volunteers WHERE email = ?";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("DB Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Volunteer not found");
    }

    res.send("Volunteer Deleted Successfully");
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});