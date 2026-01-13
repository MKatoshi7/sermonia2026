import React from 'react';
import { Layers } from 'lucide-react';
import { SectionBox } from '../ui/SectionBox';
import { InputField } from '../ui/InputField';
import { SermonData } from '@/types/sermon';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    sermon: SermonData;
    isOpen: boolean;
    toggle: () => void;
    onUpdate: (field: keyof SermonData, value: string) => void;
}

export const SermonExposition: React.FC<Props> = ({ sermon, isOpen, toggle, onUpdate }) => {
    const { t } = useLanguage();
    return (
        <SectionBox title={t('sermon.exposition')} isOpen={isOpen} toggle={toggle} icon={Layers}>
            <div className="space-y-2 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label={t('sermon.expoHistorical')} value={sermon.expoHistorical} onChange={(v) => onUpdate('expoHistorical', v)} multiline rows={4} />
                    <InputField label={t('sermon.expoCultural')} value={sermon.expoCultural} onChange={(v) => onUpdate('expoCultural', v)} multiline rows={4} />
                </div>
                <InputField label={t('sermon.expoAnalysis')} value={sermon.expoAnalysis} onChange={(v) => onUpdate('expoAnalysis', v)} multiline rows={5} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <InputField label={t('sermon.expoSupportVerses')} value={sermon.expoSupportVerses} onChange={(v) => onUpdate('expoSupportVerses', v)} multiline rows={3} />
                    <InputField label={t('sermon.expoSupportVersesText')} value={sermon.expoSupportVersesText} onChange={(v) => onUpdate('expoSupportVersesText', v)} multiline rows={3} allowAudio={true} />
                </div>
            </div>
        </SectionBox>
    );
};
