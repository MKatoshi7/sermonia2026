import React from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface SectionBoxProps {
    title: string;
    isOpen: boolean;
    toggle: () => void;
    icon?: LucideIcon;
    children: React.ReactNode;
}

export const SectionBox: React.FC<SectionBoxProps> = ({ title, isOpen, toggle, icon: Icon, children }) => (
    <div className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-[2rem] border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(99,102,241,0.1)] transition-all duration-500 ease-out overflow-hidden ${isOpen ? 'ring-1 ring-slate-900/5' : ''} md:hover:-translate-y-1`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div
            onClick={toggle}
            className="flex items-center justify-between p-3 md:p-6 cursor-pointer hover:bg-white/40 transition-colors"
        >
            <div className="flex items-center gap-3 md:gap-5">
                <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all duration-300 ${isOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600'}`}>
                    {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                <div>
                    <h3 className="text-base md:text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
                    {!isOpen && <p className="text-xs text-slate-400 font-medium mt-0.5 hidden md:block">Clique para expandir</p>}
                </div>
            </div>
            <div className={`p-1.5 md:p-2 rounded-full transition-all duration-500 ${isOpen ? 'bg-slate-100 rotate-180' : 'bg-transparent rotate-0'}`}>
                <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 ${isOpen ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-3 md:p-8 pt-2 border-t border-slate-100/50">
                {children}
            </div>
        </div>
    </div>
);
