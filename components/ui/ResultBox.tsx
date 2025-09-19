
import React from 'react';
import { Loader, Clipboard, Check } from './Icons';

interface ResultBoxProps {
    title: string;
    content: string;
    isLoading: boolean;
    isCopied: boolean;
    setCopied: (isCopied: boolean) => void;
}

export const ResultBox: React.FC<ResultBoxProps> = ({ title, content, isLoading, isCopied, setCopied }) => {
    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Không thể sao chép:', err);
        });
    };

    return (
        <div className="relative flex-1 flex flex-col bg-slate-900/70 rounded-lg border border-slate-700 p-4 min-h-[200px]">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-cyan-300">{title}</h4>
                <button onClick={handleCopy} disabled={!content} className="p-2 rounded-md hover:bg-slate-700 disabled:opacity-50" title="Copy">
                    {isCopied ? <Check size={16} className="text-green-400" /> : <Clipboard size={16} className="text-gray-400" />}
                </button>
            </div>
            <div className="flex-grow w-full bg-transparent text-gray-300 text-sm whitespace-pre-wrap overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader className="animate-spin text-cyan-500" />
                    </div>
                ) : (
                    content || <span className="text-gray-500">Kết quả sẽ hiển thị tại đây...</span>
                )}
            </div>
        </div>
    );
};
