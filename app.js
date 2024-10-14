const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = 3005;
const requestCounts = {};
const blockedIPs = new Set();

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
    console.log('WebSocket connected');
});

app.use((req, res, next) => {
    const simulatedIP = req.query.ip;
    const ip = simulatedIP || (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    if (ip === '::1' || ip === '127.0.0.1') {
        return res.send(`Received request from local IP: ${ip}`);
    }

    if (blockedIPs.has(ip)) {
        return res.status(429).send('Blocked');
    }

    requestCounts[ip] = (requestCounts[ip] || 0) + 1;

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ ip, count: requestCounts[ip] }));
        }
    });

    if (requestCounts[ip] >= 5) {
        blockedIPs.add(ip);
        requestCounts[ip] = undefined;
    }

    res.send(`Received request from ${ip}`);
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
