const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
const OpenAI = require("openai");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vestra",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JWT_SECRET = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/products", async (req, res) => {
  try {
    const { category, sort } = req.query;

    let query = "SELECT * FROM products WHERE category = $1";
    let values = [category];

    if (sort === "price-asc") query += " ORDER BY price ASC";
    else if (sort === "price-desc") query += " ORDER BY price DESC";
    else if (sort === "rating-desc") query += " ORDER BY rating DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch {
    res.status(500).send("Database error");
  }
});

app.post("/ai-search", async (req, res) => {
  try {
    const { query } = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Return one word: men, women, kids, footwear, beauty." },
        { role: "user", content: query }
      ]
    });

    const category = response.choices[0].message.content.trim().toLowerCase();
    res.json({ category });

  } catch {
    const q = req.body.query.toLowerCase();
    let category = "men";

    if (q.includes("shoe")) category = "footwear";
    else if (q.includes("lip")) category = "beauty";
    else if (q.includes("kid")) category = "kids";
    else if (q.includes("women")) category = "women";

    res.json({ category });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
      [name, email, hashed]
    );

    res.json({ message: "Signup successful" });

  } catch (err) {
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).send("Signup error");
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch {
    res.status(500).send("Login error");
  }
});

app.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch {
    res.status(500).send("User fetch error");
  }
});



app.get("/profile", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT name, email, age, phone, address FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch {
    res.status(500).send("Profile fetch error");
  }
});

app.post("/profile", authenticate, async (req, res) => {
  try {
    const { age, phone, address } = req.body;

    await pool.query(
      "UPDATE users SET age=$1, phone=$2, address=$3 WHERE id=$4",
      [age, phone, address, req.user.id]
    );

    res.json({ message: "Profile updated" });

  } catch {
    res.status(500).send("Profile update error");
  }
});



app.get("/wishlist", async (req, res) => {
  const result = await pool.query(`
    SELECT products.*
    FROM wishlist
    JOIN products ON wishlist.product_id = products.id
  `);
  res.json(result.rows);
});

app.post("/wishlist", async (req, res) => {
  const { product_id } = req.body;

  await pool.query(
    "INSERT INTO wishlist (product_id) VALUES ($1) ON CONFLICT DO NOTHING",
    [product_id]
  );

  res.json({ message: "Wishlist updated" });
});

app.delete("/wishlist/:id", async (req, res) => {
  await pool.query(
    "DELETE FROM wishlist WHERE product_id=$1",
    [req.params.id]
  );
  res.json({ message: "Removed" });
});

app.get("/bag", async (req, res) => {
  const result = await pool.query(`
    SELECT products.*, bag.quantity
    FROM bag
    JOIN products ON bag.product_id = products.id
  `);
  res.json(result.rows);
});

app.post("/bag", async (req, res) => {
  const { product_id } = req.body;

  await pool.query(`
    INSERT INTO bag (product_id, quantity)
    VALUES ($1,1)
    ON CONFLICT (product_id)
    DO UPDATE SET quantity = bag.quantity + 1
  `, [product_id]);

  res.json({ message: "Bag updated" });
});

app.put("/bag/:id", async (req, res) => {
  const { quantity } = req.body;

  await pool.query(
    "UPDATE bag SET quantity=$1 WHERE product_id=$2",
    [quantity, req.params.id]
  );

  res.json({ message: "Updated" });
});

app.delete("/bag/:id", async (req, res) => {
  await pool.query(
    "DELETE FROM bag WHERE product_id=$1",
    [req.params.id]
  );
  res.json({ message: "Deleted" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});