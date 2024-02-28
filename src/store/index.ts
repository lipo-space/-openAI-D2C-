import { defineStore } from 'pinia';

interface Message {
  type: 'text' | 'image';
  content: string;
}

export const useStore = defineStore({
  id: 'app',
  state: () => ({
    code: '',
    dialog: [] as Message[],
    uploadedImages: [] as File[], // 保存已上传的图片
    textMessage: '', // 保存文本消息
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
  },
});
