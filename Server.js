const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080; // Use your preferred port

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// MySQL connection (Use your own details)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mist3rgithaka',
    database: 'complaints_db'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// 1. User Registration Route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Check if the user already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error checking for existing user:', err);
                return res.status(500).send('Database error');
            }
            if (results.length > 0) {
                return res.status(400).send('User already exists');
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(query, [name, email, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Error inserting user: ', err);
                    return res.status(500).send('Server error');
                }
                // Send a success response
                res.status(201).send('User registered successfully!');
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).send('Server error');
    }
});

// 2. User Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Check if the user exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                return res.status(500).send('Database error');
            }

            console.log(`Checking login for email: ${email}`);

            if (results.length === 0) {
                return res.status(404).send('User does not exist');
            }

            const user = results[0];

            // Compare the password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send('Incorrect password');
            }

            // Generate a JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, 'techenterprise', { expiresIn: '1h' });

            res.json({
                message: 'Login successful',
                token, // Send the token to the client
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Server error');
    }
});

// Email setup using Nodemailer (Using hardcoded details)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'githakajr@gmail.com', // Use your email address
        pass: 'nmgetkkkootqwqmx' // Use your app password
    }
});

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html')); // Path to your contact.html file
});

// Route to handle complaints
app.post('/submit_complaint', (req, res) => {
    const { name, email, complaint } = req.body;

    const query = 'INSERT INTO complaints (name, email, complaint) VALUES (?, ?, ?)';
    db.query(query, [name, email, complaint], (err, results) => {
        if (err) {
            console.error('Error inserting complaint: ', err);
            return res.status(500).send('Server error');
        }

        console.log(`Complaint received from ${name} (${email}): ${complaint}`);

        // Return success message to client
        res.send('Your complaint has been received successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
