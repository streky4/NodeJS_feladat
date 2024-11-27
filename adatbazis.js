const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8020;

// Adatbázis kapcsolat beállítása
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'studb020',          
  password: 'EX8-2024',  
  database: 'hangosfilmek'  
});

// Kapcsolódás az adatbázishoz
connection.connect((err) => {
  if (err) {
    console.error('Nem sikerült kapcsolódni az adatbázishoz:', err.stack);
    process.exit(1);
  }
  console.log('Kapcsolódás az adatbázishoz sikeres.');
});

// Adatok lekérdezése és megjelenítése HTML-ben
app.get('/', (req, res) => {
  const sql = `
    SELECT 
      film.cim AS FilmCim,
      film.gyartas AS GyartasiEv,
      szemely.nev AS SzemelyNev,
      feladat.feladat AS Feladat
    FROM film
    INNER JOIN feladat ON film.id = feladat.filmid
    INNER JOIN szemely ON feladat.szemelyid = szemely.id
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Hiba történt a lekérdezés során:', error);
      res.status(500).send('Hiba történt az adatok lekérdezésekor.');
      return;
    }

    // HTML válasz generálása
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Adatbázis adatok</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          h1 {
            color: #444;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          table, th, td {
            border: 1px solid #ccc;
          }
          th, td {
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
        </style>
      </head>
      <body>
        <h1>Adatbázisból lekérdezett adatok</h1>
        <table>
          <thead>
            <tr>
              <th>Film címe</th>
              <th>Gyártási év</th>
              <th>Személy neve</th>
              <th>Feladat megnevezése</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Adatok hozzáadása a táblázathoz
    results.forEach(row => {
      html += `
        <tr>
          <td>${row.FilmCim}</td>
          <td>${row.GyartasiEv}</td>
          <td>${row.SzemelyNev}</td>
          <td>${row.Feladat}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    res.send(html);
  });
});

// Szerver indítása
app.listen(port, () => {
  console.log(`Szerver fut a http://localhost:${port} címen`);
});
