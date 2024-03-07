const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const axios = require('axios');
const { setApikey, getApikey } = require('./openai-test');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  const clientName = ip + port;

  // ws.send('return data');

  ws.on('message', function incoming(message) {
    const parsedMessage = JSON.parse(message);
    // console.log('received: %s from %s', parsedMessage);
    // console.log(parsedMessage);


    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(clientName + " -> " + message);
      }
    });

    // 在此处调用 GPT-4 API 并将结果发送回前端
    processGPT4Request(parsedMessage, ws);


  });
});

app.post('/apiinput', async (req, res) => {

  // 使用 setApikey 函数来设置 apikey
  setApikey(req.body.apikey);

  // 使用 getApikey 函数来获取 apikey
  if (!getApikey()) {
    res.status(400).send('Missing apikey');
    return;
  }

  // console.log(getApikey());
  res.send('Received your api!');
});


app.post('/upload', upload.array('images'), async (req, res) => {
  // console.log(req.files);
  // console.log(req.body);

  const uploadedFiles = req.files;
  const base64DataArray = uploadedFiles.map((file) => {
    const fileData = fs.readFileSync(file.path);
    return fileData.toString('base64');
  });

  const textData = req.body.text && req.body.text.trim() !== '' ? req.body.text : '';

  // console.log({
  //   base64: base64DataArray,
  //   text: textData,
  // })

  const gpt4Response = await processGPT4Request({
    base64: base64DataArray,
    text: textData,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'gpt4Response', data: gpt4Response }));
    }
  });

  // wss.clients.forEach(async (client) => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     // client.send(JSON.stringify({ base64: base64DataArray }));
  //     // client.send(JSON.stringify({ text: req.body.text }));


  //     // 发送图像数据
  //     if (Object.keys(req.files).length > 0) {
  //       // console.log({
  //       //   type: 'image',
  //       //   base64: base64DataArray,
  //       // })

  //       const imageResponses = await processGPT4Request({
  //         type: 'image',
  //         base64: base64DataArray,
  //       });
  //       client.send(JSON.stringify({ type: 'imageResponse', data: imageResponses }));
  //     }

  //     // 发送文本数据
  //     if (req.body.text && req.body.text.trim() !== '') {
  //       // console.log({
  //       //   type: 'text',
  //       //   text: req.body.text || 'System message',
  //       // })

  //       const textResponse = await processGPT4Request({
  //         type: 'text',
  //         text: req.body.text || 'System message',
  //       });
  //       client.send(JSON.stringify({ type: 'textResponse', data: textResponse }));
  //     }



  //   }

  // });

  uploadedFiles.forEach((file) => {
    fs.unlinkSync(file.path);
  });

  res.send('Received your request!');
});


async function processGPT4Request(data, ws) {
  // console.log(data.text, 2)
  // console.log(data.base64, 3)
  try {
    // 构建 GPT-4 API 请求体
    const payload = {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: "text",
              text: data.text || ''
            },

          ],
        },
      ],
      max_tokens: 300,
    };

    // 使用for循环来为每张图片添加一个新的url
    if (data.base64) {
      for (let base = 0; base < data.base64.length; base += 1) {
        payload.messages[0].content.push(
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${data.base64[base]}` || '',
            }
          },
        );
      }
    }
    const apikey = getApikey()
    console.log(apikey);

    // 调用 OpenAI GPT-4 API 处理数据并返回响应
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api_key}`,
        },
      },
      payload
    );

    const gpt4Response = openaiResponse.data.choices;



    // 如果请求的类型是'image'，则调用DALL-D3模型生成新的图片
    //  if (data.type === 'image') {
    //   const dallD3Payload = {
    //     model: 'dall-d3-vision-preview',
    //     messages: [
    //       {
    //         role: 'user',
    //         content: [
    //           {
    //             type: 'image',
    //             text: data.text || '',
    //           },
    //         ],
    //       },
    //     ],
    //     max_tokens: 300,
    //   };

    //   const dallD3Response = await axios.post(
    //     'https://api.openai.com/v1/chat/completions',
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${apiKey}`,
    //       },
    //     },
    //     dallD3Payload
    //   );

    //   const dallD3Image = dallD3Response.data.choices;
    //   ws.send(JSON.stringify({ dallD3Image }));
    // }






    // 将 GPT-4 的响应发送回 WebSocket 连接


    // ws.send(JSON.stringify({ gpt4Response }));

    console.log(gpt4Response.json())

    return gpt4Response;

  } catch (error) {
    console.error('Error processing GPT-4 request:', error.message);

    return 'Error processing GPT-4 request:', error.message;
  }
}


const port = 3005;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
