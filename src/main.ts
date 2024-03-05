import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { Uploader  } from 'vant'
import 'vant/lib/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


// import { socket } from '../websocket';
// import { sendToServerViaWebSocket } from './services/OpenAIService'; 

const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(pinia)
app.use(Uploader)
app.use(ElementPlus)
app.mount('#app');


// 向服务器发送消息的例子
// sendToServerViaWebSocket({ type: 'text', content: 'Hello, Server!' }, socket);
