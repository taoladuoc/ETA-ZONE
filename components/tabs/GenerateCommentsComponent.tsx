
import React, { useState } from 'react';
import type { CommentStructure } from '../../types';
import { Loader, Bot, Clipboard, Check } from '../ui/Icons';
import { generateComments } from '../../services/geminiService';

interface CommentResultBoxProps {
    title: string;
    comments: string[];
    isLoading: boolean;
}

const CommentResultBox: React.FC<CommentResultBoxProps> = ({ title, comments, isLoading }) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const handleCopy = (text: string, index: number) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        }).catch(err => {
            console.error('Không thể sao chép:', err);
        });
    };

    return (
        <div className="relative flex flex-col bg-slate-900/70 rounded-lg border border-slate-700 p-3 h-full">
            <h4 className="text-md font-semibold text-cyan-300 mb-2">{title}</h4>
            <div className="flex-grow w-full bg-transparent overflow-y-auto pr-2 custom-scrollbar space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full"><Loader className="animate-spin text-cyan-500" /></div>
                ) : comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="bg-slate-800 p-2 rounded-md flex items-start justify-between gap-2">
                            <p className="text-gray-300 text-sm flex-grow">{comment}</p>
                            <button onClick={() => handleCopy(comment, index)} className="p-1 rounded-md hover:bg-slate-700 flex-shrink-0" title="Copy">
                                {copiedIndex === index ? <Check size={14} className="text-green-400" /> : <Clipboard size={14} className="text-gray-400" />}
                            </button>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-500 text-sm">Chưa có kết quả...</span>
                )}
            </div>
        </div>
    );
};

export const GenerateCommentsComponent: React.FC = () => {
    const [postContent, setPostContent] = useState('');
    const [results, setResults] = useState<CommentStructure>({ praise: [], counter: [], disagree: [], question: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!postContent.trim()) {
            setError("Vui lòng dán nội dung bài viết vào đây.");
            return;
        }
        setIsLoading(true);
        setError('');
        setResults({ praise: [], counter: [], disagree: [], question: [] });

        try {
            const jsonResult = await generateComments(postContent);
            setResults({
                praise: Array.isArray(jsonResult.khen) ? jsonResult.khen : [],
                counter: Array.isArray(jsonResult.phanbien) ? jsonResult.phanbien : [],
                disagree: Array.isArray(jsonResult.khongdongtinh) ? jsonResult.khongdongtinh : [],
                question: Array.isArray(jsonResult.thacmac) ? jsonResult.thacmac : []
            });
        } catch (e: any) {
            setError(`Đã xảy ra lỗi: ${e.message}. AI có thể đã không trả về đúng định dạng JSON. Vui lòng thử lại.`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <h3 className="text-lg font-semibold text-gray-300 border-l-4 border-cyan-400 pl-3">5. Tạo Bình Luận Tự Động</h3>
            <div className="flex flex-col gap-4 flex-grow">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-400 mb-2">Dán toàn bộ nội dung bài viết Facebook vào đây:</label>
                    <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Tính năng đọc bài viết qua Link đang xây dựng, nên bạn vui lòng Copy và Dán nội dung bài đăng Facebook vào đây nhé!." className="w-full h-32 bg-slate-900 border border-slate-600 rounded-md p-3 text-white placeholder-slate-500 custom-scrollbar"/>
                </div>
                 <button onClick={handleSubmit} disabled={isLoading} className="w-full max-w-md mx-auto py-3 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 flex items-center justify-center gap-2 disabled:bg-slate-600">
                    {isLoading ? <Loader className="animate-spin" /> : <Bot />} {isLoading ? 'Đang phân tích...' : 'Tạo Bình Luận'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <CommentResultBox title="Khen & Đồng tình" comments={results.praise} isLoading={isLoading && results.praise.length === 0} />
                    <CommentResultBox title="Phản biện" comments={results.counter} isLoading={isLoading && results.counter.length === 0} />
                    <CommentResultBox title="Không đồng tình" comments={results.disagree} isLoading={isLoading && results.disagree.length === 0} />
                    <CommentResultBox title="Thắc mắc" comments={results.question} isLoading={isLoading && results.question.length === 0} />
                </div>
            </div>
        </div>
    );
};
