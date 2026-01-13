'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // Auto login logic
                if (data.token && data.user) {
                    localStorage.setItem('sermonia_token', data.token);
                    localStorage.setItem('sermonia_user', JSON.stringify(data.user));

                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                } else {
                    setTimeout(() => {
                        router.push('/');
                    }, 2000);
                }
            } else {
                setError(data.error || 'Erro ao criar conta');
            }
        } catch (err) {
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <button
                    onClick={() => router.push('/')}
                    className="mb-6 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para o Início
                </button>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white text-center mb-2">
                        Crie sua Conta
                    </h1>
                    <p className="text-white/60 text-center mb-8">
                        Junte-se ao Sermonia e potencialize seus sermões
                    </p>

                    {success ? (
                        <div className="bg-green-500/20 border border-green-500/50 text-green-100 p-6 rounded-xl text-center animate-fadeIn">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                            <h3 className="text-xl font-bold mb-2">Conta Criada!</h3>
                            <p>Redirecionando você para o editor...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Nome Completo
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Seu nome"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-fadeIn">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? 'Criando conta...' : 'Criar Conta'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-white/60">
                        Já tem uma conta?{' '}
                        <button onClick={() => router.push('/')} className="text-indigo-300 hover:text-white transition-colors underline">
                            Fazer Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
