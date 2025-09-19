
import React, { useState } from 'react';
import { InputField, SelectField } from '../ui/FormControls';
import { ResultBox } from '../ui/ResultBox';
import { Loader, Bot } from '../ui/Icons';
import { generateText } from '../../services/geminiService';
import type { GeneratedTitleData } from '../../types';

interface CreateTitleComponentProps {
    onTitlesGenerated: (data: GeneratedTitleData) => void;
    result: string;
}

export const CreateTitleComponent: React.FC<CreateTitleComponentProps> = ({ onTitlesGenerated, result }) => {
    const [formData, setFormData] = useState({ mainTopic: 'Ứng dụng AI trong việc chấm bài tự luận', approach: 'Gây tò mò', count: 5 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    
    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        const systemPrompt = "Bạn là một chuyên gia tạo tiêu đề Facebook cho giáo viên. Hãy tạo ra các tiêu đề ngắn gọn, hấp dẫn, tập trung vào giáo dục và AI. YÊU CẦU: Trả về CHỈ danh sách các tiêu đề, mỗi tiêu đề trên một dòng. TUYỆT ĐỐI KHÔNG thêm bất kỳ lời chào, giải thích, hay ký tự định dạng nào (như * -).";
        const userQuery = `Chủ đề: "${formData.mainTopic}". Hướng khai thác: "${formData.approach}". Số lượng: ${formData.count}.`;
        
        try {
            const titlesText = await generateText(systemPrompt, userQuery);
            onTitlesGenerated({ titles: titlesText.split('\n').filter(t => t.trim() !== ''), mainTopic: formData.mainTopic });
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-300 border-l-4 border-cyan-400 pl-3">1. Tạo Tiêu Đề Bài Viết</h3>
                <InputField label="Chủ đề chính:" name="mainTopic" value={formData.mainTopic} onChange={(e) => setFormData({...formData, mainTopic: e.target.value})} />
                <SelectField label="Hướng khai thác tiêu đề:" name="approach" value={formData.approach} onChange={(e) => setFormData({...formData, approach: e.target.value})} options={['Gây tò mò', 'Dạng câu hỏi', 'Dạng danh sách (Top X)', 'Chia sẻ trực tiếp']} />
                <InputField label="Số lượng tiêu đề:" name="count" type="number" min="1" value={formData.count} onChange={(e) => setFormData({...formData, count: Number(e.target.value)})} />
                <button onClick={handleSubmit} disabled={isLoading} className="w-full mt-4 py-3 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 disabled:bg-slate-600 flex items-center justify-center gap-2">
                    {isLoading ? <Loader className="animate-spin" size={20} /> : <Bot size={20} />} {isLoading ? 'Đang nghĩ...' : 'Tạo Tiêu Đề'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>
            <div className="lg:col-span-1 flex flex-col">
                <ResultBox title="Tiêu đề đã tạo:" content={result} isLoading={isLoading} setCopied={setCopied} isCopied={copied} />
            </div>
        </div>
    );
};
