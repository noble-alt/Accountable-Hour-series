const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
const PORT = 3000;

// Serve static files from the root directory
app.use(express.static('.'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', (req, res) => {
    const { fullName, email, password } = req.body;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') { // Ignore file not found, but handle other errors
            return res.status(500).json({ message: 'Error reading from database' });
        }

        let db;
        try {
            // If the file is empty or doesn't exist, start with an empty user list
            db = data ? JSON.parse(data) : { users: [] };
        } catch (parseErr) {
            return res.status(500).json({ message: 'Error parsing database data.' });
        }

        const userExists = db.users.some(user => user.email === email);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }

            db.users.push({ fullName, email, password: hash });

            fs.writeFile('db.json', JSON.stringify(db, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error writing to database' });
                }
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ message: 'Error reading from database' });
        }

        if (err && err.code === 'ENOENT') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let db;
        try {
            db = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ message: 'Error parsing database data.' });
        }

        const user = db.users.find(user => user.email === username);

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.status(200).json({ message: 'Sign-in successful' });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
