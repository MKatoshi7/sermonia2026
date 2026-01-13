import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    theme: string;
    setTheme: (v: string) => void;
    verse: string;
    setVerse: (v: string) => void;
    lens: string;
    setLens: (v: string) => void;
    isGenerating: boolean;
    onGenerate: () => void;
}

export const GeneratorModal: React.FC<Props> = ({
    isOpen, onClose, theme, setTheme, verse, setVerse, lens, setLens, isGenerating, onGenerate
}) => {
    const { t } = useLanguage();
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('sermon.aiGenerator')}>
            <div className="space-y-6">
                {/* Header Box */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100/50 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                                {t('sermon.aiGeneratorDesc')}
                            </p>
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-indigo-100">
                                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                <span className="text-xs font-semibold text-indigo-700">
                                    {t('sermon.aiGeneratorWarning')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tema Central - Large Textarea */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        {t('sermon.themeOrVerse')}
                    </label>
                    <textarea
                        className="w-full p-5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-lg shadow-sm min-h-[160px] resize-none transition-all placeholder:text-slate-300"
                        placeholder={t('sermon.themePlaceholder')}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    />
                </div>

                {/* Lente Teológica */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                        {t('prompts.lens')}
                    </label>
                    <div className="relative">
                        <select
                            className="w-full p-4 pl-5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-white appearance-none shadow-sm font-medium text-slate-700 transition-all cursor-pointer hover:border-indigo-300"
                            value={lens}
                            onChange={(e) => setLens(e.target.value)}
                        >
                            <option value="Evangélica Geral">{t('lenses.evangelical')}</option>
                            <option value="Reformada/Calvinista">{t('lenses.reformed')}</option>
                            <option value="Pentecostal">{t('lenses.pentecostal')}</option>
                            <option value="Histórica/Tradicional">{t('lenses.traditional')}</option>
                            <option value="Contemporânea">{t('lenses.contemporary')}</option>
                            <option value="Expositiva Acadêmica">{t('lenses.expository')}</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="space-y-4">
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className={`
                        w-full py-5 rounded-xl font-bold text-white shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all transform
                        ${isGenerating
                                ? 'bg-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-300 active:scale-[0.98]'
                            }
                    `}
                    >
                        {isGenerating ? (
                            <>
                                <Clock className="w-5 h-5 animate-spin" />
                                <span className="animate-pulse">{t('sermon.generating')}</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                {t('sermon.generateFullSermon')}
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                        {t('sermon.apiKeyWarning')}
                    </p>
                </div>
            </div>
        </Modal>
    );
};
