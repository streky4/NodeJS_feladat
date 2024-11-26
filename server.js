const http = require('http');
const mysql = require('mysql');

// MySQL kapcsolat beállítása
const connection = mysql.createConnection({
    host: 'localhost',       
    user: '',        
    password: '',      
    database: 'hangosfilmek' 
});

// Szerver indítása
const server = http.createServer((req, res) => {
    // Lekérdezés
    connection.query(
        'SELECT film.cim, film.gyartas, szemely.nev FROM film INNER JOIN feladat ON film.id = feladat.filmid INNER JOIN szemely ON szemely.id = feladat.szemelyid',
        (err, results, fields) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Hiba történt az adatbázis lekérdezés során!');
                console.error(err);
                return;
            }

            // HTML válasz készítése
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write('<h1>Adatbázis adatok</h1><table border="1"><tr><th>Cím</th><th>Gyártási év</th><th>Személy neve</th></tr>');

            // Adatok hozzáadása a táblázathoz
            results.forEach(row => {
                res.write(`<tr><td>${row.cim}</td><td>${row.gyartas}</td><td>${row.nev}</td></tr>`);
            });

            res.write('</table>');
            res.end();
        }
    );
}).listen(8001, () => {
    console.log('Szerver fut a http://localhost:8001 címen.');
});

// Kapcsolódás ellenőrzése
connection.connect(err => {
    if (err) {
        console.error('Nem sikerült kapcsolódni az adatbázishoz:', err);
        return;
    }
    console.log('Kapcsolódás az adatbázishoz sikeres.');
});
