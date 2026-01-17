const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST' && req.body) {
        const loggedBody = { ...req.body };
        if (loggedBody.password) loggedBody.password = '***';
        console.log('Body:', loggedBody);
    }
    next();
});

app.use(express.static(path.join(__dirname, '../client')));

const dbPath = path.join(__dirname, 'db.json');
const JWT_SECRET = 'your-super-secret-key-that-should-be-in-an-env-file';

async function getUsers() {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { users: [] };
        }
        throw error;
    }
}

async function saveUsers(users) {
    await fs.writeFile(dbPath, JSON.stringify(users, null, 2), 'utf8');
}

app.get('/health', (req, res) => {
    res.setHeader('X-App-Server', 'AccountableFutures');
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/signup', async (req, res) => {
    let { fullname, email, password } = req.body;
    if (email) email = email.trim().toLowerCase();
    if (fullname) fullname = fullname.trim();
    console.log(`Signup attempt for: ${email}`);

    if (!fullname || !email || !password) {
        console.log(`Signup failed: Missing fields for ${email || 'unknown email'}`);
        return res.status(400).json({ message: 'Fullname, email and password are required' });
    }

    const db = await getUsers();
    db.users = db.users || [];

    const existingUser = db.users.find(user => user.email.toLowerCase() === email);
    if (existingUser) {
        console.log(`Signup failed: User already exists ${email}`);
        return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { fullname, email, password: hashedPassword };
    db.users.push(newUser);
    await saveUsers(db);

    const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    if (email) email = email.trim().toLowerCase();
    console.log(`Login attempt for: ${email}`);

    if (!email || !password) {
        console.log(`Login failed: Missing fields for ${email || 'unknown email'}`);
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = await getUsers();
    db.users = db.users || [];
    const user = db.users.find(user => user.email.toLowerCase() === email);

    if (!user) {
        console.log(`Login failed: User not found: ${email}`);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log(`Login failed: Incorrect password for: ${email}`);
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

app.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    const db = await getUsers();
    res.json(db.users || []);
});

app.delete('/users/:email', authMiddleware, adminMiddleware, async (req, res) => {
    const { email } = req.params;
    const db = await getUsers();
    const userIndex = db.users.findIndex(user => user.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    db.users.splice(userIndex, 1);
    await saveUsers(db);
    res.status(200).json({ message: 'User deleted successfully' });
});

app.get('/posts', authMiddleware, async (req, res) => {
    const db = await getUsers();
    res.json(db.posts || []);
});

app.post('/posts', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    const db = await getUsers();
    const newPost = { id: Date.now(), title, content, likes: 0, comments: [] };
    db.posts = db.posts || [];
    db.posts.push(newPost);
    await saveUsers(db);
    res.status(201).json(newPost);
});

app.post('/posts/:id/like', authMiddleware, async (req, res) => {
    const db = await getUsers();
    const post = db.posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        post.likes++;
        await saveUsers(db);
        res.json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

app.post('/posts/:id/comment', authMiddleware, async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ message: 'Comment is required' });
    }
    const db = await getUsers();
    const post = db.posts.find(p => p.id === parseInt(req.params.id));
    if (post) {
        post.comments.push(comment);
        await saveUsers(db);
        res.json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});