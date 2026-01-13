import React, { useState } from 'react';
import { X, Sparkles, Loader, Check, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    sermonContent: string;
    onApplyCorrections: (correctedText: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, apiKey, sermonContent, onApplyCorrections }) => {
    const { t } = useLanguage();
    const [reviewing, setReviewing] = useState(false);
    const [suggestions, setSuggestions] = useState<string>('');
    const [correctedText, setCorrectedText] = useState<string>('');

    if (!isOpen) return null;

    const handleReview = async () => {
        if (!apiKey) {
            alert(t('sermon.apiKeyWarning'));
            return;
        }

        setReviewing(true);
        setSuggestions('');
        setCorrectedText('');

        const prompt = `${t('prompts.reviewSystem')}
            
            ${sermonContent}
            
            ${t('prompts.reviewAnalyze')}
            ${t('prompts.reviewCriteria1')}
            ${t('prompts.reviewCriteria2')}
            ${t('prompts.reviewCriteria3')}
            
            ${t('prompts.reviewJson')}
            {
                "correctedText": "${t('prompts.reviewJsonCorrected')}",
                "suggestions": "${t('prompts.reviewJsonSuggestions')}"
            }`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            let text = data.candidates[0].content.parts[0].text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            const result = JSON.parse(text);
            setCorrectedText(result.correctedText);
            setSuggestions(result.suggestions);
        } catch (error: any) {
            alert(`${t('common.error')}: ` + error.message);
        } finally {
            setReviewing(false);
        }
    };

    const handleApply = () => {
        if (correctedText) {
            onApplyCorrections(correctedText);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6" />
                        <h2 className="text-xl font-bold">{t('sermon.aiReview')}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">

                    {/* Mini Session / Explanation */}
                    {!reviewing && !suggestions && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                {t('sermon.aiReviewDesc')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                        <span className="font-bold text-lg">Aa</span>
                                    </div>
                                    <h4 className="font-bold text-slate-700 mb-1">{t('sermon.aiReviewSpelling')}</h4>
                                    <p className="text-xs text-slate-500">{t('sermon.aiReviewSpellingDesc')}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-slate-700 mb-1">{t('sermon.aiReviewClarity')}</h4>
                                    <p className="text-xs text-slate-500">{t('sermon.aiReviewClarityDesc')}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-slate-700 mb-1">{t('sermon.aiReviewTone')}</h4>
                                    <p className="text-xs text-slate-500">{t('sermon.aiReviewToneDesc')}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            onClick={handleReview}
                            disabled={reviewing}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
                        >
                            {reviewing ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" />
                                    <span className="text-lg">{t('sermon.aiReviewing')}</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    <span className="text-lg">{t('sermon.aiReviewStart')}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {suggestions && (
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <h3 className="font-bold text-purple-900 mb-2">{t('sermon.aiReviewSuggestions')}</h3>
                            <p className="text-sm text-purple-800 whitespace-pre-line">{suggestions}</p>
                        </div>
                    )}

                    {correctedText && (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                    <Check className="w-5 h-5" />
                                    {t('sermon.aiReviewCorrected')}
                                </h3>
                                <div className="text-sm text-green-800 whitespace-pre-line max-h-96 overflow-y-auto">
                                    {correctedText}
                                </div>
                            </div>

                            <button
                                onClick={handleApply}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                <span>{t('sermon.aiReviewApply')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
