<template>
  <div class="dialog" ref="duihuakuang">
    <div v-for="(message, index) in store.dialog" :key="index" class="message">
      <h4 class="name">You</h4>
      <template v-if="message.type === 'text'">
        {{ message.content }}
      </template>
      <template v-else-if="message.type === 'image'">
        <img :src="message.content" alt="Uploaded Image" class="uploaded-image" />
      </template>
    </div>
  </div>

  <div class="image-converter">
    <div class="input-area">
      <div class="uploaded-images">
        <img v-for="(image, index) in store.uploadedImages" :key="index" :src="createObjectURL(image)"
          alt="Uploaded Image" class="uploaded-image" />
      </div>

      <el-upload :file-list="fileList" list-type="picture-card" :on-remove="handleRemove" @file="handleImageUpload"
        :auto-upload="false" 
        class="upload" 
        >
        <el-icon>
          <Plus />
        </el-icon>
        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file, fileList)">
                <el-icon>
                  <Delete />
                </el-icon>
              </span>
            </span>
          </div>
        </template>
      </el-upload>

      <div class="editable-div" contenteditable="true" @input="handleEditableInput"></div>

      <label class="upload-image">
        <span class="upload-icon"></span>
        <input ref="fileInputRef" type="file" accept="image/*" @change="handleImageUpload" style="display: none;"
          multiple />
      </label>

      <button @click="sendMessage">Send</button>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store/index';
import { onMounted } from 'vue';
import { nextTick } from 'vue';
import { ElUpload } from 'element-plus';
import type { UploadProps, UploadUserFile } from 'element-plus'
// import { sendToserver, getImageToCode } from '@/services/OpenAIService';

export default defineComponent({
  components: {
    ElUpload
  },
  setup() {
    const store = useStore();
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const duihuakuang = ref<HTMLElement | null>(null);

    const fileList = ref<UploadUserFile[]>([]);
    const disabled = ref(false)

    const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
      fileList.value = fileList.value.filter(file => file.uid !== uploadFile.uid);
    }

    const handleImageUpload = () => {
      try {
        const files = fileInputRef.value?.files;
        if (files) {
          for (const file of files) {
            store.addImage(file);


            //   reader.onloadend = () => {
            //     const imageData = reader.result as string;
            //     console.log(imageData)
            //     store.addImage(imageData);
            //   };
            //   reader.readAsDataURL(file);
          }
        }
      } catch (error) {
        console.error('Error in handleImageUpload:', error);
      }
    };

    const createObjectURL = (file: File) => URL.createObjectURL(file);

    const handleEditableInput = (event: Event) => {
      const inputText = (event.target as HTMLDivElement).innerText;
      store.setTextMessage(inputText || '');
    };

    const sendMessage = async () => {
      if (store.uploadedImages.length > 0) {
        for (const imageFile of store.uploadedImages) {
          store.addMessage({ type: 'image', content: URL.createObjectURL(imageFile) });
          // await getImageToCode(imageFile);
        }
        store.clearImages();
      }

      if (store.textMessage.trim() !== '') {
        store.addMessage({ type: 'text', content: store.textMessage });
        // await sendToserver(store.textMessage);
        store.textMessage = '';
        const editableDiv = document.querySelector('.editable-div') as HTMLDivElement;
        editableDiv.innerText = '';
      }

      if (duihuakuang.value) {
        await nextTick();
        duihuakuang.value.scrollTop = duihuakuang.value.scrollHeight;
      }
    };

    onMounted(() => {
      duihuakuang.value = document.querySelector('.dialog') as HTMLElement;
    });


    return {
      store,
      fileInputRef,
      handleImageUpload,
      handleEditableInput,
      sendMessage,
      createObjectURL,
      fileList,
      handleRemove,
      disabled,
    };
  },
});
</script>

<style scoped>
.image-converter {
  position: fixed;
  bottom: 2rem;
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
  height: 74.5vh;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.message {
  margin: 2rem 0;
  /* border-bottom: 1px solid #d8851d; */
}

.name {
  margin-bottom: 10px;
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
}



.uploaded-images {
  display: flex;
  width: 100px;
  /* border: 1px solid #000; */
  height: auto;
}

.uploaded-image {
  width: 100px;
  margin: 10px;
  height: auto;
}
.el-upload--picture-card {
    width: 100px !important;
}
</style>
