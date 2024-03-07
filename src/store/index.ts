import { defineStore } from 'pinia';

interface Message {
  sender: 'user' | 'GPT'; // 添加 sender 属性
  type: 'text' | 'image' | 'mixed' | 'gpt4Response' | 'apikey';
  content: string | File[] | { text: string, images: File[] };
}

export const useStore = defineStore({
  id: 'app',
  state: () => ({
    code: '',
    dialog: [] as Message[],
    uploadedImages: [] as File[], // 保存已上传的图片
    textMessage: '', // 保存文本消息
    apikey: '',
  }),
  actions: {
    setCode(newCode: string) {
      this.code = newCode;
    },
    addMessage(message: Message) {
      this.dialog.push(message);
    },
    addImage(image: File) {
      this.uploadedImages.push(image);
    },
    clearImages() {
      this.uploadedImages = [];
    },
    setTextMessage(text: string) {
      this.textMessage = text;
    },
    setapiMessage(text: string) {
      this.apikey = text;
    },
  },
});
