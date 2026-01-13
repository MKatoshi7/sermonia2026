import React from 'react';
import { SermonData, SermonPoint } from '@/types/sermon';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface Props {
    sermon: SermonData;
    onUpdate: (field: keyof SermonData, value: any) => void;
    onPointUpdate: (id: number, field: keyof SermonPoint, value: string) => void;
    onAddPoint: () => void;
    onRemovePoint: (id: number) => void;
}

export const SermonBlockEditor: React.FC<Props> = ({
    sermon,
    onUpdate,
    onPointUpdate,
    onAddPoint,
    onRemovePoint
}) => {

    // Helper to auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    return (
        <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-2xl p-[20mm] my-8 rounded-sm transition-all duration-300 ease-in-out">

            {/* Header Block */}
            <div className="mb-12 group">
                <input
                    type="text"
                    value={sermon.title}
                    onChange={(e) => onUpdate('title', e.target.value)}
                    placeholder="Título do Sermão"
                    className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none bg-transparent"
                />
                <div className="flex gap-4 mt-4 text-sm text-slate-500">
                    <input
                        type="date"
                        value={sermon.date}
                        onChange={(e) => onUpdate('date', e.target.value)}
                        className="bg-slate-50 px-2 py-1 rounded hover:bg-slate-100 outline-none cursor-pointer"
                    />
                    <input
                        type="text"
                        value={sermon.theme}
                        onChange={(e) => onUpdate('theme', e.target.value)}
                        placeholder="Tema / Série"
                        className="bg-slate-50 px-2 py-1 rounded hover:bg-slate-100 outline-none min-w-[200px]"
                    />
                </div>
            </div>

            {/* Main Verse Block */}
            <div className="mb-12 p-6 bg-slate-50 rounded-lg border-l-4 border-indigo-500 group hover:bg-slate-100 transition-colors">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Texto Base</span>
                </div>
                <textarea
                    value={sermon.mainVerseText}
                    onChange={(e) => { onUpdate('mainVerseText', e.target.value); handleInput(e); }}
                    placeholder="Digite o texto bíblico aqui..."
                    className="w-full bg-transparent border-none outline-none text-lg italic text-slate-700 resize-none overflow-hidden placeholder:text-slate-300"
                    rows={2}
                />
                <input
                    type="text"
                    value={sermon.mainVerse}
                    onChange={(e) => onUpdate('mainVerse', e.target.value)}
                    placeholder="Referência (ex: João 3:16)"
                    className="w-full text-right font-bold text-indigo-600 bg-transparent border-none outline-none mt-2 placeholder:text-indigo-300/50"
                />
            </div>

            {/* Objective Block */}
            <Block
                label="Objetivo da Mensagem"
                value={sermon.objective}
                onChange={(v) => onUpdate('objective', v)}
                placeholder="Qual o objetivo central desta mensagem?"
            />

            <Divider label="I. Introdução" />

            <Block
                label="Abertura / Quebra-Gelo"
                value={sermon.introOpening}
                onChange={(v) => onUpdate('introOpening', v)}
                placeholder="Comece com uma história, pergunta ou afirmação impactante..."
            />
            <Block
                label="Contexto"
                value={sermon.introContext}
                onChange={(v) => onUpdate('introContext', v)}
                placeholder="Contextualize o texto bíblico ou o tema..."
            />
            <Block
                label="Gancho"
                value={sermon.introHook}
                onChange={(v) => onUpdate('introHook', v)}
                placeholder="Faça a conexão com o tema principal..."
            />

            <Divider label="II. Exposição Bíblica" />

            <Block
                label="Contexto Histórico"
                value={sermon.expoHistorical}
                onChange={(v) => onUpdate('expoHistorical', v)}
            />
            <Block
                label="Contexto Cultural"
                value={sermon.expoCultural}
                onChange={(v) => onUpdate('expoCultural', v)}
            />
            <Block
                label="Análise do Texto"
                value={sermon.expoAnalysis}
                onChange={(v) => onUpdate('expoAnalysis', v)}
                multiline
            />

            <Divider label="III. Pontos Principais" />

            <div className="space-y-6">
                {sermon.points.map((point, index) => (
                    <div key={point.id} className="group relative pl-8 border-l-2 border-slate-200 hover:border-indigo-300 transition-colors">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 group-hover:bg-indigo-500 transition-colors flex items-center justify-center text-[10px] text-white font-bold">
                            {index + 1}
                        </div>

                        <div className="mb-2 flex items-center gap-2">
                            <input
                                type="text"
                                value={point.title}
                                onChange={(e) => onPointUpdate(point.id, 'title', e.target.value)}
                                placeholder={`Título do Ponto ${index + 1}`}
                                className="text-xl font-bold text-slate-800 bg-transparent border-none outline-none w-full placeholder:text-slate-300"
                            />
                            <button
                                onClick={() => onRemovePoint(point.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                                title="Remover ponto"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <textarea
                            value={point.content}
                            onChange={(e) => { onPointUpdate(point.id, 'content', e.target.value); handleInput(e); }}
                            placeholder="Desenvolvimento do ponto..."
                            className="w-full bg-transparent border-none outline-none text-slate-600 resize-none overflow-hidden placeholder:text-slate-300 leading-relaxed"
                            rows={3}
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={onAddPoint}
                className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
                <Plus className="w-4 h-4" /> Adicionar Ponto
            </button>

            <Divider label="IV. Aplicação e Conclusão" />

            <div className="grid grid-cols-2 gap-8">
                <Block label="Aplicação Pessoal" value={sermon.appPersonal} onChange={(v) => onUpdate('appPersonal', v)} />
                <Block label="Aplicação Familiar" value={sermon.appFamily} onChange={(v) => onUpdate('appFamily', v)} />
                <Block label="Aplicação na Igreja" value={sermon.appChurch} onChange={(v) => onUpdate('appChurch', v)} />
                <Block label="Aplicação na Sociedade" value={sermon.appSociety} onChange={(v) => onUpdate('appSociety', v)} />
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
                <Block
                    label="Resumo Final"
                    value={sermon.concSummary}
                    onChange={(v) => onUpdate('concSummary', v)}
                />
                <Block
                    label="Apelo (Chamada para Ação)"
                    value={sermon.concAction}
                    onChange={(v) => onUpdate('concAction', v)}
                />
                <Block
                    label="Oração Final"
                    value={sermon.concPrayer}
                    onChange={(v) => onUpdate('concPrayer', v)}
                />
            </div>

        </div>
    );
};

const Block = ({ label, value, onChange, placeholder, multiline = false }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string, multiline?: boolean }) => {
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    return (
        <div className="mb-6 group hover:bg-slate-50/50 p-2 -ml-2 rounded-lg transition-colors">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 opacity-50 group-hover:opacity-100 transition-opacity select-none">{label}</label>
            <textarea
                value={value}
                onChange={(e) => { onChange(e.target.value); handleInput(e); }}
                placeholder={placeholder}
                className="w-full bg-transparent border-none outline-none text-slate-700 resize-none overflow-hidden placeholder:text-slate-300 leading-relaxed"
                rows={1}
            />
        </div>
    );
};

const Divider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 my-12">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="h-px bg-slate-200 flex-1"></div>
    </div>
);
