'use client';

import React, { useState } from 'react';
import { BookOpen, Cloud, Plus, Printer, Sparkles, FileDown, FileUp, CheckCircle, Image as ImageIcon, User, Settings, LogOut, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
    onNewSermon: () => void;
    onCloudOpen: () => void;
    onCloudSave: () => void;
    onPreview: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExport: () => void;
    onSettings: () => void;
    onGenerate: () => void;
    onReview: () => void;
    onGenerateImage: () => void;
    isImageGenEnabled?: boolean;
    onAdminToggle: () => void;
    isAdminView: boolean;
    userRole?: string;
    onLogout: () => void;
    user: any;
    onUserMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    onNewSermon,
    onCloudOpen,
    onCloudSave,
    onPreview,
    onImport,
    onExport,
    onSettings,
    onGenerate,
    onReview,
    onGenerateImage,
    isImageGenEnabled,
    onAdminToggle,
    isAdminView,
    userRole,
    onLogout,
    user,
    onUserMenuOpen
}) => {


    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const languages = [
        { code: 'es', label: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
        { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'pt', label: 'Português', flag: 'https://flagcdn.com/w40/br.png' },
    ];

    return (
        <>
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden shadow-sm" suppressHydrationWarning>
                <div className="h-16 flex items-center px-4 lg:px-6 justify-between relative">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img src="/sermonia.png" alt="Sermonia Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                        <div className="flex flex-col" suppressHydrationWarning>
                            <span className="text-lg md:text-xl font-bold text-indigo-600 leading-tight">Sermonia</span>
                        </div>
                    </div>

                    {/* Main Actions - Desktop Only (Centered) */}
                    {!isAdminView && (
                        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-1">
                            {/* Nuevo */}
                            <button
                                onClick={onNewSermon}
                                className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                title={t('nav.new')}
                            >
                                <Plus className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-indigo-600 font-medium mt-1">{t('nav.new')}</span>
                            </button>

                            {/* Nube */}
                            <button
                                onClick={onCloudOpen}
                                className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                title={t('nav.cloud')}
                            >
                                <Cloud className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-sky-600 font-medium mt-1">{t('nav.cloud')}</span>
                            </button>

                            {/* Guardar */}
                            <button
                                onClick={onCloudSave}
                                className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                title={t('nav.save')}
                            >
                                <FileUp className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-emerald-600 font-medium mt-1">{t('nav.save')}</span>
                            </button>

                            {/* Revisar */}
                            <button
                                onClick={onReview}
                                className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                title={t('nav.review')}
                            >
                                <CheckCircle className="w-5 h-5 text-slate-600 group-hover:text-purple-600 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-purple-600 font-medium mt-1">{t('nav.review')}</span>
                            </button>

                            {/* Generar Imagen */}
                            {isImageGenEnabled && (
                                <button
                                    onClick={onGenerateImage}
                                    className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                    title={t('nav.image')}
                                >
                                    <ImageIcon className="w-5 h-5 text-slate-600 group-hover:text-rose-600 transition-colors" />
                                    <span className="text-xs text-slate-600 group-hover:text-rose-600 font-medium mt-1">{t('nav.image')}</span>
                                </button>
                            )}

                            {/* Texto IA */}
                            <button
                                onClick={onGenerate}
                                className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                title={t('nav.text')}
                            >
                                <Sparkles className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-indigo-600 font-medium mt-1">{t('nav.text')}</span>
                            </button>

                            {/* Visualizar */}
                            <button
                                onClick={onPreview}
                                className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                title={t('nav.view')}
                            >
                                <Printer className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-slate-900 font-medium mt-1">{t('nav.view')}</span>
                            </button>

                            {/* Exportar */}
                            <button
                                onClick={onExport}
                                className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors group"
                                title={t('nav.export')}
                            >
                                <FileDown className="w-5 h-5 text-slate-600 group-hover:text-orange-600 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-orange-600 font-medium mt-1">{t('nav.export')}</span>
                            </button>

                            {/* Importar */}
                            <label className="flex flex-col items-center justify-center px-3 py-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                                <FileUp className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                                <span className="text-xs text-slate-600 group-hover:text-blue-600 font-medium mt-1">{t('nav.import')}</span>
                                <input type="file" className="hidden" accept=".json" onChange={onImport} />
                            </label>
                        </div>
                    )}

                    {/* Right Side - User Menu */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Admin Toggle */}
                        {userRole === 'ADMIN' && (
                            <button
                                onClick={onAdminToggle}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isAdminView
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {isAdminView ? 'Voltar' : t('nav.admin')}
                            </button>
                        )}

                        {/* Language Selector */}
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                                title="Idioma"
                            >
                                <img
                                    src={languages.find(l => l.code === language)?.flag}
                                    alt={language}
                                    className="w-6 h-4 object-cover rounded-sm"
                                />
                            </button>

                            {isLangMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code as any);
                                                setIsLangMenuOpen(false);
                                            }}
                                            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 ${language === lang.code ? 'text-indigo-600 font-medium' : 'text-slate-600'
                                                }`}
                                        >
                                            <img src={lang.flag} alt={lang.label} className="w-5 h-3.5 object-cover rounded-sm" />
                                            <span>{lang.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <button
                            onClick={onSettings}
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden md:block"
                            title={t('nav.settings')}
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {/* User Avatar */}
                        {user && (
                            <button
                                onClick={onUserMenuOpen}
                                className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all"
                                title={user.email}
                            >
                                <User className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        )}

                        {/* Logout */}
                        {user && (
                            <button
                                onClick={onLogout}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors hidden md:block"
                                title={t('nav.logout')}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation Bar */}
            {!isAdminView && (
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 print:hidden shadow-lg">
                    {/* First Row */}
                    <div className="flex items-center justify-around px-2 py-2 border-b border-slate-100">
                        {/* Nuevo */}
                        <button
                            onClick={onNewSermon}
                            className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors group flex-1"
                            title={t('nav.new')}
                        >
                            <Plus className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-indigo-600 font-medium mt-0.5">{t('nav.new')}</span>
                        </button>

                        {/* Nube */}
                        <button
                            onClick={onCloudOpen}
                            className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors group flex-1"
                            title={t('nav.cloud')}
                        >
                            <Cloud className="w-5 h-5 text-slate-600 group-hover:text-sky-600 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-sky-600 font-medium mt-0.5">{t('nav.cloud')}</span>
                        </button>

                        {/* Guardar */}
                        <button
                            onClick={onCloudSave}
                            className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors group flex-1"
                            title={t('nav.save')}
                        >
                            <FileUp className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-emerald-600 font-medium mt-0.5">{t('nav.save')}</span>
                        </button>

                        {/* Revisar */}
                        <button
                            onClick={onReview}
                            className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors group flex-1"
                            title={t('nav.review')}
                        >
                            <CheckCircle className="w-5 h-5 text-slate-600 group-hover:text-purple-600 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-purple-600 font-medium mt-0.5 text-center leading-tight">Review</span>
                        </button>
                    </div>

                    {/* Second Row */}
                    <div className="flex items-center justify-around px-2 py-2">
                        {/* Texto IA */}
                        <button
                            onClick={onGenerate}
                            className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors group flex-1"
                            title={t('nav.text')}
                        >
                            <Sparkles className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-indigo-600 font-medium mt-0.5 text-center leading-tight">IA</span>
                        </button>

                        {/* Visualizar */}
                        <button
                            onClick={onPreview}
                            className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors group flex-1"
                            title={t('nav.view')}
                        >
                            <Printer className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-slate-900 font-medium mt-0.5 text-center leading-tight">Ver</span>
                        </button>

                        {/* Exportar */}
                        <button
                            onClick={onExport}
                            className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors group flex-1"
                            title={t('nav.export')}
                        >
                            <FileDown className="w-5 h-5 text-slate-600 group-hover:text-orange-600 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-orange-600 font-medium mt-0.5 text-center leading-tight">Export</span>
                        </button>

                        {/* Importar */}
                        <label className="flex flex-col items-center justify-center p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group flex-1">
                            <FileUp className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                            <span className="text-[9px] text-slate-600 group-hover:text-blue-600 font-medium mt-0.5 text-center leading-tight">Import</span>
                            <input type="file" className="hidden" accept=".json" onChange={onImport} />
                        </label>
                    </div>
                </div>
            )}
        </>
    );
};
