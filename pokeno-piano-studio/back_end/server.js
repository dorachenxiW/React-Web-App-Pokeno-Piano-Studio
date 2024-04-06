const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'PPS_db'
})

app.get('/', (re,res) => {
    return res.json("Hello from Backend!");
})

app.get('/users', (req,res) => {
    const sql = "SELECT * FROM user";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/pricing', (req,res) =>{
    const sql = "SELECT * FROM pricing";
    db.query(sql,(err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(5000, () => {
    console.log("listening");
})