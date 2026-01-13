import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ForgotPasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            // Sempre mostramos mensagem de sucesso por segurança
            setMessage('Se este email estiver cadastrado, você receberá um link para redefinir sua senha.');

        } catch (error) {
            setMessage('Erro de conexão. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('auth.forgotPassword')}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-sm text-gray-600">
                    Digite seu email abaixo e enviaremos instruções para você redefinir sua senha.
                </p>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        placeholder="seu@email.com"
                        required
                    />
                </div>

                {message && (
                    <div className="p-3 bg-indigo-50 text-indigo-700 text-sm rounded-lg border border-indigo-100">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
            </form>
        </Modal>
    );
};
