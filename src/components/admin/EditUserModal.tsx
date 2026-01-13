import React, { useState, useEffect } from 'react';
import { X, Edit as EditIcon, Mail, User as UserIcon, Phone, Shield, CreditCard, AlertTriangle, Lock } from 'lucide-react';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
    user: any;
    onUserUpdated: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, token, user, onUserUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'USER',
        isActive: true,
        planId: '',
        password: ''
    });
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || 'USER',
                isActive: user.isActive !== undefined ? user.isActive : true,
                planId: user.subscriptions?.[0]?.planId || '',
                password: ''
            });
            fetchPlans();
        }
    }, [isOpen, user]);

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
        setSuccess(false);
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onUserUpdated();
                    handleClose();
                }, 1500);
            } else {
                const data = await response.json();
                setError(data.error || 'Erro ao atualizar usuário');
            }
        } catch (err: any) {
            setError('Erro de conexão: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError('');
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <EditIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Editar Usuário
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user?.email}
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
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="João Silva"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                E-mail
                            </div>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="joao@email.com"
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
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+55 11 99999-9999"
                        />
                    </div>

                    {/* Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Nova Senha (opcional)
                            </div>
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Deixe em branco para manter a atual"
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
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                Plano
                            </div>
                        </label>
                        <select
                            value={formData.planId}
                            onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Sem plano</option>
                            {plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} - R$ {plan.price.toLocaleString('pt-BR')}/{plan.interval === 'MONTHLY' ? 'mês' : 'ano'}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Alteração de plano será aplicada na próxima fatura
                        </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Usuário ativo (pode fazer login)
                        </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-sm">
                            Usuário atualizado com sucesso!
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
                            disabled={loading || success}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : success ? 'Salvo!' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Modal de Deletar Usuário
interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
    user: any;
    onUserDeleted: () => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, token, user, onUserDeleted }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                onUserDeleted();
                onClose();
            } else {
                const data = await response.json();
                setError(data.error || 'Erro ao deletar usuário');
            }
        } catch (err: any) {
            setError('Erro de conexão: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Confirmar Exclusão
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Esta ação não pode ser desfeita
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Tem certeza que deseja excluir o usuário <strong>{user?.name || user?.email}</strong>?
                    </p>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg text-sm">
                        <p className="font-medium mb-1">⚠️ Atenção:</p>
                        <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
                            <li>Todos os sermões serão deletados</li>
                            <li>Assinaturas serão canceladas</li>
                            <li>Não é possível reverter esta ação</li>
                        </ul>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Deletando...' : 'Sim, Deletar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
