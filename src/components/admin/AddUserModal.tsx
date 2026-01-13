import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, User as UserIcon, Phone, Shield, CreditCard } from 'lucide-react';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
    onUserAdded: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, token, onUserAdded }) => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        role: 'USER',
        planId: ''
    });
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tempPassword, setTempPassword] = useState('');

    useEffect(() => {
        if (isOpen && token) {
            fetchPlans();
        }
    }, [isOpen, token]);

    const fetchPlans = async () => {
        try {
            const response = await fetch('/api/admin/plans');
            if (response.ok) {
                const data = await response.json();
                setPlans(data.filter((p: any) => p.isActive));
            }
        } catch (err) {
            console.error('Error fetching plans:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Usuário criado com sucesso!');
                setTempPassword(data.tempPassword);

                // Aguarda 2 segundos para mostrar a senha temporária
                setTimeout(() => {
                    onUserAdded();
                    handleClose();
                }, 4000);
            } else {
                setError(data.error || 'Erro ao criar usuário');
            }
        } catch (err: any) {
            setError('Erro de conexão: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            name: '',
            phone: '',
            role: 'USER',
            planId: ''
        });
        setError('');
        setSuccess('');
        setTempPassword('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Adicionar Novo Usuário
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Preencha os dados do novo usuário
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email *
                            </div>
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="usuario@email.com"
                        />
                    </div>

                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                Nome Completo
                            </div>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="João Silva"
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Telefone
                            </div>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="+55 11 99999-9999"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Permissão
                            </div>
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="USER">Usuário</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>

                    {/* Plano */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Plano (Opcional)
                            </div>
                        </label>
                        <select
                            value={formData.planId}
                            onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">Sem plano</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} - R$ {plan.price.toLocaleString('pt-BR')}/{plan.interval === 'MONTHLY' ? 'mês' : 'ano'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm space-y-2">
                            <p className="font-medium">{success}</p>
                            {tempPassword && (
                                <div className="bg-white dark:bg-gray-800 p-3 rounded border border-green-300 dark:border-green-700">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Senha temporária (anote!):</p>
                                    <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">{tempPassword}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        O usuário deve alterar esta senha no primeiro login.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !!tempPassword}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Criando...' : tempPassword ? 'Usuário Criado!' : 'Criar Usuário'}
                        </button>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg text-xs">
                        <p className="font-medium mb-1">ℹ️ Informações importantes:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                            <li>Uma senha temporária será gerada automaticamente</li>
                            <li>O usuário receberá a senha por email (implementar)</li>
                            <li>No primeiro login, será solicitada a alteração da senha</li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
};
