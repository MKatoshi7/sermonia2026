import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface DictationButtonProps {
    onResult: (text: string) => void;
}

export const DictationButton: React.FC<DictationButtonProps> = ({ onResult }) => {
    const [isListening, setIsListening] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognitionRef = useRef<any>(null);
    const onResultRef = useRef(onResult); // Referência estável para o callback

    // Atualiza a referência se a função mudar, sem quebrar o ciclo
    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false; // Grava uma frase por vez para evitar erros de rede
            recognition.lang = 'pt-BR';
            recognition.interimResults = false;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onresult = (event: any) => {
                const text = event.results[0][0].transcript;
                if (onResultRef.current) {
                    onResultRef.current(text);
                }
                setIsListening(false);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recognition.onerror = (event: any) => {
                console.error("Erro voz:", event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []); // Executa apenas na montagem

    const toggleListening = () => {
        if (!recognitionRef.current) { alert("Navegador sem suporte a voz."); return; }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Erro ao iniciar ditado:", err);
                setIsListening(false);
            }
        }
    };

    return (
        <button onClick={toggleListening} className={`absolute right-3 top-10 p-2.5 rounded-xl transition-all duration-300 shadow-sm z-10 ${isListening ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200' : 'bg-white/80 text-slate-400 hover:text-indigo-600 hover:bg-white backdrop-blur-sm border border-slate-100'}`} title="Ditado">
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
    );
};
