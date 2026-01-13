import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
            <div className={`bg-white rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto relative flex flex-col border border-white/50`}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-8">{children}</div>
            </div>
        </div>
    );
};
