
import React, { useState, useEffect } from 'react';
import type { ImageData } from '../../types';
import { InputField } from '../ui/FormControls';
import { Loader, Download, X } from '../ui/Icons';
import { generateText, generateImage, segmentContentForImages } from '../../services/geminiService';

interface CreateImageComponentProps {
    initialContent: string;
    imageData: ImageData[];
    setImageData: React.Dispatch<React.SetStateAction<ImageData[]>>;
    segments: string[];
    setSegments: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CreateImageComponent: React.FC<CreateImageComponentProps> = ({ initialContent, imageData, setImageData, segments, setSegments }) => {
    const [customStyle, setCustomStyle] = useState('Hoạt hình 3D');
    const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const predefinedStyles = ['Hoạt hình 3D', 'Ảnh chụp nghệ thuật', 'Vector Art', 'Cyberpunk', 'Tranh màu nước'];

    useEffect(() => {
        if (initialContent && segments.length === 0) {
            const processContent = async () => {
                try {
                    const parsedSegments = await segmentContentForImages(initialContent);
                    setSegments(parsedSegments);
                    setImageData(parsedSegments.map(seg => ({ segmentText: seg, imageUrl: null, isLoading: false, regenPrompt: '' })));
                } catch (e: any) {
                    setError("Không thể tự động chia đoạn. Vui lòng kiểm tra nội dung hoặc API key.");
                    console.error(e);
                }
            };
            processContent();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialContent]);

    const handleGenerateImage = async (index: number, isRegen = false) => {
        setImageData(prev => prev.map((item, i) => i === index ? { ...item, isLoading: true } : item));
        setError('');
        try {
            const baseText = imageData[index].segmentText;
            const modification = isRegen ? imageData[index].regenPrompt : '';
            const promptGenSystem = "You are an expert in creating visual prompts. Read the Vietnamese text and any modification request, then create a concise, descriptive, artistic prompt in ENGLISH for an image AI.";
            const promptGenUser = `Text: "${baseText}". Modification: "${modification}". Create an English image prompt.`;
            const imagePrompt = await generateText(promptGenSystem, promptGenUser);
            
            const finalPrompt = `${imagePrompt}, ${customStyle}, cinematic lighting, high detail, for education technology`;
            const generatedImageUrl = await generateImage(finalPrompt);
            setImageData(prev => prev.map((item, i) => i === index ? { ...item, imageUrl: generatedImageUrl, isLoading: false } : item));
        } catch (e: any) { 
            setError(e.message); 
            setImageData(prev => prev.map((item, i) => i === index ? { ...item, isLoading: false } : item));
        }
    };
    
    const generateAll = () => { segments.forEach((_, index) => { setTimeout(() => handleGenerateImage(index), index * 500); }); };
    const handleRegenPromptChange = (index: number, value: string) => { const newData = [...imageData]; newData[index].regenPrompt = value; setImageData(newData); };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {viewingImageUrl && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setViewingImageUrl(null)}>
                    <img src={viewingImageUrl} alt="Xem ảnh lớn" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
                    <button className="absolute top-4 right-4 text-white hover:text-cyan-400 transition-colors"><X size={32} /></button>
                </div>
            )}
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-300 border-l-4 border-cyan-400 pl-3">3. Tạo Ảnh Minh Họa</h3>
                <InputField label="Phong cách ảnh chung (nhập tùy chỉnh):" value={customStyle} onChange={e => setCustomStyle(e.target.value)} />
                <div className="flex flex-wrap gap-2 text-xs">{predefinedStyles.map(s => <button key={s} onClick={() => setCustomStyle(s)} className={`px-2 py-1 rounded-md transition-colors ${customStyle === s ? 'bg-cyan-600' : 'bg-slate-700 hover:bg-slate-600'}`}>{s}</button>)}</div>
                <button onClick={generateAll} disabled={segments.length === 0 || imageData.some(d => d.isLoading)} className="w-full py-2 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-500 disabled:bg-slate-600">Tạo tất cả ảnh cùng lúc</button>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                    {segments.length > 0 ? segments.map((seg, index) => (
                        <div key={index} className="bg-slate-900/50 p-3 rounded-md">
                            <p className="text-sm text-gray-300 mb-2">Đoạn {index + 1}:</p>
                            <p className="text-xs text-gray-400 mb-2 border-l-2 border-cyan-500 pl-2"><em>"{seg}"</em></p>
                            <button onClick={() => handleGenerateImage(index)} disabled={imageData[index]?.isLoading} className="text-xs py-1 px-2 bg-cyan-700 rounded-md hover:bg-cyan-600 disabled:bg-slate-600 flex items-center justify-center w-32">
                                {imageData[index]?.isLoading ? <Loader className="animate-spin" size={14} /> : `Tạo ảnh đoạn ${index + 1}`}
                            </button>
                        </div>
                    )) : <p className="text-sm text-gray-500">Không có nội dung để tạo ảnh. Vui lòng quay lại tab trước.</p>}
                </div>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {imageData.map((data, index) => (
                    <div key={index} className="bg-slate-900/50 p-2 rounded-lg flex flex-col gap-2 items-center justify-center aspect-square">
                        {data.isLoading ? <Loader className="animate-spin text-cyan-400" /> : data.imageUrl ? (
                            <>
                                <img src={data.imageUrl} alt={`Ảnh cho đoạn ${index+1}`} onClick={() => setViewingImageUrl(data.imageUrl)} className="w-full h-auto object-cover rounded-md cursor-pointer" />
                                <div className="w-full flex flex-col gap-2 text-xs">
                                    <input type="text" placeholder="Chỉnh sửa (VD: thêm giáo viên)..." value={data.regenPrompt} onChange={e => handleRegenPromptChange(index, e.target.value)} className="w-full bg-slate-800 border-slate-600 rounded px-2 py-1 text-xs" />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleGenerateImage(index, true)} className="flex-1 py-1 bg-cyan-800 rounded hover:bg-cyan-700">Tạo lại</button>
                                        <a href={data.imageUrl} download={`eta-image-${index+1}.png`} className="p-1 bg-gray-600 rounded hover:bg-gray-500"><Download size={16} /></a>
                                    </div>
                                </div>
                            </>
                        ) : <span className="text-gray-600 text-xs">Ảnh {index+1}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};
