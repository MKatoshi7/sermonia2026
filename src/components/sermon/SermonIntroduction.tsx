import React from 'react';
import { BookOpen } from 'lucide-react';
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

export const SermonIntroduction: React.FC<Props> = ({ sermon, isOpen, toggle, onUpdate }) => {
    const { t } = useLanguage();
    return (
        <SectionBox title={t('sermon.intro')} isOpen={isOpen} toggle={toggle} icon={BookOpen}>
            <div className="space-y-2 animate-fadeIn">
                <InputField label={t('sermon.introOpening')} value={sermon.introOpening} onChange={(v) => onUpdate('introOpening', v)} multiline rows={3} />
                <InputField label={t('sermon.introContext')} value={sermon.introContext} onChange={(v) => onUpdate('introContext', v)} multiline rows={3} />
                <InputField label={t('sermon.introHook')} value={sermon.introHook} onChange={(v) => onUpdate('introHook', v)} multiline rows={2} />
            </div>
        </SectionBox>
    );
};
