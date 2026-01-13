import React, { useState } from 'react';
import { X, LogIn, Lock, Mail } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (token: string, user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao fazer login');
            }

            onLoginSuccess(data.token, data.user);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-center relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-4 shadow-lg">
                            <LogIn className="text-white w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Sermonia</h2>
                        <p className="text-indigo-100 text-sm mt-1">Plataforma de Inteligência Pastoral</p>
                    </div>
                </div>

                <div className="p-8 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="admin@sermonia.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <>
                                    <span>Acessar Sistema</span> <LogIn className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm text-slate-500">
                        Não tem uma conta?{' '}
                        <a href="/reg" className="text-indigo-600 hover:text-indigo-800 font-semibold">
                            Criar conta
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
