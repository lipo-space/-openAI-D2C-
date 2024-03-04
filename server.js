const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const app = express();
const port = 3000;

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


  
  // 清理：删除上传的文件
  uploadedFiles.forEach((file) => {
    fs.unlinkSync(file.path);
  });

  res.send('Received your request!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
