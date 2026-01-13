import React from 'react';
import { PenTool } from 'lucide-react';
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

export const SermonConclusion: React.FC<Props> = ({ sermon, isOpen, toggle, onUpdate }) => {
    const { t } = useLanguage();
    return (
        <SectionBox title={t('sermon.conclusion')} isOpen={isOpen} toggle={toggle} icon={PenTool}>
            <div className="space-y-2 animate-fadeIn">
                <InputField label={t('sermon.concSummary')} value={sermon.concSummary} onChange={(v) => onUpdate('concSummary', v)} multiline rows={3} />
                <InputField label={t('sermon.concAction')} value={sermon.concAction} onChange={(v) => onUpdate('concAction', v)} multiline rows={3} allowAudio={true} />
                <InputField label={t('sermon.concPrayer')} value={sermon.concPrayer} onChange={(v) => onUpdate('concPrayer', v)} multiline rows={3} allowAudio={true} />
            </div>
        </SectionBox>
    );
};
