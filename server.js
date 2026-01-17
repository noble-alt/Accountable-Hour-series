const express = require('express');
const path = require('path');
const cors = require('cors');
const server = require('./server/server');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Use the existing server logic for API routes
app.use('/api', server);

// Fallback to serve index.html for any other requests (SPA support if needed)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
