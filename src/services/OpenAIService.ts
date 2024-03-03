// import service from 'axios';

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
            images.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });
            // console.log(images[0] instanceof File);
            // console.log(formData.get('images[0]'));
            // console.log(formData.get('images[0]') instanceof File);
            // console.dir(formData.get('images[0]'), { depth: null });

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