
import React, { useState, useEffect } from 'react';
import type { GeneratedTitleData } from '../../types';
import { InputField, SelectField, InputFieldWithButton } from '../ui/FormControls';
import { ResultBox } from '../ui/ResultBox';
import { Loader, Bot, ImageIcon } from '../ui/Icons';
import { generateText } from '../../services/geminiService';

interface WritePostComponentProps {
    generatedData: GeneratedTitleData;
    onPostGenerated: (content: string) => void;
    result: string;
    setResult: (content: string) => void;
}

export const WritePostComponent: React.FC<WritePostComponentProps> = ({ generatedData, onPostGenerated, result, setResult }) => {
    const [formData, setFormData] = useState({ 
        selectedTitle: '', 
        customTitle: '', 
        customStyle: '',
        length: 'Viết ngắn gọn', 
        hashtags: '#Eta #Duoc', 
        addTypos: false,
        includeIcons: true,
        includeHashtags: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isHashtagLoading, setIsHashtagLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (generatedData.titles.length > 0 && !formData.selectedTitle && !formData.customTitle) {
            setFormData(prev => ({...prev, selectedTitle: generatedData.titles[0]}));
        }
    }, [generatedData, formData.selectedTitle, formData.customTitle]);

    const handleAutoHashtag = async () => {
        const activeTitle = formData.customTitle || formData.selectedTitle;
        if (!activeTitle) return;
        setIsHashtagLoading(true);
        const systemPrompt = "Hãy tạo thêm 3-5 hashtag tiếng Việt không dấu, viết liền liên quan nhất cho chủ đề sau. YÊU CẦU: Trả về CHỈ danh sách các hashtag, bắt đầu bằng dấu #, không có lời dẫn.";
        try {
            const tags = await generateText(systemPrompt, activeTitle);
            setFormData(prev => ({...prev, hashtags: `#Eta #Duoc ${tags}`}));
        } catch (e: any) { setError(e.message); } finally { setIsHashtagLoading(false); }
    };

    const handleSubmit = async () => {
        const activeTitle = formData.customTitle || formData.selectedTitle;
        if (!activeTitle) { setError("Vui lòng chọn hoặc nhập tiêu đề."); return; }
        setIsLoading(true); setError('');
        
        let systemPrompt = `Bạn là một chuyên gia sáng tạo nội dung Facebook cho giáo viên. Viết một bài đăng hoàn chỉnh, tập trung vào ứng dụng AI trong giáo dục. Giọng văn gần gũi. Cuối bài có câu hỏi mở. NGHIÊM CẤM dấu sao (*).`;
        
        let userQuery = `Tiêu đề: "${activeTitle}".\nĐộ dài yêu cầu: "${formData.length}".`;
        if (formData.customStyle) userQuery += `\nYêu cầu văn phong: "${formData.customStyle}".`;
        if (formData.includeIcons) userQuery += `\nHãy thêm các icon phù hợp để bài viết sinh động.`;
        if (formData.addTypos) userQuery += `\nQUAN TRỌNG: Hãy cố tình sai chính tả một vài từ một cách tự nhiên để bài viết trông giống người thật viết.`;
        if (formData.includeHashtags) userQuery += `\nHãy tự động thêm các hashtags sau vào cuối bài viết: "${formData.hashtags}"`;

        try {
            const content = await generateText(systemPrompt, userQuery);
            setResult(content);
        } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1 flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-300 border-l-4 border-cyan-400 pl-3">2. Viết Bài Đăng</h3>
                {generatedData.titles.length > 0 && ( <SelectField label="Chọn tiêu đề đã tạo:" name="selectedTitle" value={formData.selectedTitle} onChange={(e) => setFormData({...formData, selectedTitle: e.target.value, customTitle: ''})} options={['', ...generatedData.titles]} /> )}
                <InputField label="Hoặc nhập tiêu đề tùy chỉnh:" name="customTitle" value={formData.customTitle} onChange={(e) => setFormData({...formData, customTitle: e.target.value, selectedTitle: ''})} />
                <InputField label="Tùy chỉnh văn phong:" name="customStyle" value={formData.customStyle} onChange={(e) => setFormData({...formData, customStyle: e.target.value})} placeholder="VD: Viết như chuyên gia, học thuật..." />
                <SelectField label="Độ dài:" name="length" value={formData.length} onChange={(e) => setFormData({...formData, length: e.target.value})} options={['Viết ngắn gọn', 'Viết dài', 'Viết vô cùng ngắn gọn']} />
                <InputFieldWithButton label="Hashtags:" name="hashtags" value={formData.hashtags} onChange={(e) => setFormData({...formData, hashtags: e.target.value})} onButtonClick={handleAutoHashtag} isButtonLoading={isHashtagLoading} />
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><input type="checkbox" id="includeIcons" checked={formData.includeIcons} onChange={(e) => setFormData({...formData, includeIcons: e.target.checked})} className="h-4 w-4 rounded bg-slate-700 text-cyan-500 focus:ring-cyan-600" /><label htmlFor="includeIcons">ICON trong bài viết</label></div>
                    <div className="flex items-center gap-2"><input type="checkbox" id="includeHashtags" checked={formData.includeHashtags} onChange={(e) => setFormData({...formData, includeHashtags: e.target.checked})} className="h-4 w-4 rounded bg-slate-700 text-cyan-500 focus:ring-cyan-600" /><label htmlFor="includeHashtags">Hashtag trong bài viết</label></div>
                    <div className="flex items-center gap-2"><input type="checkbox" id="addTypos" checked={formData.addTypos} onChange={(e) => setFormData({...formData, addTypos: e.target.checked})} className="h-4 w-4 rounded bg-slate-700 text-cyan-500 focus:ring-cyan-600" /><label htmlFor="addTypos">Cố tình sai chính tả</label></div>
                </div>

                <button onClick={handleSubmit} disabled={isLoading || !(formData.customTitle || formData.selectedTitle)} className="w-full mt-4 py-3 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 flex items-center justify-center gap-2 disabled:bg-slate-600">
                    {isLoading ? <Loader className="animate-spin" /> : <Bot />} {isLoading ? 'Đang viết...' : 'Viết Bài'}
                </button>
                {result && <button onClick={() => onPostGenerated(result)} className="w-full py-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-500 flex items-center justify-center gap-2"><ImageIcon /> Tạo ảnh cho bài viết này</button>}
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
            </div>
            <div className="lg:col-span-2 flex flex-col"><ResultBox title="Nội dung bài đăng:" content={result} isLoading={isLoading} setCopied={setCopied} isCopied={copied} /></div>
        </div>
    );
};
