import express, { response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

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

app.get('/pricing', (req,res) => {
    const sql = "SELECT * FROM pricing";
    db.query(sql,(err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/dashboard', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name });
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO user (`first_name`,`last_name`,`email`,`password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({error: "Error for hashing password."})
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result) => {
            if (err) return res.json({Eroor: "Inserting data error in server"});
            return res.json ({Status: "Success"});
        })
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM student WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ error: "Login error in server" })
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const name = data[0].first_name + data[0].last_name;
                    const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token, { sameSite: 'None', secure: true }); // Set SameSite attribute
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            })

        } else {
            return res.json({ Error: "No email existed" });
        }
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})


app.listen(5000, () => {
    console.log("listening");
})