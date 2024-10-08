const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Email setup using Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail's SMTP server
    auth: {
        user: 'githakajr@gmail.com', // Your Gmail address
        pass: 'nmgetkkkootqwqmx' // Your Gmail app password
    }
});

// Handle form submissions
app.post('/submit_complaint', (req, res) => {
    const { name, email, complaint } = req.body;

    const mailOptions = {
        from: email,
        to: 'githakajr@gmail.com', // Your email address
        subject: `New complaint from ${name}`,
        text: complaint,
        html: `<b>Name:</b> ${name}<br><b>Email:</b> ${email}<br><b>Complaint:</b><br>${complaint}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.send('Email sent: ' + info.response);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
