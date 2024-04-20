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

app.get('/students', (req, res) => {
    const sql = "SELECT * FROM student"; // Assuming 'students' is the table name containing student information
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching students:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.json(data);
    });
});

app.post('/students', (req, res) => {
    const { first_name, last_name, email, phone_number} = req.body;
    const role = 'student'; // Assuming the role is hardcoded as 'student'
    const password = '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i'; // You may want to generate a random password or use a default one
    const userSql = "INSERT INTO user (first_name, last_name, email, role, password) VALUES (?, ?, ?, ?, ?)";
    const studentSql = "INSERT INTO student (first_name, last_name, email, phone_number,user_id) VALUES (?, ?, ?, ?, ?)";
    db.query(userSql, [first_name, last_name, email, role, password], (err, result) => {
        console.log(result)
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        const user_id = result.insertId; // Get the auto-generated user_id
        db.query(studentSql, [first_name, last_name, email, phone_number,user_id], (err, result) => {
            if (err) {
                console.error("Error adding student:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            return res.status(201).json({ message: "Student added successfully" });
        });
    });
});

// Delete a student by user_id using app.post()
app.post('/students/delete', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Delete student from student table
    const deleteStudentSQL = "DELETE FROM student WHERE user_id = ?";
    db.query(deleteStudentSQL, [userId], (err, studentResult) => {
        if (err) {
            console.error("Error deleting student:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (studentResult.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        // If student is deleted successfully from student table, delete corresponding user from user table
        const deleteUserSQL = "DELETE FROM user WHERE user_id = ?";
        db.query(deleteUserSQL, [userId], (err, userResult) => {
            if (err) {
                console.error("Error deleting user:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            if (userResult.affectedRows === 0) {
                // This should ideally not happen if the student is associated with a user, but handle it just in case
                console.error("User associated with student not found");
            }
            // Both student and user are deleted successfully
            return res.json({ message: "Student and associated user deleted successfully" });
        });
    });
});

// Update a student and corresponding user by user_id
app.post('/students/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    const updatedStudentData = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Update student data
    const updateStudentSql = "UPDATE student SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE user_id = ?";
    db.query(updateStudentSql, [updatedStudentData.first_name, updatedStudentData.last_name, updatedStudentData.email, updatedStudentData.phone_number, userId], (err, studentResult) => {
        if (err) {
            console.error("Error updating student:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (studentResult.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Update user data
        const updateUserSql = "UPDATE user SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?";
        db.query(updateUserSql, [updatedStudentData.first_name, updatedStudentData.last_name, updatedStudentData.email, userId], (err, userResult) => {
            if (err) {
                console.error("Error updating user:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (userResult.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json({ message: "Student and user updated successfully" });
        });
    });
});


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
                req.email = decoded.email; // Access email from decoded token
                const sql = "SELECT user_id, role FROM user WHERE email = ?";
                db.query(sql, [req.email], (err, result) => {
                    if (err) {
                        console.error("Database error:", err); // Log database error
                        return res.json({ Error: "Error fetching user's data" });
                    }
                    if (!result || result.length === 0) {
                        return res.json({ Error: "User not found" });
                    }
                    req.user_id = result[0].user_id;
                    req.role = result[0].role;
                    next();
                });
            }
        });
    }
};

app.get('/auth', verifyUser, (req, res) => {
    return res.json({
         Status: "Success", 
         name: req.name,
         role: req.role, // Include the user's role in the response
         user_id: req.user_id
        });
})

app.post('/signup', (req, res) => {
    const userSql = "INSERT INTO user (`first_name`,`last_name`,`email`,`role`,`password`) VALUES (?)";
    const studentSql = "INSERT INTO student (`first_name`,`last_name`,`email`, `user_id`) VALUES (?)";
    const getUserIdSql = "SELECT user_id FROM user WHERE email = ?";

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({error: "Error for hashing password."})
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.role,
            hash
        ]
        db.query(userSql, [values], (err, result) => {
            if (err) {
                console.error("Error inserting user data:", err);
                return res.json({Error: "Inserting user data error in server"});
            }
            // Fetch user_id of the inserted user
            db.query(getUserIdSql, [req.body.email], (err, getUserIdResult) => {
                if (err || getUserIdResult.length === 0) {
                    console.error("Error fetching user_id:", err);
                    return res.json({Error: "Error fetching user_id"});
                }
                const user_id = getUserIdResult[0].user_id;
                // Insert into student table
                const studentValues = [
                    req.body.first_name,
                    req.body.last_name,
                    req.body.email,
                    user_id,
                ];
                db.query(studentSql, [studentValues], (err, studentResult) => {
                    if (err) {
                        console.error("Error inserting student data:", err);
                        return res.json({Error: "Inserting student data error in server"});
                    }
                    return res.json ({Status: "Success"});
                });
            });
        });
    });
});


app.post('/login', (req, res) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ error: "Login error in server" })
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.json({ Error: "Password compare error" });
                if (response) {
                    const name = data[0].first_name + " " + data[0].last_name;
                    const email = req.body.email; // Extract email from request
                    // const role = data[0].role;
                    // console.log(name)
                    const token = jwt.sign({ name, email}, "jwt-secret-key", { expiresIn: '1d' });
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

app.get('/profile', verifyUser, (req, res) => {
    const userEmail = req.email; // Extract email from req object
    const userRole = req.role; // Extract user's role from req object
    
    let sql;
    switch (userRole) {
        case 'admin':
            sql = "SELECT * FROM admin WHERE email = ?";
            break;
        case 'student':
            sql = "SELECT * FROM student WHERE email = ?";
            break;
        case 'teacher':
            sql = "SELECT * FROM teacher WHERE email = ?";
            break;
        default:
            return res.status(400).json({ Error: "Invalid user role" });
    }
    
    db.query(sql,  [userEmail], (err, result) => {
        if (err) {
            console.error("Error fetching profile data:", err);
            return res.status(500).json({ Error: "Internal server error" });
        }
        if (!result || result.length === 0) {
            return res.status(404).json({ Error: "Profile not found" });
        }
        const profileData = result[0];
        return res.json(profileData);
    });
});

// Update profile route
app.post('/profile', verifyUser, (req, res) => {
    const user_id = req.user_id;

    const { first_name, last_name, phone_number, email, bio } = req.body;

    const sql = "UPDATE student SET first_name = ?, last_name = ?, phone_number = ?, email = ?, bio = ? WHERE user_id = ?";
    db.query(sql, [first_name, last_name, phone_number, email, bio, user_id], (err, result) => {
        if (err) {
            console.error("Error updating profile data:", err);
            return res.status(500).json({ Error: "Internal server error" });
        }
        return res.json({ Status: "Success" });
    });
});

// Route to handle changing password
app.post('/change-password', verifyUser, (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userEmail = req.email; // Extract email from verified user
    console.log(userEmail)

    // Fetch user data from database (this step is redundant since user is already verified)
    const sql = 'SELECT * FROM user WHERE email = ?';
    db.query(sql, [userEmail], (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        // Hash the entered old password for comparison
        bcrypt.hash(oldPassword,salt, (err, hashedOldPassword) => {
            if (err) {
                console.error('Error hashing old password:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Compare the hashed old password with the hashed password stored in the database
            bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
            
                if (!isMatch) {
                    return res.status(400).json({ error: 'Incorrect old password' });
                }
            
                // Hash the new password
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) {
                        console.error('Error hashing new password:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    console.log(newPassword)
                    // Update user's password in the database
                    const updateSql = 'UPDATE user SET password = ? WHERE email = ?';
                    db.query(updateSql, [hash, userEmail], (err, result) => {
                        if (err) {
                            console.error('Error updating password:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        return res.status(200).json({ message: 'Password updated successfully' });
                    });  
                });
            });
        });
    });
});

app.listen(5000, () => {
    console.log("listening");
})