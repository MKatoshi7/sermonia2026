import React from 'react';
import { Settings } from 'lucide-react';
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

export const SermonNotes: React.FC<Props> = ({ sermon, isOpen, toggle, onUpdate }) => {
    const { t } = useLanguage();
    return (
        <SectionBox title={t('sermon.notes')} isOpen={isOpen} toggle={toggle} icon={Settings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <InputField label={t('sermon.notesImages')} value={sermon.notesImages} onChange={(v) => onUpdate('notesImages', v)} multiline rows={3} />
                <InputField label={t('sermon.notesStats')} value={sermon.notesStats} onChange={(v) => onUpdate('notesStats', v)} multiline rows={3} />
                <InputField label={t('sermon.notesQuotes')} value={sermon.notesQuotes} onChange={(v) => onUpdate('notesQuotes', v)} multiline rows={3} />
                <InputField label={t('sermon.notesGeneral')} value={sermon.notesGeneral} onChange={(v) => onUpdate('notesGeneral', v)} multiline rows={3} />
            </div>
        </SectionBox>
    );
};
