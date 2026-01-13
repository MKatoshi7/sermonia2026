import React from 'react';
import { TextToSpeechButton } from './TextToSpeechButton';
import { DictationButton } from './DictationButton';

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    allowAudio?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, multiline = false, rows = 3, allowAudio = true }) => (
    <div className="mb-3 md:mb-6 relative group">
        <div className="flex items-center mb-1.5 md:mb-2.5 ml-0.5 md:ml-1">
            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
            {allowAudio && value && <TextToSpeechButton text={value} />}
        </div>

        <DictationButton onResult={(text) => {
            // Adiciona espaço se já houver texto
            const newValue = value ? `${value} ${text}` : text;
            onChange(newValue);
        }} />

        {multiline ? (
            <textarea
                className="w-full p-3 md:p-5 border border-slate-200/60 rounded-xl md:rounded-2xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 md:focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 resize-y text-slate-700 leading-relaxed shadow-sm text-sm md:text-base outline-none"
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        ) : (
            <input
                type="text"
                className="w-full p-3 md:p-5 border border-slate-200/60 rounded-xl md:rounded-2xl bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 md:focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-300 text-slate-700 shadow-sm text-sm md:text-base outline-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        )}
    </div>
);
