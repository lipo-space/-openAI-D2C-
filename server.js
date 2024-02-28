const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3000;

app.post('/upload', upload.single('image'), (req, res) => {
  const fs = require('fs');

  fs.readFile(req.file.path, (err, data) => {
    if (err) throw err;
    const base64Image = Buffer.from(data).toString('base64');
    console.log(base64Image);

    // 在这里，你可以将base64Image发送到你的AI模型，然后返回生成的代码
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
