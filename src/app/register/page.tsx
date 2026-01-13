'use client';

import React, { useState } from 'react';
import { BookOpen, Mail, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validatePassword = (pass: string) => {
        if (pass.length < 8) return t('auth.reqMinChars');
        if (!/[A-Z]/.test(pass)) return t('auth.reqUpperCase');
        if (!/[a-z]/.test(pass)) return t('auth.reqLowerCase');
        if (!/[0-9]/.test(pass)) return t('auth.reqNumber');
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validações
        if (!email) {
            setError(t('auth.enterEmail'));
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError(t('auth.passwordsDoNotMatch'));
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t('auth.errorCreatingPassword'));
            }

            setSuccess(true);

            // Redireciona para login após 2 segundos
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (err: any) {
            setError(err.message || t('auth.errorProcessing'));
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('auth.passwordSuccessTitle')}</h2>
                    <p className="text-slate-600 mb-6">
                        {t('auth.passwordSuccessDesc')}
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo e Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('auth.welcomeSermonia')}</h1>
                    <p className="text-slate-600">{t('auth.createPasswordTitle')}</p>
                </div>

                {/* Card Principal */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                    {/* Instruções */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <p className="font-semibold mb-1">{t('auth.firstAccess')}</p>
                                <p className="text-blue-700">
                                    {t('auth.firstAccessDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* E-mail */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('auth.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder={t('auth.emailPlaceholder')}
                                    required
                                />
                            </div>
                        </div>

                        {/* Senha */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('auth.newPassword')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder={t('auth.passwordPlaceholder')}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                {t('auth.confirmPassword')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    placeholder={t('auth.confirmPasswordPlaceholder')}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Requisitos de Senha */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-slate-700 mb-2">{t('auth.passwordRequirements')}</p>
                            <ul className="space-y-1 text-xs text-slate-600">
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    {t('auth.reqMinChars')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    {t('auth.reqUpperCase')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    {t('auth.reqLowerCase')}
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    {t('auth.reqNumber')}
                                </li>
                            </ul>
                        </div>

                        {/* Erro */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Botão Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    {t('auth.creatingPassword')}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    {t('auth.createPasswordAction')}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        {t('auth.haveAccount')}{' '}
                        <button
                            onClick={() => router.push('/')}
                            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                        >
                            {t('auth.loginAction')}
                        </button>
                    </p>
                </div>

                {/* Info Adicional */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        {t('auth.termsAgreement')}{' '}
                        <a href="#" className="text-indigo-600 hover:underline">{t('auth.termsOfUse')}</a>
                        {' '}{t('auth.and')}{' '}
                        <a href="#" className="text-indigo-600 hover:underline">{t('auth.privacyPolicy')}</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
