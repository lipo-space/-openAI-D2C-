const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios'); 

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  const clientName = ip + port;

  ws.send('return data');

  ws.on('message', function incoming(message) {
    console.log('received: %s from %s', message);

    wss.clients.forEach(function each(client) {
      if ( client.readyState === WebSocket.OPEN ) {
        client.send(clientName + " -> " + message);
      }
    });
  });
});

app.post('/upload', upload.array('images'), (req, res) => {
  console.log(req.files);
  console.log(req.body);

  const uploadedFiles = req.files;
  const base64DataArray = uploadedFiles.map((file) => {
    const fileData = fs.readFileSync(file.path);
    return fileData.toString('base64');
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ base64: base64DataArray }));
        client.send(JSON.stringify({ text: req.body.text }));
    }
  });

  uploadedFiles.forEach((file) => {
    fs.unlinkSync(file.path);
  });

  res.send('Received your request!');
});









const port = 3005;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
