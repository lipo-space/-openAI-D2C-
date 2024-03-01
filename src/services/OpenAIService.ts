import axios from 'axios';

export async function sendToServer(message: { type: string; content: string | File[]; }): Promise<any> {
    try {
        let formData = new FormData();

        if (message.type === 'image' || message.type === 'mixed') {
            // 如果消息包含图片
            let images = message.content as File[];
            images.forEach((file, index) => {
                formData.append('images', file);
            });
        }

        if (message.type === 'text' || message.type === 'mixed') {
            // 如果消息包含文本
            let text = message.content as string;
            formData.append('text', text);
        }

        const response = await axios.post(
            'https://localhost:3000/upload',
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