import axios from 'axios';

// const apiKey = 'YOUR_OPENAI_API_KEY';

export async function getImageToCode(imageData: File): Promise<File> {
    try {
        const response = await axios.post(
            'https://localhost:3000/upload',
            {
                data: imageData,
            
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        return response.data.code;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
}

export async function sendToserver(textData: string): Promise<string> {
    try {
        const response = await axios.post(
            'https://localhost:3000/upload',
            {
                data: textData,
            
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        return response.data.code;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
}