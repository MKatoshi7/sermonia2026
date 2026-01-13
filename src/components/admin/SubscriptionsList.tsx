import React, { useEffect, useState } from 'react';
import { CreditCard, Calendar, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SubscriptionsListProps {
    token: string | null;
}

export const SubscriptionsList: React.FC<SubscriptionsListProps> = ({ token }) => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchSubscriptions();
        }
    }, [token]);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('/api/admin/subscriptions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSubscriptions(data);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysRemaining = (nextBillingDate: string | null) => {
        if (!nextBillingDate) return null; // Vitalício
        const today = new Date();
        const billing = new Date(nextBillingDate);
        const diff = Math.ceil((billing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'CANCELLED': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            case 'EXPIRED': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
            case 'PENDING': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
            case 'CANCELLED': return <XCircle className="h-4 w-4" />;
            case 'EXPIRED': return <AlertCircle className="h-4 w-4" />;
            case 'PENDING': return <Clock className="h-4 w-4" />;
            default: return null;
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Carregando assinaturas...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{subscriptions.length}</div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ativas</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {subscriptions.filter(s => s.status === 'ACTIVE').length}
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Canceladas</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {subscriptions.filter(s => s.status === 'CANCELLED').length}
                    </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expiradas</div>
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {subscriptions.filter(s => s.status === 'EXPIRED').length}
                    </div>
                </div>
            </div>

            {/* Lista de assinaturas */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Usuário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Plano
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Início
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Próxima Cobrança
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Dias Restantes
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {subscriptions.map((sub) => {
                            const daysRemaining = getDaysRemaining(sub.nextBillingDate);
                            return (
                                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {sub.user?.name || 'Sem nome'}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {sub.user?.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {sub.plan?.name}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            R$ {sub.plan?.price.toLocaleString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getStatusColor(sub.status)}`}>
                                            {getStatusIcon(sub.status)}
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(sub.startDate).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {sub.nextBillingDate ? (
                                            <div className="text-sm text-gray-900 dark:text-gray-100">
                                                {new Date(sub.nextBillingDate).toLocaleDateString('pt-BR')}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                                Vitalício ∞
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {daysRemaining !== null ? (
                                            <div className={`text-sm font-medium ${daysRemaining < 0 ? 'text-red-600 dark:text-red-400' :
                                                    daysRemaining < 7 ? 'text-orange-600 dark:text-orange-400' :
                                                        'text-green-600 dark:text-green-400'
                                                }`}>
                                                {daysRemaining < 0 ? (
                                                    <>Expirado há {Math.abs(daysRemaining)} dias</>
                                                ) : daysRemaining === 0 ? (
                                                    <>Expira hoje</>
                                                ) : (
                                                    <>{daysRemaining} dias</>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-purple-600 dark:text-purple-400">
                                                Para sempre
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {subscriptions.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Nenhuma assinatura encontrada
                </div>
            )}
        </div>
    );
};
