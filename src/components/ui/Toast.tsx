import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-24 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl transform transition-all animate-slideIn backdrop-blur-md ${type === 'error' ? 'bg-red-50/90 text-red-700 border border-red-100' : 'bg-emerald-50/90 text-emerald-700 border border-emerald-100'
            }`}>
            {type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            <span className="font-medium text-sm">{message}</span>
        </div>
    );
};
