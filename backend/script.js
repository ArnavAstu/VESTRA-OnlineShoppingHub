const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vestra",
  password: "30december",
  port: 5432,
});

app.get("/men-products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE category = 'men'"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get("/kids-products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE category = 'kids'"
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.get("/footwear-products", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE category = 'footwear'"
  );
  res.json(result.rows);
});

app.get("/beauty-products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE category = 'beauty'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.get("/women-products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE category = 'women'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});