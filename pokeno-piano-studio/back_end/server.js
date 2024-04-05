const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000; // Port number for your server

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zxcqw098',
    database: 'PPS_db'
  });

// Middleware to intercept favicon requests and return 204 status code
app.get('/favicon.ico', (req, res) => res.status(204));

// Define a route
app.get('/api/hello', (req, res) => {
  res.send({ message: 'Hello from Express!' });
});

app.get('/', (req, res) => {
    res.send('Welcome to my Express backend!');
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
