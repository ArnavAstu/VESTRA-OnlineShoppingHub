const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../"))); 

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vestra",
  password: "30december",
  port: 5432,
});


app.get("/products", async (req, res) => {
  try {

    const { category, sort } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    let query = "SELECT * FROM products WHERE category = $1";
    let values = [category];

    if (sort === "price-asc") {
      query += " ORDER BY price ASC";
    } 
    else if (sort === "price-desc") {
      query += " ORDER BY price DESC";
    } 
    else if (sort === "rating-desc") {
      query += " ORDER BY rating DESC";
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {
    console.error("PRODUCT ROUTE ERROR:", err);
    res.status(500).send("Database error");
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});