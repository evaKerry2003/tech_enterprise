// Import required modules
const express = require('express');
const path = require('path');

// Create an instance of the express application
const app = express();
const PORT = 8080; // Port to run your server

// Middleware to serve static files (optional)
app.use(express.static(path.join(__dirname)));

// Route to serve the contact.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html')); // Serve contact.html from the root directory
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
