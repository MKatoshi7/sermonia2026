import React, { useState } from 'react';
import {
    BookOpen,
    Cloud,
    Plus,
    Printer,
    Sparkles,
    FileDown,
    FileUp,
    CheckCircle,
    Image as ImageIcon,
    User,
    Home,
    Save,
    Eye,
    ChevronDown,
    ChevronsRight,
    Settings,
    HelpCircle,
    FileText,
    Layers,
    Moon,
    Sun,
    Bell
} from 'lucide-react';

interface EditorSidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onNewSermon: () => void;
    onCloudOpen: () => void;
    onCloudSave: () => void;
    onPreview: () => void;
    onExport: () => void;
    onGenerate: () => void;
    onReview: () => void;
    onGenerateImage: () => void;
    user: any;
    isDark?: boolean;
    setIsDark?: (dark: boolean) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
    open,
    setOpen,
    onNewSermon,
    onCloudOpen,
    onCloudSave,
    onPreview,
    onExport,
    onGenerate,
    onReview,
    onGenerateImage,
    user,
    isDark = false,
    setIsDark
}) => {
    return (
        <nav
            className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-16'
                } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm print:hidden z-50`}
        >
            {/* Logo/Title */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        {open && (
                            <div>
                                <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    Sermonia
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">
                                    Editor de Sermões
                                </span>
                            </div>
                        )}
                    </div>
                    {open && <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                </div>
            </div>

            {/* Menu Items - Ações Principais */}
            <div className="space-y-1 mb-8">
                <MenuItem
                    Icon={Plus}
                    title="Novo Sermão"
                    onClick={onNewSermon}
                    open={open}
                    color="indigo"
                />
                <MenuItem
                    Icon={Save}
                    title="Salvar na Nuvem"
                    onClick={onCloudSave}
                    open={open}
                    color="sky"
                />
                <MenuItem
                    Icon={Cloud}
                    title="Meus Sermões"
                    onClick={onCloudOpen}
                    open={open}
                    color="blue"
                />
                <MenuItem
                    Icon={Eye}
                    title="Visualizar Impressão"
                    onClick={onPreview}
                    open={open}
                    color="slate"
                />
            </div>

            {/* IA Tools */}
            {open && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-8">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Ferramentas IA
                    </div>
                    <div className="space-y-1">
                        <MenuItem
                            Icon={Sparkles}
                            title="Gerar com IA"
                            onClick={onGenerate}
                            open={open}
                            color="indigo"
                            highlight
                        />
                        <MenuItem
                            Icon={CheckCircle}
                            title="Revisar Texto"
                            onClick={onReview}
                            open={open}
                            color="purple"
                        />
                        {/* <MenuItem
                            Icon={ImageIcon}
                            title="Gerar Imagem"
                            onClick={onGenerateImage}
                            open={open}
                            color="rose"
                        /> */}
                    </div>
                </div>
            )}

            {/* Export/Import */}
            {open && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Arquivos
                    </div>
                    <MenuItem
                        Icon={FileDown}
                        title="Exportar JSON"
                        onClick={onExport}
                        open={open}
                        color="orange"
                    />
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
                <div className="flex items-center p-3">
                    <div className="grid size-10 place-content-center">
                        <ChevronsRight
                            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${open ? "rotate-180" : ""
                                }`}
                        />
                    </div>
                    {open && (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Ocultar
                        </span>
                    )}
                </div>
            </button>
        </nav>
    );
};

interface MenuItemProps {
    Icon: any;
    title: string;
    onClick: () => void;
    open: boolean;
    color?: 'indigo' | 'sky' | 'blue' | 'slate' | 'purple' | 'rose' | 'orange';
    highlight?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ Icon, title, onClick, open, color = 'gray', highlight = false }) => {
    const colorClasses: Record<string, string> = {
        indigo: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300',
        sky: 'hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-700 dark:hover:text-sky-300',
        blue: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300',
        slate: 'hover:bg-slate-50 dark:hover:bg-slate-900/20 hover:text-slate-700 dark:hover:text-slate-300',
        purple: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300',
        rose: 'hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-700 dark:hover:text-rose-300',
        orange: 'hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300',
    };

    const baseClasses = highlight
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-sm'
        : `text-gray-600 dark:text-gray-400 ${colorClasses[color]}`;

    return (
        <button
            onClick={onClick}
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${baseClasses}`}
        >
            <div className="grid h-full w-12 place-content-center">
                <Icon className="h-4 w-4" />
            </div>

            {open && (
                <span className="text-sm font-medium">
                    {title}
                </span>
            )}
        </button>
    );
};
