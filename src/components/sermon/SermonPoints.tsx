import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SectionBox } from '../ui/SectionBox';
import { InputField } from '../ui/InputField';
import { SermonData, SermonPoint } from '@/types/sermon';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    sermon: SermonData;
    isOpen: boolean;
    toggle: () => void;
    onPointUpdate: (id: number, field: keyof SermonPoint, value: string) => void;
    onAddPoint: () => void;
    onRemovePoint: (id: number) => void;
}

export const SermonPoints: React.FC<Props> = ({ sermon, isOpen, toggle, onPointUpdate, onAddPoint, onRemovePoint }) => {
    const { t } = useLanguage();
    return (
        <SectionBox title={t('sermon.points')} isOpen={isOpen} toggle={toggle} icon={Plus}>
            <div className="animate-fadeIn">
                <div className="space-y-8">
                    {sermon.points.map((point, index) => (
                        <div key={point.id} className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/60 shadow-sm relative group hover:bg-white transition-colors duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-wider">Ponto {index + 1}</h4>
                                <button onClick={() => onRemovePoint(point.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"><Trash2 className="w-5 h-5" /></button>
                            </div>
                            <InputField label="Título do Ponto" value={point.title} onChange={(v) => onPointUpdate(point.id, 'title', v)} placeholder="A verdade central deste ponto..." />
                            <InputField label="Conteúdo / Explicação" value={point.content} onChange={(v) => onPointUpdate(point.id, 'content', v)} multiline rows={4} allowAudio={true} />
                        </div>
                    ))}
                </div>
                <button onClick={onAddPoint} className="mt-8 w-full py-5 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-600 font-bold hover:bg-indigo-50 hover:border-indigo-400 transition-all flex items-center justify-center gap-2 group"><Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> {t('sermon.addPoint')}</button>
            </div>
        </SectionBox>
    );
};
