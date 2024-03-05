const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
// import OpenAI from "openai";

// const openai = new OpenAI();

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 3000;

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log(`Received message: ${message}`);
    
    // 使用OpenAI的Chat模型
    // const response = await openai.ChatCompletion.create({
    //   model: 'gpt-4.0-turbo',
    //   messages: [
    //     {role: 'system', content: '你和ChatGPT正在聊天'},
    //     {role: 'user', content: message}
    //   ]
    // });
  
    // 获取ChatGPT的回复
    // const reply = response['choices'][0]['message']['content'];
    const reply = 'i know'
  
    console.log(reply);
    try {
      ws.send(reply);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.post('/upload', upload.array('images'), (req, res) => {

  console.log(req.files);
  console.log(req.body);

  // 获取上传的所有文件
  const uploadedFiles = req.files;

  // 将所有文件转换为Base64格式
  const base64DataArray = uploadedFiles.map((file) => {
    // 读取文件的二进制数据
    const fileData = fs.readFileSync(file.path);

    // 将二进制数据转换为Base64
    return fileData.toString('base64');
  });

  // 现在你可以使用base64DataArray与ChatGPT-4交互
  // 为了简单起见，这里只是打印出来
  console.log(base64DataArray);

  // 修正：只向已连接的WebSocket客户端发送消息
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'image', data: base64DataArray }));
    }
  });

  // 清理：删除上传的文件
  uploadedFiles.forEach((file) => {
    fs.unlinkSync(file.path);
  });

  res.send('Received your request!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
