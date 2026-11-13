const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// SQLite database
const db = new sqlite3.Database('./freaky-fashion.db', (err) => {
  if (err) {
    console.error('Fel vid anslutning till databasen:', err.message);
  } else {
    console.log('Ansluten till SQLite-databasen.');
  }
});

// Skapa tabellen och lägg till startprodukter
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT,
      sku TEXT,
      price REAL NOT NULL,
      imageUrl TEXT,
      brand TEXT
    )
  `);

  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) {
      console.error('Fel vid kontroll av produkter:', err.message);
      return;
    }

    if (row.count === 0) {
      const sql = `
        INSERT INTO products
        (title, slug, description, sku, price, imageUrl, brand)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const products = [
        [
          'Gul sommarklänning',
          'gul-sommarklanning',
          'En lätt och bekväm klänning för sommaren.',
          'FF001',
          499,
          '/images/dress.jpg',
          'Vila'
        ],
        [
          'Läderjacka',
          'laderjacka',
          'En klassisk svart läderjacka.',
          'FF002',
          1200,
          '/images/jacket.jpg',
          'Selected'
        ],
        [
          'Svart T-shirt',
          'svart-tshirt',
          'En klassisk svart t-shirt.',
          'FF003',
          299,
          '/images/black-tshirt.jpg',
          'Levis'
        ],
        [
          'Vit skjorta',
          'vit-skjorta',
          'En stilren vit skjorta.',
          'FF004',
          399,
          '/images/white-shirt.jpg',
          'Selected'
        ],
        [
          'Blå jeans',
          'bla-jeans',
          'Klassiska blå jeans med bekväm passform.',
          'FF005',
          699,
          '/images/blue-jeans.jpg',
          'Levis'
        ],
        [
          'Grön hoodie',
          'gron-hoodie',
          'En mjuk och bekväm hoodie.',
          'FF006',
          599,
          '/images/green-hoodie.jpg',
          'Nike'
        ],
        [
          'Svart kjol',
          'svart-kjol',
          'En enkel svart kjol för vardag och fest.',
          'FF007',
          449,
          '/images/black-skirt.jpg',
          'Vila'
        ],
        [
          'Beige kappa',
          'beige-kappa',
          'En klassisk beige kappa.',
          'FF008',
          999,
          '/images/beige-coat.jpg',
          'Only'
        ]
      ];

      products.forEach((product) => {
        db.run(sql, product);
      });
    }
  });
});

// Hämta alla produkter
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: 'Kunde inte hämta produkter.'
      });
    }

    res.json(rows);
  });
});

// Hämta en produkt med slug
app.get('/api/products/:slug', (req, res) => {
  const slug = req.params.slug;

  db.get(
    'SELECT * FROM products WHERE slug = ?',
    [slug],
    (err, product) => {
      if (err) {
        return res.status(500).json({
          message: 'Ett databasfel uppstod.'
        });
      }

      if (!product) {
        return res.status(404).json({
          message: 'Produkten hittades inte.'
        });
      }

      res.json(product);
    }
  );
});

// Lägg till en ny produkt
app.post('/api/products', (req, res) => {
  const {
    title,
    description,
    sku,
    price,
    imageUrl,
    brand
  } = req.body;

  if (!title || !sku || price === null || price === undefined) {
    return res.status(400).json({
      message: 'Namn, SKU och pris måste anges.'
    });
  }

  const slug = title
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const sql = `
    INSERT INTO products
    (title, slug, description, sku, price, imageUrl, brand)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [title, slug, description, sku, price, imageUrl, brand],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: 'Produkten kunde inte sparas.'
        });
      }

      res.status(201).json({
        id: this.lastID,
        title,
        slug,
        description,
        sku,
        price,
        imageUrl,
        brand
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});