import React, { useEffect, useState } from 'react';
import { Cloud, Trash2, Calendar, Loader, Search, Clock, FileText, ArrowRight } from 'lucide-react';
import { SermonData } from '@/types/sermon';
import { Modal } from '../ui/Modal';
import { useLanguage } from '@/contexts/LanguageContext';

interface CloudSermonsModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
    onLoadSermon: (sermon: SermonData) => void;
}

interface SavedSermon {
    id: string;
    title: string;
    content: SermonData;
    createdAt: string;
    updatedAt: string;
}

export const CloudSermonsModal: React.FC<CloudSermonsModalProps> = ({ isOpen, onClose, token, onLoadSermon }) => {
    const { t } = useLanguage();
    const [sermons, setSermons] = useState<SavedSermon[]>([]);
    const [filteredSermons, setFilteredSermons] = useState<SavedSermon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen && token) {
            fetchSermons();
        }
    }, [isOpen, token]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredSermons(sermons);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredSermons(sermons.filter(s =>
                (s.title || '').toLowerCase().includes(lower)
            ));
        }
    }, [searchTerm, sermons]);

    const fetchSermons = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/sermons', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(t('common.error'));
            const data = await res.json();
            // Sort by updatedAt desc
            const sorted = data.sort((a: SavedSermon, b: SavedSermon) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
            setSermons(sorted);
            setFilteredSermons(sorted);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteSermon = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm(t('common.confirm'))) return;

        try {
            const res = await fetch(`/api/sermons/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(t('common.error'));
            const updated = sermons.filter(s => s.id !== id);
            setSermons(updated);
            setFilteredSermons(prev => prev.filter(s => s.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleLoad = (sermon: SavedSermon) => {
        onLoadSermon({ ...sermon.content, id: sermon.id });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('sermon.cloudModalTitle')} maxWidth="max-w-4xl">
            <div className="space-y-6">
                {/* Search Header */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={t('common.loading')} // Using loading as placeholder for now or create a search placeholder
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Content Area */}
                <div className="min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
                            <Loader className="w-10 h-10 animate-spin mb-4" />
                            <p className="font-medium animate-pulse">{t('common.loading')}</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg"><Trash2 className="w-5 h-5" /></div>
                            {error}
                        </div>
                    ) : !token ? (
                        <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                            <Cloud className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="font-medium text-lg">{t('auth.accessAccount')}</p>
                        </div>
                    ) : filteredSermons.length === 0 ? (
                        <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                            <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="font-medium text-lg">
                                {searchTerm ? t('common.error') : t('sermon.info')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredSermons.map(sermon => (
                                <div
                                    key={sermon.id}
                                    onClick={() => handleLoad(sermon)}
                                    className="group bg-white border border-slate-200 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 rounded-2xl p-5 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-lg truncate pr-4 group-hover:text-indigo-700 transition-colors">
                                                    {sermon.title || 'Sem Título'}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pl-12">
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {new Date(sermon.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {new Date(sermon.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                                            <button
                                                className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
                                            >
                                                {t('nav.view')} <ArrowRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => deleteSermon(sermon.id, e)}
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title={t('common.delete')}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
