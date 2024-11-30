const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');

// Az adatbazis.js importálása
const adatbazisRoutes = require('./adatbazis');

const app = express();
const port = 8020;

// Adatbázis kapcsolat beállítása
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'studb020',
  password: 'EX8-2024',
  database: 'db020'
});

// Kapcsolódás az adatbázishoz
connection.connect((err) => {
  if (err) {
    console.error('Nem sikerült kapcsolódni az adatbázishoz:', err.stack);
    process.exit(1);
  }
  console.log('Kapcsolódás az adatbázishoz sikeres.');
});

// Middleware a body-parserhez
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Statikus fájlok kiszolgálása
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Az index.html és kapcsolat oldalak kiszolgálása
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/kapcsolat', (req, res) => {
  res.sendFile(path.join(__dirname, 'kapcsolat.html'));
});

app.get('/oopjava', (req, res) => {
  res.sendFile(path.join(__dirname, 'oopjava.html'));
});

// Kapcsolat üzenet mentése az adatbázisba
app.post('/kapcsolat', (req, res) => {
  const { nev, email, uzenet } = req.body;

  const sql = `INSERT INTO kapcsolat (nev, email, uzenet) VALUES (?, ?, ?)`;
  connection.query(sql, [nev, email, uzenet], (err) => {
    if (err) {
      console.error('Hiba történt az üzenet mentésekor:', err);
      res.status(500).send('Hiba történt az üzenet mentésekor.');
      return;
    }

    res.send('Köszönjük az üzenetet! Hamarosan válaszolunk.');
  });
});

// Az üzenetek oldalt kiszolgáló végpont
app.get('/uzenetek', (req, res) => {
  res.sendFile(path.join(__dirname, 'uzenetek.html'));
});

// Az üzenetek adatokat kiszolgáló végpont
app.get('/uzenetek-data', (req, res) => {
  const sql = `SELECT nev, email, uzenet, kuldes_ido FROM kapcsolat ORDER BY kuldes_ido DESC`;
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Hiba történt az üzenetek lekérdezésekor:', error);
      res.status(500).send('Hiba történt az üzenetek lekérdezésekor.');
      return;
    }

    res.json(results);
  });
});

// Az adatbazis.js útvonalainak hozzáadása
app.use('/adatbazis', adatbazisRoutes);

// Szerver indítása
app.listen(port, () => {
  console.log(`A szerver fut a http://localhost:${port} címen`);
});
