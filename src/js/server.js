const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const fs = require('fs'); // ייבוא מודול fs

const app = express();
const port = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: 'Eitan',
  user: 'Eitan',
  password: 'Eitan3187',
  database: 'mystore'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// ייצוא החיבור למסד הנתונים
module.exports = connection;

// הגדרת הנתיב של קובץ ה-JSON
const filePath = path.join(__dirname, '../json/products.json');  // הנחה שהתיקיות נמצאות באותה רמה

// קריאת קובץ JSON וטעינת נתונים למסד הנתונים
fs.readFile(filePath, 'utf8', async (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }

  const products = JSON.parse(data);

  for (const product of products) {
    try {
      // בדיקה אם המוצר כבר קיים
      const checkQuery = `SELECT * FROM products WHERE name = ?`;
      const [rows] = await connection.promise().execute(checkQuery, [product.name]);

      if (rows.length > 0) {
        const updateQuery = `
          UPDATE products
          SET price = ?, description = ?, category = ?, volume = ?, shelfLife = ?, storage = ?, image = ?
          WHERE name = ?;
        `;
        await connection.promise().execute(updateQuery, [
          product.price || null,
          product.description || null,
          product.category || null,
          product.volume || null,
          product.shelfLife || null,
          product.storage || null,
          product.image || null,
          product.name
        ]);
        console.log(`Product "${product.name}" updated.`);
      } else {
        const insertQuery = `
          INSERT INTO products (name, price, description, category, volume, shelfLife, storage, image)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await connection.promise().execute(insertQuery, [
          product.name || null,
          product.price || null,
          product.description || null,
          product.category || null,
          product.volume || null,
          product.shelfLife || null,
          product.storage || null,
          product.image || null
        ]);
        console.log(`Product "${product.name}" inserted.`);
      }
    } catch (err) {
      console.error(`Error inserting or updating product "${product.name}":`, err);
    }
  }

  connection.end();
});

// מחיקת הטבלה הקיימת
connection.query('DROP TABLE IF EXISTS users', (err, result) => {
    if (err) throw err;
    console.log('Table users deleted');

    // יצירת טבלה חדשה
    const createTableQuery = `
        CREATE TABLE users (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            address VARCHAR(255),
            maps VARCHAR(255),
            phone VARCHAR(255),
            city VARCHAR(255),
            note TEXT,
            position INT,
            cart JSON,
            purchases JSON,
            password VARCHAR(255),
            email VARCHAR(255),
            join_date DATE,
            code VARCHAR(255)
        )
    `;
    connection.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Table users created');

        // קריאת קובץ ה-JSON
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../json/users.json'), 'utf8'));

        // רשימת הערים
        const cities = ['lehavim', 'omer', 'meitar'];

        // מעבר על כל רשימה לפי עיר
        cities.forEach(city => {
            if (Array.isArray(usersData[city])) {
                // הוספת כל משתמש לטבלה
                usersData[city].forEach(user => {
                    // המרת השדות cart ו-purchases למחרוזות JSON
                    user.cart = JSON.stringify(user.cart);
                    user.purchases = JSON.stringify(user.purchases);

                    const query = 'INSERT INTO users SET ?';
                    connection.query(query, user, (err, result) => {
                        if (err) throw err;
                        console.log(`User ${user.name} from ${city} added`);
                    });
                });
            } else {
                console.error(`Error: data for ${city} is not an array`);
            }
        });

        // סגירת החיבור
        connection.end();
    });
});

app.use(express.static(path.join(__dirname, '../../src')));

app.use((req, res, next) => {
    console.log('Requested URL:', req.originalUrl);
    next();
});

// קריאה ל-index.html
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..',"..", 'index.html'));  // שולח את עמוד הניהול
});

// קריאה ל-index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"..", '..', 'index.html'));  // שולח את עמוד הבית
});

// קריאה ל-cart.html
app.get('/cart.html', (req, res) => {
  res.sendFile(path.join(__dirname,"..", '..', 'cart.html'));  // שולח את עמוד הקניות
});

// קריאה ל-admin.html
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..',"..", 'admin.html'));  // שולח את עמוד הניהול
});

// קריאה להוציא את המוצרים ממסד הנתונים
app.get('/products', async (req, res) => {
  try {
    const query = 'SELECT * FROM products';
    const [rows] = await connection.promise().execute(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error fetching products');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
