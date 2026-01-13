import React, { useState } from 'react';
import { StopCircle, Volume2 } from 'lucide-react';

interface TextToSpeechButtonProps {
    text: string;
}

export const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ text }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = () => {
        if (typeof window === 'undefined' || !text) return;

        const synth = window.speechSynthesis;

        if (isSpeaking) {
            synth.cancel();
            setIsSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);

        synth.speak(utterance);
        setIsSpeaking(true);
    };

    return (
        <button onClick={handleSpeak} className={`p-1.5 rounded-full transition-all duration-300 ml-2 ${isSpeaking ? 'bg-indigo-100 text-indigo-600 animate-pulse' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`} title={isSpeaking ? "Parar" : "Ouvir"}>
            {isSpeaking ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
    );
};
