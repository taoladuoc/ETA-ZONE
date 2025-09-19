
import React from 'react';
import { Loader, Sparkles } from './Icons';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
export const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input {...props} className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
    </div>
);

interface InputFieldWithButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    onButtonClick: () => void;
    isButtonLoading: boolean;
}
export const InputFieldWithButton: React.FC<InputFieldWithButtonProps> = ({ label, name, value, onChange, placeholder, onButtonClick, isButtonLoading }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <div className="relative">
            <input id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 pr-24 text-white" />
            <button onClick={onButtonClick} disabled={isButtonLoading} className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-bold text-cyan-200 bg-slate-700/50 hover:bg-slate-600/50 rounded-r-md disabled:opacity-50">
                <Sparkles size={14} className="mr-1" />
                {isButtonLoading ? <Loader className="animate-spin" size={16}/> : 'Tự động'}
            </button>
        </div>
    </div>
);


interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: string[];
}
export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
            {options.map((option, index) => ( <option key={`${option}-${index}`} value={option}>{option}</option>))}
        </select>
    </div>
);
