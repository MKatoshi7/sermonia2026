import React from 'react';
import { X, User, Settings, Mail, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onOpenSettings: () => void;
    onLogout: () => void;
}

export const UserMenuModal: React.FC<UserMenuModalProps> = ({ isOpen, onClose, user, onOpenSettings, onLogout }) => {
    const { t } = useLanguage();
    if (!isOpen) return null;

    const handleSupport = () => {
        window.open('mailto:contato@sermonia.app?subject=Suporte Sermonia', '_blank');
    };

    return (
        <div className="fixed inset-0 z-[85] animate-fadeIn" onClick={onClose}>
            <div
                className="absolute top-20 right-4 bg-white rounded-xl shadow-2xl w-80 overflow-hidden border border-slate-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white p-1 rounded-full shadow-lg mb-3">
                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600">
                                <User className="w-10 h-10" />
                            </div>
                        </div>
                        <h3 className="font-bold text-xl tracking-tight">{user?.name || t('common.user')}</h3>
                        <p className="text-sm text-indigo-100/90 font-medium mt-0.5">{user?.email}</p>
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <button
                        onClick={() => { onOpenSettings(); onClose(); }}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors text-slate-700"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">{t('nav.settings')}</span>
                    </button>

                    <button
                        onClick={handleSupport}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors text-slate-700"
                    >
                        <Mail className="w-5 h-5" />
                        <span className="font-medium">{t('common.support')}</span>
                    </button>

                    <div className="pt-2 border-t border-slate-200">
                        <button
                            onClick={() => { onLogout(); onClose(); }}
                            className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">{t('nav.logout')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
