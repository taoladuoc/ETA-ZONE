
import React, { useState, useEffect } from 'react';
import { ResultBox } from '../ui/ResultBox';
import { Loader, RefreshCw, ImageIcon } from '../ui/Icons';
import { generateText } from '../../services/geminiService';

interface RewritePostComponentProps {
    onPostGenerated: (content: string) => void;
    initialAiPost: string;
    result: string;
    setResult: (content: string) => void;
}

export const RewritePostComponent: React.FC<RewritePostComponentProps> = ({ onPostGenerated, initialAiPost, result, setResult }) => {
    const [humanStylePost, setHumanStylePost] = useState('');
    const [aiPost, setAiPost] = useState(initialAiPost || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => { 
        if(initialAiPost) { setAiPost(initialAiPost); } 
    }, [initialAiPost]);

    const handleSubmit = async () => {
        if (!humanStylePost.trim() || !aiPost.trim()) {
            setError("Vui lòng nhập đủ cả hai bài viết mẫu và bài viết cần viết lại.");
            return;
        }
        setIsLoading(true);
        setError('');
        setResult('');
        const systemPrompt = "Bạn là một AI chuyên gia về phân tích và tái tạo văn phong. Nhiệm vụ của Bạn là học theo cách hành văn, giọng điệu, và cấu trúc câu từ một văn bản mẫu (do người thật viết), sau đó áp dụng chính xác văn phong đó để viết lại một văn bản khác (do AI viết). Kết quả cuối cùng phải giữ được nội dung cốt lõi của văn bản gốc nhưng mang đậm dấu ấn phong cách của văn bản mẫu.";
        const userQuery = `Dưới đây là 2 phần văn bản:\n\n### PHẦN 1: VĂN BẢN ĐỂ HỌC VĂN PHONG\n---\n${humanStylePost}\n---\n\n### PHẦN 2: BÀI VIẾT CỦA AI CẦN VIẾT LẠI\n---\n${aiPost}\n---\n\n### MỆNH LỆNH:\nHãy viết lại nội dung của PHẦN 2 sao cho nó có văn phong, giọng điệu, cách dùng từ và icon giống hệt như PHẦN 1. Giữ nguyên ý nghĩa chính.`;
        
        try {
            const content = await generateText(systemPrompt, userQuery);
            setResult(content);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <h3 className="text-lg font-semibold text-gray-300 border-l-4 border-cyan-400 pl-3">4. Viết Lại Bài Theo Văn Phong</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-[50vh]">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col flex-1 h-1/2">
                        <label className="text-sm font-medium text-gray-400 mb-2">1. Dán bài viết của người thật (Để AI học văn phong):</label>
                        <textarea value={humanStylePost} onChange={(e) => setHumanStylePost(e.target.value)} placeholder="Ví dụ: Hello cả nhà, nay Được share mọi người một tip hay ho lắm nè..." className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-white placeholder-slate-500 custom-scrollbar" />
                    </div>
                    <div className="flex flex-col flex-1 h-1/2">
                        <label className="text-sm font-medium text-gray-400 mb-2">2. Dán bài viết của AI (Bài viết cần được viết lại):</label>
                         <textarea value={aiPost} onChange={(e) => setAiPost(e.target.value)} placeholder="Nội dung đã tạo từ mục 'Viết Bài Đăng' sẽ tự động xuất hiện ở đây..." className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-white placeholder-slate-500 custom-scrollbar" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <ResultBox title="3. Kết quả (Đã học văn phong):" content={result} isLoading={isLoading} setCopied={setCopied} isCopied={copied} />
                </div>
            </div>
             <div className="flex-shrink-0 mt-4 flex flex-col items-center gap-4">
                 <button onClick={handleSubmit} disabled={isLoading} className="w-full max-w-md py-3 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 flex items-center justify-center gap-2 disabled:bg-slate-600">
                    {isLoading ? <Loader className="animate-spin" /> : <RefreshCw />} {isLoading ? 'Đang phân tích...' : 'Viết Lại Theo Văn Phong'}
                </button>
                 {result && ( <button onClick={() => onPostGenerated(result)} className="w-full max-w-md py-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-500 flex items-center justify-center gap-2"><ImageIcon /> Tạo ảnh cho bài viết này</button> )}
                 {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>
        </div>
    );
};
