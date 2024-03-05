// import service from 'axios';
// import { onMounted, watchEffect } from 'vue';
// import { sendToServerViaWebSocket, isConnected }  from '../../websocket';

export async function sendToServer(message: { type: 'text' | 'image' | 'mixed'; content: string | File[] | { 'text': string, 'images': File[] } }): Promise<any> {
    try {
        const formData = new FormData();

        if (message.type === 'image' || message.type === 'mixed') {
            // 如果消息包含图片
            let images: File[] = [];
            if (message.type === 'image') {
                images = message.content as File[];
            } else if (message.type === 'mixed') {
                if (typeof message.content !== 'string' && !Array.isArray(message.content)) {
                    images = message.content.images;
                }
            }
            images.forEach((file) => {
                // console.log(file)
                formData.append('images', file);
            });


        }

        if (message.type === 'text' || message.type === 'mixed') {
            let text = '';
            // 如果消息包含文本
            if (message.type === 'text') {
                text = message.content as string;
                formData.append('text', text);
            } else if (message.type === 'mixed') {
                if (typeof message.content !== 'string' && !Array.isArray(message.content)) {
                    text = message.content.text;
                }
                formData.append('text', text);
            }
        }

        // sendToServerViaWebSocket({ type: 'text', content: 'Hello, Server!' });

        
        const service = await import('../../axios');
        const response = await service.default.post(
            '/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


// const handleConnectionChange = () => {
//     console.log('WebSocket 连接状态变化:', isConnected.value);
//   };

//   onMounted(() => {
//     isConnected.value; // 初始连接状态
//     // 监听连接状态变化
//     watchEffect(() => {
//       handleConnectionChange();
//     });
//   });


