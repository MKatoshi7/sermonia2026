import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'error'
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-12 h-12 text-red-500" />;
            default:
                return <Info className="w-12 h-12 text-blue-500" />;
        }
    };

    const getTitle = () => {
        if (title) return title;
        switch (type) {
            case 'success': return 'Sucesso';
            case 'error': return 'Erro';
            default: return 'Informação';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-gray-50 rounded-full">
                        {getIcon()}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {getTitle()}
                    </h3>

                    <p className="text-gray-600 mb-6">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' :
                                type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' :
                                    'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                            }`}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};
