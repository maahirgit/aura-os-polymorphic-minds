const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Spawn the C++ CLI Backend
const cppProcess = spawn(path.join(__dirname, '../../cpp_backend/cli_backend.exe'));

// Request Queue to map C++ responses to Express res objects
const requestQueue = [];

cppProcess.stdout.on('data', (data) => {
    const responses = data.toString().trim().split('\n');
    for (let resStr of responses) {
        if (!resStr.trim()) continue;
        if (requestQueue.length > 0) {
            const { res } = requestQueue.shift();
            try {
                res.json(JSON.parse(resStr));
            } catch (e) {
                console.error("Failed to parse C++ response:", resStr);
                res.status(500).json({ error: "C++ Backend Serialization Error", raw: resStr });
            }
        }
    }
});

cppProcess.stderr.on('data', (data) => {
    console.error(`[C++ Backend Log/Error]: ${data}`);
});

cppProcess.on('close', (code) => {
    console.log(`C++ Backend process exited with code ${code}`);
});

// Helper to send action to C++ process
function sendToCpp(action, payload, res) {
    requestQueue.push({ action, res });
    const reqStr = JSON.stringify({ action, payload }) + '\n';
    cppProcess.stdin.write(reqStr);
}

// API Routes proxying to C++
app.get('/api/config', (req, res) => sendToCpp('GET_CONFIG', {}, res));
app.get('/api/logs', (req, res) => sendToCpp('GET_LOGS', {}, res));
app.get('/api/kiosks', (req, res) => sendToCpp('GET_KIOSKS', {}, res));

app.post('/api/kiosks', (req, res) => sendToCpp('CREATE_KIOSK', req.body, res));
app.post('/api/simulate-failure', (req, res) => sendToCpp('SIMULATE_FAILURE', req.body, res));
app.post('/api/purchase', (req, res) => sendToCpp('PURCHASE', req.body, res));
app.post('/api/toggle-emergency', (req, res) => sendToCpp('TOGGLE_EMERGENCY', req.body, res));
app.patch('/api/kiosks/:id', (req, res) => sendToCpp('UPDATE_KIOSK', { id: req.params.id, ...req.body }, res));

// Catch-all route for React Router
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Aura Retail OS - Node Proxy running on http://localhost:${PORT}`);
    console.log(`Connected to C++ Backend Process (PID: ${cppProcess.pid})`);
});
