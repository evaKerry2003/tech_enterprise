const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module
const mysql = require('mysql2'); 
const nodemailer = require('nodemailer'); 

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// MySQL connection
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

// Email setup using Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'githakajr@gmail.com', 
        pass: 'nmgetkkkootqwqmx' 
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

        const mailOptions = {
            from: 'githakajr@gmail.com',
            to: email,
            subject: 'Complaint Received',
            text: `Dear ${name},\n\nYour complaint has been received:\n\n"${complaint}"\n\nWe will get back to you shortly.\n\nBest regards,\nTimeless Tech`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
                return res.status(500).send('Error sending confirmation email');
            }
            console.log('Email sent: ' + info.response);
            res.send('Your complaint has been received successfully!');
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
