const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const messagesFile = path.join(__dirname, 'messages.json');

// Use body-parser to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Route to show the login form
app.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form onsubmit="localStorage.setItem('username', document.getElementById('username').value)" action="/chat.html" method="GET">
            <input id="username" type="text" name="username" placeholder="Enter your username" required>
            <button type="submit">Login</button>
        </form>
    `);
});

// Route to handle the chat page
app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Route to handle message submission
app.post('/send-message', (req, res) => {
    const { username, message } = req.body;
    let messages = [];

    if (fs.existsSync(messagesFile)) {
        const data = fs.readFileSync(messagesFile, 'utf8');
        messages = JSON.parse(data);
    }

    messages.push({ username, message });
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

    res.json(messages);
});

// Route to get all messages
app.get('/messages', (req, res) => {
    if (fs.existsSync(messagesFile)) {
        const data = fs.readFileSync(messagesFile, 'utf8');
        const messages = JSON.parse(data);
        res.json(messages);
    } else {
        res.json([]);
    }
});

// Default route
app.use('/', (req, res) => {
    res.redirect('/login');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
