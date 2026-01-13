'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ForgotPasswordModal } from '../auth/ForgotPasswordModal';

export default function LoginScreen() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { t, language, setLanguage } = useLanguage();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);

    const languages = [
        { code: 'es', label: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
        { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/us.png' },
        { code: 'pt', label: 'Português', flag: 'https://flagcdn.com/w40/br.png' },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                if (isLogin) {
                    localStorage.setItem('sermonia_token', data.token);
                    localStorage.setItem('sermonia_user', JSON.stringify(data.user));
                    window.location.href = '/';
                } else {
                    alert(t('common.success'));
                    setIsLogin(true);
                }
            } else {
                alert(data.error || 'Erro ao processar');
            }
        } catch (error) {
            console.error(error);
            alert('Erro de conexão');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ email: '', password: '' });
        setShowPassword(false);
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row">
            {/* Left side - Hero section */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-12">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-indigo-900/80 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/80 to-black/60" />
                </div>

                {/* Language Selector (Mobile/Desktop Absolute) */}
                <div className="absolute top-4 right-4 z-50">
                    <div className="relative">
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
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
                </div>

                {/* Abstract shapes - Optional, keeping for extra depth if needed, or removing if image is enough. Keeping for now with lower opacity */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 z-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
                </div>

                <div className="text-white max-w-lg relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                        {t('auth.heroTitle')}
                    </h1>
                    <p className="text-lg text-indigo-100 mb-8 drop-shadow-md font-medium">
                        {t('auth.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Right side - Login/Signup form */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">
                    {/* Logo/Icon */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                                <img src="/sermonia.png" alt="Sermonia" className="w-7 h-7 object-contain brightness-0 invert" />
                            </div>
                            <span className="text-3xl font-bold text-gray-900 tracking-tight">Sermonia</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
                        </h2>
                        <p className="text-gray-600">
                            {isLogin
                                ? t('auth.accessAccount')
                                : t('auth.startJourney')
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.email')}
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                {isLogin ? t('auth.password') : t('auth.createAccount')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    placeholder={isLogin ? "Sua senha" : "Senha segura"}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                    <span className="ml-2 text-sm text-gray-600">{t('auth.rememberMe')}</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsForgotOpen(true)}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    {t('auth.forgotPassword')}
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                                <>
                                    {isLogin ? t('auth.loginAction') : t('auth.createAccountAction')}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
        </div>
    );
}
