import React from 'react';
import { HelpCircle, MessageCircle, Settings as SettingsIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    setApiKey: (key: string) => void;
    onSave: () => void;
}

export const ConfigModal: React.FC<Props> = ({ isOpen, onClose, apiKey, setApiKey, onSave }) => {
    const { t } = useLanguage();
    const handleWhatsAppSupport = () => {
        // Número do WhatsApp (ajuste para o seu número)
        const phoneNumber = '5511956705005'; // Atualizado para o número solicitado
        const message = encodeURIComponent('Olá! Preciso de ajuda com o Sermonia.');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('config.title')}>
            <div className="space-y-6">
                {/* Seção API Key */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <SettingsIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="font-bold text-gray-900">{t('config.apiSection')}</h3>
                    </div>

                    <div className="bg-indigo-50/80 p-6 rounded-2xl border border-indigo-100 mb-4">
                        <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-3">
                            <HelpCircle className="w-5 h-5" /> {t('config.howTo')}
                        </h4>
                        <ol className="list-decimal list-inside text-sm text-indigo-800 space-y-2">
                            <li>
                                {t('config.step1')}{' '}
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline font-bold hover:text-indigo-600"
                                >
                                    Google AI Studio
                                </a>
                                .
                            </li>
                            <li>{t('config.step2')}</li>
                            <li>{t('config.step3')}</li>
                        </ol>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            {t('config.label')}
                        </label>
                        <input
                            type="password"
                            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400"
                            placeholder={t('config.placeholder')}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={onSave}
                        className="w-full mt-4 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all"
                    >
                        {t('config.save')}
                    </button>
                </div>

                {/* Divisor */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Seção Suporte */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-gray-900">{t('config.supportTitle')}</h3>
                    </div>

                    <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                        <p className="text-sm text-gray-700 mb-4">
                            {t('config.supportDesc')}
                        </p>
                        <button
                            onClick={handleWhatsAppSupport}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                        >
                            <MessageCircle className="w-5 h-5" />
                            {t('config.whatsapp')}
                        </button>
                    </div>
                </div>

                {/* Info adicional */}
                <div className="text-xs text-gray-500 text-center">
                    {t('config.disclaimer')}
                </div>
            </div>
        </Modal>
    );
};
