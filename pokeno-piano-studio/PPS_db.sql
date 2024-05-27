CREATE database PPS_db;

USE PPS_db;

CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    user_id INT NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE IF NOT EXISTS pricing (
    pricing_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_type VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    price DECIMAL(8,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS teacher (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    lesson_type VARCHAR(50) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student (student_id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id)
);

CREATE TABLE teacher_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    start_time TIME,
    end_time TIME,
    duration INT, -- Duration in minutes
    is_booked BOOLEAN DEFAULT 0, -- Default to not booked
    FOREIGN KEY (teacher_id) REFERENCES teacher (teacher_id)
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(8,2) NOT NULL,
    payment_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS booking_payment (
    booking_payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_id INT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES booking (booking_id),
    FOREIGN KEY (payment_id) REFERENCES payment (payment_id),
    UNIQUE KEY (booking_id, payment_id)
);

CREATE TABLE inquiries (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    dateSubmitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    progress_level ENUM('beginner', 'advanced beginner', 'intermediate player', 'advanced player', 'performance player') NOT NULL,
    sub_level INT NOT NULL CHECK (sub_level BETWEEN 1 AND 5),
    comment TEXT,
    FOREIGN KEY (student_id) REFERENCES student (student_id)
);

CREATE TABLE IF NOT EXISTS ABRSM_exam_result (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_date DATE NOT NULL,
    exam_level ENUM('Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8') NOT NULL,
    result DECIMAL(5,2) NOT NULL,
    assessment ENUM('Pass', 'Merit', 'Distinction', 'Fail') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES student (student_id)
);


-- Populate user table
INSERT INTO user (first_name, last_name, email, password, role)
VALUES 
    ('John', 'Doe', 'user1@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i', 'student'),
    ('Jane', 'Smith', 'user2@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
	('Emily', 'Brown', 'user4@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
    ('William', 'Jones', 'user5@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
    ('Olivia', 'Williams', 'user6@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
    ('James', 'Taylor', 'user7@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
    ('Emma', 'Davis', 'user8@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
    ('Alexander', 'Miller', 'user9@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
    ('Sophia', 'Wilson', 'user10@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i','student'),
    ('Michelle', 'Johnson', 'michelle@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i', 'teacher'),
    ('David', 'Smith', 'david@example.com','$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i', 'teacher'),
    ('Michelle', 'Johnson', 'admin@example.com', '$2b$10$/UHz6nobtXuBOk1xpPeGout0M3XwsH2XfGA5I8jTyvxkRZTRZVU5i', 'admin');
    
-- Populate student table 
INSERT INTO student (first_name, last_name, email, phone_number, user_id, bio)
VALUES 
    ('John', 'Doe', 'user1@example.com', '02102876516', 1, null),
    ('Jane', 'Smith', 'user2@example.com', '09 876 5326', 2, null),
    ('Emily', 'Brown', 'user4@example.com', '09 123 4567', 3, null),
    ('William', 'Jones', 'user5@example.com', '0229876543', 4, null),
    ('Olivia', 'Williams', 'user6@example.com', '0212345678', 5, null),
    ('James', 'Taylor', 'user7@example.com', '09 765 4321', 6, null),
    ('Emma', 'Davis', 'user8@example.com', '0218765432', 7, null),
    ('Alexander', 'Miller', 'user9@example.com', '0223456789', 8, null),
    ('Sophia', 'Wilson', 'user10@example.com', '09 987 6543', 9, null);
    
-- Populate pricing table
INSERT INTO pricing (lesson_type, duration, price)
VALUES 
    ('individual', 30, 50.00),
    ('individual', 45, 70.00),
    ('individual', 60, 85.00);

-- Populate teacher table
INSERT INTO teacher (first_name, last_name, email, phone_number, user_id, bio)
VALUES 
    ('Michelle', 'Johnson', 'michelle@example.com', '02102876516', 10, 'Experienced piano teacher with over 10 years of teaching experience.'),
    ('David', 'Smith', 'david@example.com', '987-654-3210', 11, 'Experienced piano teacher with a background in classical and contemporary music.');

-- Populate admin table
INSERT INTO admin (first_name, last_name, email, phone_number, user_id, bio)
VALUES 
    ('Michelle', 'Johnson', 'admin@example.com', '123-456-7890', 12, 'Experienced piano teacher with over 10 years of teaching experience.');

-- February 2024
INSERT INTO booking (student_id, teacher_id, lesson_type, booking_date, start_time, end_time)
VALUES 
    (1, 1, 'individual', '2024-02-01', '07:30:00', '08:00:00'), -- 30-minute lesson
    (2, 1, 'individual', '2024-02-06', '10:00:00', '10:45:00'), -- 45-minute lesson
    (3, 1, 'individual', '2024-02-08', '11:00:00', '12:00:00'), -- 60-minute lesson
    (4, 2, 'individual', '2024-02-10', '10:00:00', '10:30:00'),
    (5, 2, 'individual', '2024-02-15', '17:00:00', '17:45:00'),
    (6, 1, 'individual', '2024-02-15', '13:00:00', '13:30:00'),
    (7, 1, 'individual', '2024-02-19', '10:00:00', '10:30:00'),
    (8, 2, 'individual', '2024-02-20', '10:00:00', '10:45:00'),
    (9, 1, 'individual', '2024-02-28', '10:00:00', '11:00:00'),
    (1, 1, 'individual', '2024-02-28', '17:30:00', '18:00:00');

-- March 2024
INSERT INTO booking (student_id, teacher_id, lesson_type, booking_date, start_time, end_time)
VALUES 
    (1, 1, 'individual', '2024-03-01', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-03-08', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-03-15', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-03-22', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-03-29', '08:00:00', '09:00:00'),
    (2, 1, 'individual', '2024-03-01', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-03-08', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-03-15', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-03-22', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-03-29', '10:00:00', '11:00:00'),
    (3, 1, 'individual', '2024-03-03', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-03-10', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-03-17', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-03-24', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-03-31', '19:00:00', '19:30:00'),
    (4, 2, 'individual', '2024-03-01', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-03-08', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-03-15', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-03-22', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-03-29', '10:00:00', '10:45:00'),
    (5, 2, 'individual', '2024-03-02', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-03-09', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-03-16', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-03-23', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-03-30', '11:00:00', '12:00:00'),
    (6, 1, 'individual', '2024-03-03', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-03-10', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-03-17', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-03-24', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-03-31', '13:30:00', '14:00:00');
    
-- April 2024
INSERT INTO booking (student_id, teacher_id, lesson_type, booking_date, start_time, end_time)
VALUES 
    (1, 1, 'individual', '2024-04-05', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-04-12', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-04-19', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-04-26', '08:00:00', '09:00:00'),
    (2, 1, 'individual', '2024-04-05', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-04-12', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-04-19', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-04-26', '10:00:00', '11:00:00'),
    (3, 1, 'individual', '2024-04-07', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-04-14', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-04-21', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-04-28', '19:00:00', '19:30:00'),
    (4, 2, 'individual', '2024-04-05', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-04-12', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-04-19', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-04-26', '10:00:00', '10:45:00'),
    (5, 2, 'individual', '2024-04-06', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-04-13', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-04-20', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-04-27', '11:00:00', '12:00:00'),
    (6, 1, 'individual', '2024-04-07', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-04-14', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-04-21', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-04-28', '13:30:00', '14:00:00');

-- May 2024
INSERT INTO booking (student_id, teacher_id, lesson_type, booking_date, start_time, end_time)
VALUES 
    (1, 1, 'individual', '2024-05-03', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-05-10', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-05-17', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-05-24', '08:00:00', '09:00:00'),
    (1, 1, 'individual', '2024-05-31', '08:00:00', '09:00:00'),
    (2, 1, 'individual', '2024-05-03', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-05-10', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-05-17', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-05-24', '10:00:00', '11:00:00'),
    (2, 1, 'individual', '2024-05-31', '10:00:00', '11:00:00'),
    (3, 1, 'individual', '2024-05-05', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-05-12', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-05-19', '19:00:00', '19:30:00'),
    (3, 1, 'individual', '2024-05-26', '19:00:00', '19:30:00'),
    (4, 2, 'individual', '2024-05-03', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-05-10', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-05-17', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-05-24', '10:00:00', '10:45:00'),
    (4, 2, 'individual', '2024-05-31', '10:00:00', '10:45:00'),
    (5, 2, 'individual', '2024-05-04', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-05-11', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-05-18', '11:00:00', '12:00:00'),
    (5, 2, 'individual', '2024-05-25', '11:00:00', '12:00:00'),
    (6, 1, 'individual', '2024-05-05', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-05-12', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-05-19', '13:30:00', '14:00:00'),
    (6, 1, 'individual', '2024-05-26', '13:30:00', '14:00:00');
    
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, duration, is_booked)
VALUES
    (1, 'Tuesday', '09:00:00', '09:30:00', 30, 0), -- 9:00 AM to 9:30 AM (30 minutes)
    (1, 'Tuesday', '09:45:00', '10:30:00', 45, 0), -- 9:45 AM to 10:30 AM (45 minutes)
    (1, 'Tuesday', '11:00:00', '12:00:00', 60, 0), -- 11:00 AM to 12:00 PM (60 minutes)
    (1, 'Thursday', '08:00:00', '09:00:00', 60, 1), -- 8:00 AM to 9:00 AM (60 minutes)
    (1, 'Thursday', '10:00:00', '11:00:00', 60, 1), -- 10:00 AM to 11:00 AM (60 minutes)
    (1, 'Saturday', '08:00:00', '08:30:00', 30, 0), -- 8:00 AM to 8:30 AM (30 minutes)
    (1, 'Saturday', '13:30:00', '14:00:00', 30, 1), -- 9:00 AM to 9:45 AM (45 minutes)
    (1, 'Saturday', '19:00:00', '19:30:00', 30, 1); -- 10:00 AM to 11:00 AM (60 minutes)
    
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, duration, is_booked)
VALUES
    (2, 'Monday', '09:00:00', '09:45:00', 45, 0), -- 9:00 AM to 9:45 AM (45 minutes)
    (2, 'Monday', '10:00:00', '10:30:00', 30, 0), -- 10:00 AM to 10:30 AM (30 minutes)
    (2, 'Monday', '11:00:00', '12:00:00', 60, 0), -- 11:00 AM to 12:00 PM (60 minutes)
    (2, 'Thursday', '10:00:00', '10:45:00', 45, 1), -- 10:00 AM to 10:45 AM (45 minutes)
    (2, 'Thursday', '11:00:00', '11:30:00', 30, 0), -- 11:00 AM to 11:30 AM (30 minutes)
    (2, 'Thursday', '12:00:00', '13:00:00', 60, 0), -- 12:00 PM to 1:00 PM (60 minutes)
    (2, 'Friday', '10:00:00', '10:30:00', 30, 0), -- 10:00 AM to 10:30 AM (30 minutes)
    (2, 'Friday', '11:00:00', '12:00:00', 60, 1); -- 11:00 AM to 12:00 PM (60 minutes)

-- Insert into payment table
INSERT INTO payment (amount, payment_date)
VALUES 
	(150.00, '2024-01-05'),
    (200.00, '2024-01-15'),
    (300.00, '2024-01-25'),
    (400.00, '2024-02-10'),
    (250.00, '2024-02-20'),
    (450.00, '2024-03-05'),
    (500.00, '2024-03-15'),
    (600.00, '2024-03-25'),
    (700.00, '2024-04-05'),
    (650.00, '2024-04-15'),
    (550.00, '2024-04-25'),
    (850.00, '2024-05-05'),
    (450.00, '2024-05-15'),
    (590.00, '2024-05-25'),
    (660.00, '2024-05-05'),
    (400.00, '2024-03-01'),
    (480.00, '2024-02-25');
-- Insert into booking_payment table
INSERT INTO booking_payment (booking_id, payment_id)
VALUES 
    (1, 1),  -- Payment 1 associated with Booking 1
    (2, 1),  -- Payment 1 associated with Booking 2
    (3, 2),  -- Payment 2 associated with Booking 3
    (4, 2),  -- Payment 2 associated with Booking 4
    (5, 3),  -- Payment 3 associated with Booking 5
    (6, 3),
    (7, 4),
    (8, 5),
    (9, 6),
    (10, 7),
    (11, 8)
    ;  
    
INSERT INTO inquiries (name, email, phone, message) VALUES
('John Doe', 'john@example.com', '1234567890', 'This is an inquiry about your products.'),
('Jane Smith', 'jane@example.com', '9876543210', 'I would like more information about your services.'),
('Alice Johnson', 'alice@example.com', '5551234567', 'Could you please provide details about your pricing?'),
('Bob Thompson', 'bob@example.com', '9998887777', 'I have a question regarding your return policy.'),
('Emily Brown', 'emily@example.com', '1112223333', 'I need assistance with placing an order.');


-- Insert data for student 1 to 9
INSERT INTO student_progress (student_id, progress_level, sub_level, comment) VALUES
(1, 'beginner', 3, 'Good job last week on practing!'),
(2, 'intermediate player', 2, 'Please practice more.'),
(3, 'advanced player', 1, 'Great work on your piece from last week.'),
(4, 'performance player', 5, Null),
(5, 'beginner', 1, 'Great start so far, keep up the work!'),
(6, 'advanced beginner', 4, 'Keep going.'),
(7, 'intermediate player', 3, 'More finger strength practice will benefit in your piece.'),
(8, 'advanced player', 2, Null),
(9, 'performance player', 4, 'Ready to perform!');

INSERT INTO ABRSM_Exam_Result (student_id, exam_date, exam_level, result, assessment) 
VALUES 
(1, '2024-05-15', 'Grade 2', 80.50, 'Merit'),
(2, '2024-04-20', 'Grade 4', 72.75, 'Pass'),
(3, '2024-03-10', 'Grade 8', 90.25, 'Distinction');

