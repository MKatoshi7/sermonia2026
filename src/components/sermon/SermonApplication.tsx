import React from 'react';
import { FileJson } from 'lucide-react';
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

export const SermonApplication: React.FC<Props> = ({ sermon, isOpen, toggle, onUpdate }) => {
    const { t } = useLanguage();
    return (
        <SectionBox title={t('sermon.application')} isOpen={isOpen} toggle={toggle} icon={FileJson}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <InputField label={t('sermon.appPersonal')} value={sermon.appPersonal} onChange={(v) => onUpdate('appPersonal', v)} multiline rows={3} />
                <InputField label={t('sermon.appFamily')} value={sermon.appFamily} onChange={(v) => onUpdate('appFamily', v)} multiline rows={3} />
                <InputField label={t('sermon.appChurch')} value={sermon.appChurch} onChange={(v) => onUpdate('appChurch', v)} multiline rows={3} />
                <InputField label={t('sermon.appSociety')} value={sermon.appSociety} onChange={(v) => onUpdate('appSociety', v)} multiline rows={3} />
            </div>
        </SectionBox>
    );
};
