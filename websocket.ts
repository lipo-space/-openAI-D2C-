// // WebSocketModule.ts

// import { ref } from 'vue';

// // WebSocket 实例
// let socket: WebSocket | null = null;

// // WebSocket 连接状态
// const isConnected = ref(false);

// function initializeWebSocket() {
//     // 替换 'ws://your-server-url' 为你的后端 WebSocket 服务器地址
//     socket = new WebSocket('ws://192.168.8.115:3000');

//     socket.addEventListener('open', () => {
//         console.log('WebSocket 连接已建立');
//         isConnected.value = true;
//     });

//     // 其他监听器和处理逻辑

//     socket.addEventListener('close', (event) => {
//         console.log('WebSocket 连接已关闭', event.code, event.reason);
//         isConnected.value = false;
//         // 在这里可以执行一些与 WebSocket 连接关闭相关的操作
//     });

//     socket.addEventListener('error', (event) => {
//         console.error('WebSocket 连接发生错误', event);
//         // 在这里可以处理连接错误
//     });
// }

// // 在模块加载时初始化 WebSocket
// initializeWebSocket();

// // 发送消息到服务器的函数
// function sendToServerViaWebSocket(message: { type: string; content: string }) {
//     try {
//         // console.log(message);

//         // 检查 WebSocket 连接状态
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             console.log(JSON.stringify(message))
//             socket.send(JSON.stringify(message));
//             socket.onmessage = (event) => {
//                 console.log('Received message:', event.data);
//             };
//         } else {
//             console.error('WebSocket 连接尚未建立，无法发送消息。');
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

// export { sendToServerViaWebSocket, isConnected };
