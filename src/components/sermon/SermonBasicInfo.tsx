import React from 'react';
import { Layout } from 'lucide-react';
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

export const SermonBasicInfo: React.FC<Props> = ({ sermon, isOpen, toggle, onUpdate }) => {
    const { t } = useLanguage();
    return (
        <SectionBox title={t('sermon.info')} isOpen={isOpen} toggle={toggle} icon={Layout}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div className="md:col-span-2">
                    <InputField label={t('sermon.title')} value={sermon.title} onChange={(v) => onUpdate('title', v)} placeholder={t('sermon.placeholderTitle')} />
                </div>
                <InputField label={t('sermon.date')} value={sermon.date} onChange={(v) => onUpdate('date', v)} placeholder={t('sermon.placeholderDate')} />
                <InputField label={t('sermon.verse')} value={sermon.mainVerse} onChange={(v) => onUpdate('mainVerse', v)} placeholder={t('sermon.placeholderVerse')} />
                <div className="md:col-span-2">
                    <InputField label={t('sermon.verseText')} value={sermon.mainVerseText} onChange={(v) => onUpdate('mainVerseText', v)} multiline rows={3} placeholder={t('sermon.placeholderVerseText')} allowAudio={true} />
                </div>
                <div className="md:col-span-2">
                    <InputField label={t('sermon.objective')} value={sermon.objective} onChange={(v) => onUpdate('objective', v)} placeholder={t('sermon.placeholderObjective')} />
                </div>
            </div>
        </SectionBox>
    );
};
