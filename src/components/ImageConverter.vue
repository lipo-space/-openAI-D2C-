<template>
  <div class="dialog" ref="duihuakuang">
    <el-button  type="warning" plain @click="open" size="small" class="apibtn">
      change api_key
    </el-button>
    <div v-for="(message, index) in store.dialog" :key="index" class="message">

      <Transition name="slide">
        <h4 class="name">
          {{ message.sender === 'user' ? 'You' : 'GPT' }}
        </h4>
      </Transition>
      <div class="yiciduihua">
        <div v-if="message.type === 'image' || message.type === 'mixed'">
          <div v-for="(file, fileIndex) in (message.type === 'image' ? message.content : message.content.images)"
            :key="fileIndex">
            <img :src="createObjectURL(file)" alt="Uploaded Image" class="uploaded-image" />
          </div>
        </div>

        <p v-if="message.type === 'text' || message.type === 'mixed'" class="fasongtest">
          {{ message.type === 'text' ? message.content : message.content.text }}
        </p>

        <!-- {{ formatGPT4Response(message.content) }} -->
        <p v-bind:innerHTML="formatGPT4Response(message.content)" v-if="message.type === 'gpt4Response'"></p>



      </div>

    </div>

  </div>

  <div class="image-converter">
    <div class="input-area">
      <!-- <div class="uploaded-images">
        <img v-for="(image, index) in store.uploadedImages" :key="index" :src="createObjectURL(image)"
          alt="Uploaded Image" class="uploaded-image" />
      </div> -->

      <el-upload :file-list="store.uploadedImages" list-type="picture-card" :on-remove="handleRemove"
        @change="ImageUpload($event as any)" :auto-upload="false" class="upload" multiple>
        <el-icon>
          <Plus />
        </el-icon>
        <template #file="{ file, uploadFile }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file, uploadFile)">
                <el-icon>
                  <Delete />
                </el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>

      <div class="editable-div" contenteditable="true" @input="handleEditableInput"></div>

      <!-- <label class="upload-image">
        <span class="upload-icon"></span>
        <input ref="fileInputRef" type="file" accept="image/*" @change="handleImageUpload" style="display: none;"
          multiple />
      </label> -->

      <button @click="sendMessage">Send</button>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store/index';
import { onMounted, ref } from 'vue';
import { nextTick } from 'vue';
import { ElUpload } from 'element-plus';
import type { UploadProps, } from 'element-plus';
import { sendToServer } from '@/services/OpenAIService';
import { ElMessage, ElMessageBox } from 'element-plus';

const store = useStore();
// const fileInputRef = ref<HTMLInputElement | null>(null);
const duihuakuang = ref<HTMLElement | null>(null);
// const fileList = ref<UploadUserFile[]>([]);
const disabled = ref(false);

const createObjectURL = (file: File) => {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
}

const handleRemove: UploadProps['onRemove'] = (uploadFile: { uid: number; }) => {
  // console.log(uploadFile.uid)
  store.uploadedImages = store.uploadedImages.filter((file: any) => file.uid !== uploadFile.uid);
}

const ImageUpload: UploadProps['beforeUpload'] = (file) => {
  const rawFile = file as unknown as { raw: File };
  store.addImage(rawFile.raw);
  // console.log(rawFile.raw)

}

// const handleImageUpload = () => {

//   console.log(store.uploadedImages)
//   console.log(fileList.value)

//   try {
//     const files = fileInputRef.value?.files;
//     if (files) {
//       for (const file of files) {
//         store.addImage(file);
//         console.log(store.uploadedImages)
//       }
//     }
//   } catch (error) {
//     console.error('Error in handleImageUpload:', error);
//   }
// };

// const createObjectURL = (file: File) => URL.createObjectURL(file);

const handleEditableInput = (event: Event) => {
  const inputText = (event.target as HTMLDivElement).innerText;
  store.setTextMessage(inputText || '');
};

// 发消息
const sendMessage = async () => {

  // if (store.uploadedImages.length > 0) {
  //   for (const imageFile of store.uploadedImages) {
  //     store.addMessage({ type: 'image', content: URL.createObjectURL(imageFile) });
  //     // await getImageToCode(imageFile);
  //   }
  //   store.clearImages();
  // }

  if (store.uploadedImages.length > 0 && store.textMessage == '') {
    store.addMessage({ sender: 'user', type: 'image', content: store.uploadedImages });

    // console.log(typeof store.uploadedImages)
    await sendToServer({ type: 'image', content: store.uploadedImages });

    // console.log(store.dialog)
    store.clearImages();
  }

  if (store.textMessage.trim() !== '' && store.uploadedImages.length == 0) {
    store.addMessage({ sender: 'user', type: 'text', content: store.textMessage });

    await sendToServer({ type: 'text', content: store.textMessage });

    store.textMessage = '';
    const editableDiv = document.querySelector('.editable-div') as HTMLDivElement;
    editableDiv.innerText = '';
  }

  if (store.textMessage.trim() !== '' && store.uploadedImages.length > 0) {
    store.addMessage({ sender: 'user', type: 'mixed', content: { text: store.textMessage, images: store.uploadedImages.slice() } });

    await sendToServer({ type: 'mixed', content: { 'text': store.textMessage, 'images': store.uploadedImages } });

    store.textMessage = '';
    const editableDiv = document.querySelector('.editable-div') as HTMLDivElement;
    editableDiv.innerText = '';
    store.clearImages();
  }


  await nextTick();
  setTimeout(() => {
    if (duihuakuang.value) {
      duihuakuang.value.scrollTop = duihuakuang.value.scrollHeight;
    }
  }, 50);
};


const open = () => {
  ElMessageBox.prompt('Please input your api', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
      /^[a-zA-Z0-9!@#$%^&*()-_+=]+$/,
  })
    .then(async ({ value }) => {
      store.apikey = value;
      await sendToServer({ type: 'apikey', content: value });
      ElMessage({
        type: 'success',
        message: `Your api is received`,
      });
      // 用户输入了 API，发送消息
      store.setTextMessage('Hi, Nice to meet you!');
      sendMessage();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
      // 用户点击了取消，发送消息
      store.setTextMessage('Hi, Nice to meet you!');
      sendMessage();
    })
};

// onMounted(open);

// 检测消息发送与接收
onMounted(() => {
  duihuakuang.value = document.querySelector('.dialog') as HTMLElement;
  // 创建一个WebSocket对象
  const socket = new WebSocket('ws://localhost:3005');

  // 监听连接建立事件
  socket.onopen = function () {
    console.log('WebSocket连接已建立');

    // 可以在连接建立后发送消息
    // const initialMessage = { text: 'Hi, Nice to meet you!' };
    // socket.send(JSON.stringify(initialMessage));
    // store.setTextMessage('Hi, Nice to meet you!');
    // sendMessage();
    // store.addMessage({ sender: 'user', type: 'text', content: store.textMessage });
  };

  // 监听接收到消息事件
  socket.onmessage = function (event) {
    // console.log('服务器:', event.data);
    const parsedData = JSON.parse(event.data);
    const content = parsedData.data;

    setTimeout(() => {
      store.addMessage({ sender: 'GPT', type: 'gpt4Response', content: content });
    }, 700);

    setTimeout(() => {
      if (duihuakuang.value) {
        duihuakuang.value.scrollTop = duihuakuang.value.scrollHeight;
      }
    }, 701);
  };

  // 监听连接关闭事件
  socket.onclose = function () {
    console.log('WebSocket连接已关闭');
  };

  // 监听连接错误事件
  socket.onerror = function (error) {
    console.error('WebSocket连接发生错误:', error);
  };

});


//格式化得到的回答
const formatGPT4Response = (content: any) => {
  // 尝试将内容解析为JSON对象
  let jsonContent;
  try {
    jsonContent = JSON.parse(content);
  } catch (error) {
    // 如果解析失败，说明内容不是一个有效的JSON字符串
    // 此时，我们可以直接返回原始内容
    jsonContent = null;
  }

  if (jsonContent) {
    // 如果内容是一个有效的JSON字符串，我们将其格式化并返回
    return '<pre>' + JSON.stringify(jsonContent, null, 2) + '</pre>';
  } else {
    // 如果内容不是一个有效的JSON字符串，我们按照原来的方式处理
    // 使用正则表达式识别代码块
    const codeBlockRegex = /(```\n[\s\S]*?\n```)/g;
    content = content.replace(codeBlockRegex, '<pre>$1</pre>');

    // 使用正则表达式识别关键词
    const keywordRegex = /(关键词1|关键词2|关键词3)/g;
    content = content.replace(keywordRegex, '<span class="keyword">$1</span>');

    // 使用<br>标签替换换行符，以实现换行
    content = content.replace(/\n/g, '<br>');

    return content;
  }
};




</script>

<style scoped>
.apibtn {
  position: fixed;
  left: 5vw;
}

.yiciduihua {
  border: 1px solid #dabca4c6;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.image-converter {
  position: fixed;
  bottom: 6.5vh;
  left: 15vw;
  width: 70vw;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  /* text-align: center; */
}

.dialog {
  position: fixed;
  top: 3.8rem;
  left: 15.2vw;
  width: 70vw;
  height: 66vh;
  overflow-y: auto;
  margin-bottom: 1rem;
  white-space: pre-wrap;
}

.message {
  margin: 2rem 0;
  /* border-bottom: 1px solid #d8851d; */
}

.name {
  margin-bottom: 10px;
  color: #d8851d;
}

.uploaded-image {
  max-width: 100%;
  max-height: 200px;
  margin-top: 0.5rem;

}

.input-area {
  /* display: flex; */
  align-items: center;
}


.upload-image {
  position: absolute;
  bottom: 6px;
  left: 60px;
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: #89b3d9;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  margin-bottom: 5px;

}

.upload-image:hover {
  background-color: #2980b9;
}

.upload-image input {
  display: none;
}

.upload-icon::before {
  content: '\002B';
  font-size: 1.2rem;
  line-height: 28px;
}

button {
  background-color: #89b3d9;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

button:hover {
  background-color: #2980b9;

}

.editable-div {
  border: 1px solid #ccc;
  min-height: 50px;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 10px;
  background-color: #fff;
  white-space: pre-wrap;
}

.uploaded-images {
  display: flex;
  width: 100px;
  /* border: 1px solid #000; */
  height: auto;
}

.uploaded-image {
  width: 100px;
  /* margin: 10px; */
  height: auto;
}

.fasongtest {
  word-wrap: break-word;
}
</style>

<style>
.keyword {
  background-color: #f0f0f0;
  padding: 2px;
  border-radius: 4px;
}

pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: monospace;
  border: 1px solid #00000022;
}

.upload .el-upload {
  position: fixed;
  bottom: 7.2vh;
  width: 30px;
  height: 30px;
  background-color: #89b3d9;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  margin-bottom: 5px;
}

.upload .el-upload:hover {
  background-color: #2980b9;
}

i.el-icon {
  color: #fff !important;
}

.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>