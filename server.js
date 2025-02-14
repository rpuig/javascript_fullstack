const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');

const app = express();
const imgDir = path.join(__dirname, 'img'); // Folder with images
const publicDir = path.join(__dirname, 'public'); // Folder for HTML & assets

// ✅ Fix CSP to allow inline styles
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allows inline scripts
            styleSrc: ["'self'", "'unsafe-inline'", "data:"], // ✅ Allows inline styles
            imgSrc: ["'self'", "data:", "http://localhost:3000"], // Allows images
        }
    }
}));

// Serve static files (HTML, CSS, JS)
app.use(express.static(publicDir));

// Serve images
app.use('/img', express.static(imgDir));
app.get('/', function (req, res) {
    res.sendFile(path.join(publicDir, 'index.html'));  // ✅ Serve 'public/index.html'
});



// API to get image filenames
app.get('/get-images', (req, res) => {
    fs.readdir(imgDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error reading image directory" });
        }
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)); // Only images
        res.json(imageFiles);
    });
});
app.get("/:universalURL", (req, res) => {
    res.send("404 URL NOT FOUND");
});  
// Start server
app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));
