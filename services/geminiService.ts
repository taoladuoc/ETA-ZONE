
import { GoogleGenAI, Type } from "@google/genai";
import type { CommentStructure } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (systemInstruction: string, userQuery: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userQuery,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text.replace(/[*]/g, '').trim();
    } catch (error) {
        console.error("Error calling Gemini API for text generation:", error);
        throw new Error("Lỗi khi tạo nội dung từ AI. Vui lòng thử lại.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("Không nhận được hình ảnh hợp lệ từ AI.");
    } catch (error) {
        console.error("Error calling Imagen API:", error);
        throw new Error("Lỗi khi tạo hình ảnh từ AI. Vui lòng thử lại.");
    }
};

export const generateStructuredJson = async <T,>(systemInstruction: string, userQuery: string, schema: any): Promise<T> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userQuery,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonStr = response.text.trim().replace(/```json|```/g, '');
        return JSON.parse(jsonStr) as T;
    } catch (error) {
        console.error("Error generating structured JSON from Gemini API:", error);
        throw new Error("Lỗi khi tạo dữ liệu có cấu trúc. AI có thể không trả về đúng định dạng JSON.");
    }
};

export const segmentContentForImages = async (content: string): Promise<string[]> => {
    const systemPrompt = "Phân tích văn bản tiếng Việt sau và chia thành các đoạn văn logic, có ý nghĩa để tạo ảnh. Mỗi đoạn không quá 40 từ. Trả về dưới dạng một mảng JSON của các chuỗi. Ví dụ: [\"Đoạn 1...\", \"Đoạn 2...\"]";
    const schema = {
        type: Type.ARRAY,
        items: { type: Type.STRING },
    };
    return generateStructuredJson<string[]>(systemPrompt, content, schema);
};

export const generateComments = async (postContent: string): Promise<CommentStructure> => {
    const systemPrompt = `Bạn là một AI chuyên gia phân tích dư luận trên mạng xã hội. Nhiệm vụ của Bạn là đọc một bài đăng trên Facebook và tạo ra 4 luồng bình luận khác nhau.
    YÊU CẦU QUAN TRỌNG:
    1. Trả về kết quả dưới dạng một đối tượng JSON hợp lệ.
    2. Đối tượng JSON phải có các khóa sau: "khen", "phanbien", "khongdongtinh", "thacmac".
    3. Giá trị của MỖI khóa phải là một MẢNG chứa chính xác 3 bình luận riêng biệt (3 chuỗi văn bản).
    4. Nội dung của mỗi bình luận phải tự nhiên, giống như người thật viết, có thể sử dụng icon phù hợp.`;
    const userQuery = `Hãy phân tích bài viết sau và tạo bình luận theo yêu cầu:\n\n--- BÀI VIẾT ---\n${postContent}`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            khen: { type: Type.ARRAY, items: { type: Type.STRING } },
            phanbien: { type: Type.ARRAY, items: { type: Type.STRING } },
            khongdongtinh: { type: Type.ARRAY, items: { type: Type.STRING } },
            thacmac: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
    };
    return generateStructuredJson<CommentStructure>(systemPrompt, userQuery, schema);
};
