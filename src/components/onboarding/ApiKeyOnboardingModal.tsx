import React, { useState } from 'react';
import { X, Key, CheckCircle, ExternalLink, AlertCircle, Shield, Zap, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ApiKeyOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
}

export const ApiKeyOnboardingModal: React.FC<ApiKeyOnboardingModalProps> = ({ isOpen, onClose, token }) => {
    const { t } = useLanguage();
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!apiKey.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/user/api-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ apiKey: apiKey.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to save API key');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            setError(t('onboarding.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Key className="w-32 h-32 transform rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Key className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">{t('onboarding.title')}</h2>
                        </div>
                        <p className="text-indigo-100 max-w-lg">
                            {t('onboarding.welcome')}
                        </p>
                    </div>
                </div>

                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('onboarding.success')}</h3>
                            <p className="text-gray-500">Configurando seu ambiente...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column: Benefits */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                                        {t('onboarding.whyKey')}
                                    </h3>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="p-1.5 bg-indigo-50 rounded-full mt-0.5">
                                                <Zap className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <span className="text-sm text-gray-600">{t('onboarding.benefit1')}</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="p-1.5 bg-purple-50 rounded-full mt-0.5">
                                                <Shield className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <span className="text-sm text-gray-600">{t('onboarding.benefit2')}</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="p-1.5 bg-green-50 rounded-full mt-0.5">
                                                <Gift className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-sm text-gray-600">{t('onboarding.benefit3')}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full bg-white text-indigo-600 font-semibold py-3 px-4 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm hover:shadow"
                                    >
                                        {t('onboarding.accessButton')}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Right Column: Steps & Input */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                                        {t('onboarding.howTo')}
                                    </h3>
                                    <ol className="space-y-3 relative border-l-2 border-gray-100 ml-2">
                                        <li className="ml-6 relative">
                                            <span className="absolute -left-[29px] top-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                            <p className="text-sm text-gray-600">{t('onboarding.step1')}</p>
                                        </li>
                                        <li className="ml-6 relative">
                                            <span className="absolute -left-[29px] top-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                            <p className="text-sm text-gray-600">{t('onboarding.step2')}</p>
                                        </li>
                                        <li className="ml-6 relative">
                                            <span className="absolute -left-[29px] top-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                            <p className="text-sm text-gray-600">{t('onboarding.step3')}</p>
                                        </li>
                                        <li className="ml-6 relative">
                                            <span className="absolute -left-[29px] top-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                            <p className="text-sm text-gray-600">{t('onboarding.step4')}</p>
                                        </li>
                                    </ol>
                                </div>

                                <div className="space-y-3 pt-2 border-t border-gray-100">
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder={t('onboarding.placeholder')}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading || !apiKey.trim()}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                {t('onboarding.saving')}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                {t('onboarding.save')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
