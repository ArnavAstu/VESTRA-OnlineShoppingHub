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
    } else if (sort === "price-desc") {
      query += " ORDER BY price DESC";
    } else if (sort === "rating-desc") {
      query += " ORDER BY rating DESC";
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Database error");
  }
});

app.get("/wishlist", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT products.*
      FROM wishlist
      JOIN products ON wishlist.product_id = products.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Wishlist fetch error");
  }
});

app.post("/wishlist", async (req, res) => {
  try {
    const { product_id } = req.body;

    await pool.query(
      "INSERT INTO wishlist (product_id) VALUES ($1) ON CONFLICT (product_id) DO NOTHING",
      [product_id]
    );

    res.json({ message: "Wishlist updated" });
  } catch (err) {
    res.status(500).send("Wishlist insert error");
  }
});

app.delete("/wishlist/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM wishlist WHERE product_id = $1",
      [req.params.id]
    );
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).send("Wishlist delete error");
  }
});

app.get("/bag", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT products.*, bag.quantity
      FROM bag
      JOIN products ON bag.product_id = products.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Bag fetch error");
  }
});

app.post("/bag", async (req, res) => {
  try {
    const { product_id } = req.body;

    await pool.query(
      `
      INSERT INTO bag (product_id, quantity)
      VALUES ($1, 1)
      ON CONFLICT (product_id)
      DO UPDATE SET quantity = bag.quantity + 1
      `,
      [product_id]
    );

    res.json({ message: "Bag updated" });
  } catch (err) {
    res.status(500).send("Bag insert error");
  }
});

app.put("/bag/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    await pool.query(
      "UPDATE bag SET quantity = $1 WHERE product_id = $2",
      [quantity, req.params.id]
    );

    res.json({ message: "Quantity updated" });
  } catch (err) {
    res.status(500).send("Quantity update error");
  }
});

app.delete("/bag/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM bag WHERE product_id = $1",
      [req.params.id]
    );
    res.json({ message: "Removed from bag" });
  } catch (err) {
    res.status(500).send("Bag delete error");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});