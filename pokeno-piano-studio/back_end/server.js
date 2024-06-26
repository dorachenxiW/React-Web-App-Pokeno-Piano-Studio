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

/* const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'PPS_db'
}) */

const db = mysql.createPool({
    connectionLimit: 10, // Adjust this limit as per your requirements
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'PPS_db'
});


app.get('/', (re, res) => {
    return res.json("Hello from Backend!");
})

app.get('/users', (req, res) => {
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
    const { first_name, last_name, email, phone_number } = req.body;
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
        db.query(studentSql, [first_name, last_name, email, phone_number, user_id], (err, result) => {
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
    console.log(userId)
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

app.get('/pricing', (req, res) => {
    const sql = "SELECT * FROM pricing";
    db.query(sql, (err, data) => {
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
    //console.log(user_id)
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

    // Proceed with registration
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            req.body.role,
            hash
        ];
        db.query(userSql, [values], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Email already exists
                    return res.json({ Error: "Email already registered" });
                } else {
                    console.error("Error inserting user data:", err);
                    return res.json({ Error: "Inserting user data error in server" });
                }
            }
            // Fetch user_id of the inserted user
            db.query(getUserIdSql, [req.body.email], (err, getUserIdResult) => {
                if (err || getUserIdResult.length === 0) {
                    console.error("Error fetching user_id:", err);
                    return res.json({ Error: "Error fetching user_id" });
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
                        return res.json({ Error: "Inserting student data error in server" });
                    }
                    return res.json({ Status: "Success" });
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
                    const email = req.body.email;
                    const user_id = data[0].user_id;
                    // const role = data[0].role;
                    console.log(user_id)
                    const token = jwt.sign({ name, email }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token, { sameSite: 'None', secure: true }); // Set SameSite attribute
                    return res.json({
                        Status: "Success", user_id
                    });
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
    return res.json({ Status: "Success" });
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

    db.query(sql, [userEmail], (err, result) => {
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

app.get('/teachers', (req, res) => {
    const sql = "SELECT * FROM teacher";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error fetching teachers:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.json(data);
    });
});

app.post('/teachers', (req, res) => {
    const { first_name, last_name, email, phone_number } = req.body;
    const role = 'teacher'; // Assuming the role is hardcoded as 'student'
    const password = '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i'; // You may want to generate a random password or use a default one
    const userSql = "INSERT INTO user (first_name, last_name, email, role, password) VALUES (?, ?, ?, ?, ?)";
    const teacherSql = "INSERT INTO teacher (first_name, last_name, email, phone_number,user_id) VALUES (?, ?, ?, ?, ?)";
    db.query(userSql, [first_name, last_name, email, role, password], (err, result) => {
        //console.log(result)
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        const user_id = result.insertId; // Get the auto-generated user_id
        db.query(teacherSql, [first_name, last_name, email, phone_number, user_id], (err, result) => {
            if (err) {
                console.error("Error adding teacher:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            return res.status(201).json({ message: "Teacher added successfully" });
        });
    });
});
// Update a teacher and corresponding user by user_id
app.post('/teachers/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    const updatedTeacherData = req.body;
    //console.log(userId)
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Update teacher data
    const updateTeacherSql = "UPDATE teacher SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE user_id = ?";
    db.query(updateTeacherSql, [updatedTeacherData.first_name, updatedTeacherData.last_name, updatedTeacherData.email, updatedTeacherData.phone_number, userId], (err, teacherResult) => {
        if (err) {
            console.error("Error updating teacher:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (teacherResult.affectedRows === 0) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        // Update user data
        const updateUserSql = "UPDATE user SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?";
        db.query(updateUserSql, [updatedTeacherData.first_name, updatedTeacherData.last_name, updatedTeacherData.email, userId], (err, userResult) => {
            if (err) {
                console.error("Error updating user:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (userResult.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.json({ message: "Teacher and user updated successfully" });
        });
    });
});

// Delete a teacher by user_id using app.post()
app.post('/teachers/delete', (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    // Delete teacher from teacher table
    const deleteTeacherSQL = "DELETE FROM teacher WHERE user_id = ?";
    db.query(deleteTeacherSQL, [userId], (err, teacherResult) => {
        if (err) {
            console.error("Error deleting teacher:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (teacherResult.affectedRows === 0) {
            return res.status(404).json({ error: "Teacher not found" });
        }

        // If teacher is deleted successfully from teacher table, delete corresponding user from user table
        const deleteUserSQL = "DELETE FROM user WHERE user_id = ?";
        db.query(deleteUserSQL, [userId], (err, userResult) => {
            if (err) {
                console.error("Error deleting user:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            if (userResult.affectedRows === 0) {
                // This should ideally not happen if the teacher is associated with a user, but handle it just in case
                console.error("User associated with teacher not found");
            }
            // Both teacher and user are deleted successfully
            return res.json({ message: "Teacher and associated user deleted successfully" });
        });
    });
});

app.get('/bookings', (req, res) => {
    let sql = `
        SELECT 
            booking.*, 
            student.first_name AS student_first_name, 
            student.last_name AS student_last_name, 
            teacher.first_name AS teacher_first_name, 
            teacher.last_name AS teacher_last_name
        FROM 
            booking 
            INNER JOIN student ON booking.student_id = student.student_id
            INNER JOIN teacher ON booking.teacher_id = teacher.teacher_id
    `;
    const { teacher_id, student_id } = req.query;

    if (teacher_id) {
        sql += ` WHERE booking.teacher_id = ? ORDER BY booking.booking_date ASC`;
        db.query(sql, [teacher_id], (err, data) => {
            //console.log("goingin");
            if (err) {
                console.error("Error fetching bookings:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            //console.log(data);
            return res.json(data);
        });
    } else if (student_id) {
        sql += ` WHERE booking.student_id = ?`;
        db.query(sql, [student_id], (err, data) => {
            //console.log("goingin");
            if (err) {
                console.error("Error fetching bookings:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            //console.log(data);
            return res.json(data);
        });
    } else {
        // Process the SQL query without a WHERE clause
        db.query(sql, (err, data) => {
            if (err) {
                console.error("Error fetching bookings:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            return res.json(data);
        });
    }
});

// Endpoint to fetch teacher ID based on user ID
app.get('/teacher/:user_id', (req, res) => {
    const { user_id } = req.params;
    // Assuming you have a query to fetch the teacher ID associated with the given user ID from your database
    // Replace `YOUR_QUERY_TO_FETCH_TEACHER_ID` with the actual query to fetch teacher ID from the database
    db.query('SELECT teacher_id From teacher WHERE user_id =?', [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching teacher ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Assuming your query returns a single row with the teacher ID
            const teacher_id = results[0].teacher_id;
            res.json({ teacher_id });
        }
    });
});

// Endpoint to fetch student ID based on user ID
app.get('/student/:user_id', (req, res) => {
    const { user_id } = req.params;
    // Assuming you have a query to fetch the student ID associated with the given user ID from your database

    db.query('SELECT student_id From student WHERE user_id =?', [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching student ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Assuming your query returns a single row with the teacher ID
            const student_id = results[0].student_id;
            res.json({ student_id });
        }
    });
});

// Endpoint to fetch teacher availability based on user ID
app.get('/teacher_availability/:user_id', (req, res) => {
    const { user_id } = req.params;

    // Fetch teacher ID based on user ID
    db.query('SELECT teacher_id FROM teacher WHERE user_id = ?', [user_id], (error, results) => {
        if (error) {
            console.error('Error fetching teacher ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Assuming the query returns a single row with the teacher ID
            const teacher_id = results[0].teacher_id;

            // Fetch teacher availability based on teacher ID
            db.query('SELECT * FROM teacher_availability WHERE teacher_id = ?', [teacher_id], (error, results) => {
                if (error) {
                    console.error('Error fetching teacher availability:', error);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json(results); // Return the teacher availability
                }
            });
        }
    });
});

app.get('/teacher_availability', (req, res) => {
    const { teacher_id } = req.query;
    db.query('SELECT * FROM teacher_availability WHERE teacher_id = ?', [teacher_id], (error, results) => {
        if (error) {
            console.error('Error fetching teacher availability:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results); // Return the teacher availability
        }
    });
});


app.post('/delete_availability/:eventId', (req, res) => {
    const eventId = req.params.eventId;

    // SQL query to delete the event from the database
    const deleteEventSQL = "DELETE FROM teacher_availability WHERE id = ?";
    db.query(deleteEventSQL, [eventId], (error, result) => {
        if (error) {
            console.error("Error deleting event:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Event not found" });
        }
        // Event deleted successfully
        return res.json({ message: "Event deleted successfully" });
    });
});

// Endpoint to add availability
app.post('/add_availability', (req, res) => {
    const { teacher_id, dayOfWeek, startTime, duration } = req.body;

    const addAvailabilitySQL = "INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, duration) VALUES (?, ?, ?, ?, ?)";

    // Parse the start time and calculate end time based on duration
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDateTime = new Date();
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(startDateTime.getTime() + duration * 60000); // Convert duration to milliseconds

    // Execute the SQL query to add availability
    db.query(addAvailabilitySQL, [teacher_id, dayOfWeek, startDateTime, endDateTime, duration], (error, result) => {
        if (error) {
            console.error("Error adding availability:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        // Check if the availability was added successfully
        if (result.affectedRows === 1) {
            return res.status(201).json({ message: "Availability added successfully" });
        } else {
            return res.status(500).json({ error: "Failed to add availability" });
        }
    });
});

app.post('/completeBooking', async (req, res) => {
    const { totalPrice, bookingDataArray, teacher_availability_id } = req.body;

    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            }

            // Begin transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    connection.release();
                    console.error('Error beginning transaction:', err);
                    return res.status(500).json({ success: false, error: 'Internal server error' });
                }

                try {
                    // Insert payment record
                    const paymentInsertResult = await new Promise((resolve, reject) => {
                        connection.query(
                            'INSERT INTO payment(amount, payment_date) VALUES (?, ?)',
                            [totalPrice, new Date()],
                            (error, paymentResult) => {
                                if (error) {
                                    console.error('Error inserting payment:', error);
                                    reject(error);
                                } else {
                                    resolve(paymentResult);
                                }
                            }
                        );
                    });

                    const paymentId = paymentInsertResult.insertId;
                    //console.log('Payment ID:', paymentId);

                    for (let booking of bookingDataArray) {
                        //console.log(booking)
                        // Insert booking record
                        const bookingInsertResult = await new Promise((resolve, reject) => {
                            connection.query(
                                'INSERT INTO booking(student_id, teacher_id, lesson_type, booking_date, start_time, end_time) VALUES(?,?,?,?,?,?)',
                                [booking.student_id, booking.teacher_id, booking.lesson_type, booking.booking_date, booking.start_time, booking.end_time],
                                (error, bookingResult) => {
                                    if (error) {
                                        console.error('Error inserting booking:', error);
                                        reject(error);
                                    } else {
                                        resolve(bookingResult);
                                    }
                                }
                            );
                        });

                        const bookingID = bookingInsertResult.insertId;
                        //console.log(bookingID);

                        // Insert into booking_payment table
                        const bookingPaymentInsertResult = await new Promise((resolve, reject) => {
                            connection.query(
                                'INSERT INTO booking_payment(booking_id, payment_id) VALUES (?, ?)',
                                [bookingID, paymentId],
                                (error, bookingPaymentResult) => {
                                    if (error) {
                                        console.error('Error inserting booking payment:', error);
                                        reject(error);
                                    } else {
                                        resolve(bookingPaymentResult);
                                    }
                                }
                            );
                        });

                        //console.log('Booking payment record inserted:', bookingPaymentInsertResult);
                    }

                    // Update teacher_availability to mark as booked
                    const updateAvailabilityQuery = 'UPDATE teacher_availability SET is_booked = TRUE WHERE id = ?';
                    connection.query(updateAvailabilityQuery, [teacher_availability_id], (error, updateResult) => {
                        if (error) {
                            console.error('Error updating teacher availability:', error);
                            connection.rollback(() => {
                                connection.release();
                                return res.status(500).json({ success: false, error: 'Error completing booking' });
                            });
                        } else {
                            console.log('Teacher availability updated');
                        }
                    });

                    // Commit transaction
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('Error committing transaction:', err);
                                return res.status(500).json({ success: false, error: 'Internal server error' });
                            });
                        } else {
                            connection.release();
                            return res.status(200).json({ success: true });
                        }
                    });
                } catch (error) {
                    console.error('Error during transaction:', error);
                    connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({ success: false, error: 'Error completing booking' });
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error in completeBooking endpoint:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


app.post('/inquiry', (req, res) => {
    const { name, email, phone, message } = req.body;

    const sql = "INSERT INTO inquiries (name, email, phone, message) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, phone, message], (err, result) => {
        if (err) {
            console.error("Error adding inquiry:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        return res.status(201).json({ message: "Inquiry added successfully" });
    });
});

// GET endpoint to retrieve all inquiries
app.get('/inquiry', (req, res) => {
    db.query('SELECT * FROM inquiries', (error, results) => {
        if (error) {
            console.error('Error fetching inquiries:', error);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results); // Return the inquiries
        }
    });
});

app.post('/student-progress', (req, res) => {
    const { student_id, progress_level, sub_level, comment } = req.body;
    const query = `INSERT INTO student_progress (student_id, progress_level, sub_level, comment) VALUES (?, ?, ?, ?)`;
  
    db.query(query, [student_id, progress_level, sub_level, comment], (err, results) => {
      if (err) {
        return res.status(500).send('Error saving progress');
      }
      res.status(201).send('Progress saved successfully');
    });
  });


app.get('/student-progress/:student_id', (req, res) => {
    const { student_id } = req.params;
    
    const query = `
      SELECT progress_level, sub_level, comment 
      FROM student_progress 
      WHERE student_id = ? 
      ORDER BY progress_id DESC 
      LIMIT 1
    `;
    
    db.query(query, [student_id], (err, results) => {
      if (err) {
        return res.status(500).send('Error fetching student progress');
      }
      res.json(results[0]);
    });
});
  
// API Endpoint to Record Exam Result
app.post('/record_exam_result', (req, res) => {
  const { student_id, exam_date, exam_level, result, assessment } = req.body;
  const query = `INSERT INTO ABRSM_Exam_Result (student_id, exam_date, exam_level, result, assessment) VALUES (?, ?, ?, ?, ?)`;
  const values = [student_id, exam_date, exam_level, result, assessment];

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Error recording exam result');
      return;
    }
    res.status(200).send('Exam result recorded successfully');
  });
});

// API Endpoint to Get Exam Results by Student ID
app.get('/student-exam-results/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const query = `SELECT * FROM ABRSM_Exam_Result WHERE student_id = ? ORDER BY exam_date ASC`;

  
    db.query(query, studentId, (err, results) => {
      if (err) {
        console.error('Error fetching exam results:', err);
        res.status(500).json({ error: 'Error fetching exam results' });
        return;
      }
      res.status(200).json(results);
    });
  });

// Endpoint to get payment history using student_id
app.get('/paymentHistory/:student_id', (req, res) => {
    const student_id = parseInt(req.params.student_id);
    const query = `
        SELECT DISTINCT p.payment_id, p.amount, p.payment_date 
        FROM payment p
        JOIN booking_payment bp ON p.payment_id = bp.payment_id
        JOIN booking b ON bp.booking_id = b.booking_id
        WHERE b.student_id = ?
        ORDER BY p.payment_date DESC
    `;

    db.query(query, [student_id], (err, results) => {
        if (err) {
            console.error('Error fetching payment history:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'No payment history found for this student' });
        }
    });
});

app.get('/payments/year-to-date', (req, res) => {
    const currentYear = new Date().getFullYear();
    const query = `
        SELECT SUM(amount) AS total_amount
        FROM payment
        WHERE YEAR(payment_date) = ?
    `;

    db.query(query, [currentYear], (err, results) => {
        if (err) {
            console.error('Error fetching YTD payments:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results[0]);
    });
});

app.get('/payments/monthly', (req, res) => {
    const currentYear = new Date().getFullYear();
    const query = `
        SELECT MONTH(payment_date) AS month, SUM(amount) AS total_amount
        FROM payment
        WHERE YEAR(payment_date) = ?
        GROUP BY MONTH(payment_date)
        ORDER BY MONTH(payment_date)
    `;

    db.query(query, [currentYear], (err, results) => {
        if (err) {
            console.error('Error fetching monthly payments:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

app.post('/bookings/markAbsent', async (req, res) => {
    const { booking_id, student_id } = req.body;

    if (!booking_id || !student_id) {
        return res.status(400).json({ success: false, error: 'Booking ID and Student ID are required' });
    }

    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                return res.status(500).json({ success: false, error: 'Internal server error' });
            }

            // Begin transaction
            connection.beginTransaction(async (err) => {
                if (err) {
                    connection.release();
                    console.error('Error beginning transaction:', err);
                    return res.status(500).json({ success: false, error: 'Internal server error' });
                }

                try {
                    // Update booking to mark as absent
                    await new Promise((resolve, reject) => {
                        connection.query(
                            'UPDATE booking SET is_absent = 1 WHERE booking_id = ?',
                            [booking_id],
                            (error, result) => {
                                if (error) {
                                    console.error('Error updating booking:', error);
                                    reject(error);
                                } else if (result.affectedRows === 0) {
                                    reject(new Error('Booking not found'));
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    });

                    // Insert make-up token record
                    await new Promise((resolve, reject) => {
                        connection.query(
                            'INSERT INTO make_up_token (student_id, issued_date) VALUES (?, ?)',
                            [student_id, new Date()],
                            (error, result) => {
                                if (error) {
                                    console.error('Error inserting make-up token:', error);
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    });

                    // Commit transaction
                    connection.commit((err) => {
                        if (err) {
                            connection.rollback(() => {
                                connection.release();
                                console.error('Error committing transaction:', err);
                                return res.status(500).json({ success: false, error: 'Internal server error' });
                            });
                        } else {
                            connection.release();
                            return res.status(200).json({ success: true });
                        }
                    });
                } catch (error) {
                    console.error('Error during transaction:', error);
                    connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({ success: false, error: error.message });
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error in markAbsent endpoint:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});



app.listen(5000, () => {
    console.log("listening");
})
