import React, { useState } from 'react';
import { X, Image as ImageIcon, Loader, Download, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ImageGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    sermonTitle: string;
    sermonTheme: string;
}

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ isOpen, onClose, apiKey, sermonTitle, sermonTheme }) => {
    const { t } = useLanguage();
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [error, setError] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const generateImage = async () => {
        if (!apiKey) {
            setError(t('sermon.apiKeyWarning'));
            return;
        }

        if (!prompt) {
            setError(t('sermon.imageDescError'));
            return;
        }

        setGenerating(true);
        setError('');
        setImageUrl('');
        setImageLoaded(false);

        try {
            // Fetch pre-prompt
            let prePrompt = '';
            try {
                const res = await fetch('/api/settings/public');
                if (res.ok) {
                    const data = await res.json();
                    prePrompt = data.value;
                }
            } catch (e) {
                console.error('Failed to fetch pre-prompt', e);
            }

            // Criar prompt melhorado em inglês com pre-prompt configurável
            const basePrompt = prePrompt || 'Create a beautiful, inspirational religious image for a sermon titled';
            const enhancedPrompt = `${basePrompt} "${sermonTitle}" with theme "${sermonTheme}". ${prompt}. Style: photorealistic, dramatic lighting, spiritual atmosphere, high quality, professional photography.`;

            // Usando Google Imagen 3 via Gemini API
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{
                            prompt: enhancedPrompt
                        }],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: "4:3",
                            safetyFilterLevel: "block_some",
                            personGeneration: "allow_adult"
                        }
                    })
                }
            );

            if (!response.ok) {
                // Se Imagen não estiver disponível, tentar com Gemini para gerar via texto
                const fallbackResponse = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `Gere uma URL de imagem do Unsplash que corresponda exatamente a esta descrição: ${enhancedPrompt}. 
                                    
Retorne APENAS a URL no formato: https://source.unsplash.com/800x600/?[palavras-chave-em-inglês]

Palavras-chave devem ser específicas e relacionadas ao tema religioso/espiritual descrito.`
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.3,
                                maxOutputTokens: 200
                            }
                        })
                    }
                );

                const fallbackData = await fallbackResponse.json();
                if (fallbackData.error) throw new Error(fallbackData.error.message);

                let generatedUrl = fallbackData.candidates[0].content.parts[0].text.trim();

                // Extrair URL se vier com texto adicional
                const urlMatch = generatedUrl.match(/https:\/\/[^\s]+/);
                if (urlMatch) {
                    generatedUrl = urlMatch[0];
                }

                // Adiciona timestamp para evitar cache
                const timestamp = new Date().getTime();
                setImageUrl(`${generatedUrl}&t=${timestamp}`);

            } else {
                const data = await response.json();
                if (data.error) throw new Error(data.error.message);

                // A resposta do Imagen contém a imagem em base64
                const imageData = data.predictions[0].bytesBase64Encoded;
                const imageDataUrl = `data:image/png;base64,${imageData}`;
                setImageUrl(imageDataUrl);
            }

        } catch (error: any) {
            console.error('Image generation error:', error);
            setError(`${t('sermon.imageError')}: ` + (error.message || t('common.error')));
        } finally {
            setGenerating(false);
        }
    };

    const downloadImage = async () => {
        if (!imageUrl) return;

        try {
            // Busca a imagem
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // Cria URL temporária
            const blobUrl = window.URL.createObjectURL(blob);

            // Download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `sermao-${sermonTitle.slice(0, 30).replace(/\s+/g, '-')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Limpa URL temporária
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            setError(t('sermon.imageError'));
        }
    };

    const copyImageUrl = () => {
        navigator.clipboard.writeText(imageUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-rose-600 to-orange-600 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ImageIcon className="w-6 h-6" />
                        <h2 className="text-xl font-bold">{t('sermon.imageGenerator')}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                    <div className="text-slate-700">
                        <p className="text-sm text-slate-600 mb-2">
                            <strong>{t('sermon.title')}:</strong> {sermonTitle || 'Sem título'}
                        </p>
                        <p className="text-sm text-slate-600 mb-4">
                            <strong>{t('sermon.theme')}:</strong> {sermonTheme || 'Sem tema'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            {t('sermon.imagePrompt')}
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-rose-500 outline-none text-slate-900"
                            placeholder={t('sermon.imagePlaceholder')}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={generateImage}
                        disabled={generating}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {generating ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                <span>{t('sermon.generating')}</span>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-5 h-5" />
                                <span>{t('sermon.generateImage')}</span>
                            </>
                        )}
                    </button>

                    {imageUrl && (
                        <div className="space-y-4">
                            <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                                {!imageLoaded && (
                                    <div className="w-full h-64 flex items-center justify-center">
                                        <Loader className="w-8 h-8 animate-spin text-slate-400" />
                                    </div>
                                )}
                                <img
                                    src={imageUrl}
                                    alt="Imagem gerada"
                                    className={`w-full h-auto ${!imageLoaded ? 'hidden' : 'block'}`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => {
                                        setError(t('sermon.imageError'));
                                        setImageLoaded(false);
                                    }}
                                    crossOrigin="anonymous"
                                />
                            </div>

                            {imageLoaded && (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={downloadImage}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span>{t('sermon.download')}</span>
                                    </button>

                                    <button
                                        onClick={copyImageUrl}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                <span>{t('sermon.copied')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5" />
                                                <span>{t('sermon.copyUrl')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-xs text-slate-500 border-t border-slate-200 pt-4">
                        {t('sermon.imageTip')}
                    </div>
                </div>
            </div>
        </div>
    );
};
