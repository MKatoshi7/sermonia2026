import React, { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp, Users, BookOpen, CreditCard, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
    token: string | null;
    stats: any;
    onRefresh: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ token, stats, onRefresh }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    return (
        <div className="space-y-6">
            {/* Header com botão de refresh */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Visão Geral
                </h2>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Atualizar
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Usuários</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.users || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {stats?.activeUsers || 0} ativos
                    </p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Sermões Criados</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.sermons || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+8% esta semana</p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Assinaturas Ativas</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.activeSubscriptions || 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        de {stats?.totalSubscriptions || 0} total
                    </p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">MRR</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        R$ {(stats?.revenue || 0).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+15% este mês</p>
                </div>
            </div>

            {/* Planos Populares */}
            {stats?.plans && stats.plans.length > 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Planos Populares
                    </h3>
                    <div className="space-y-3">
                        {stats.plans.map((plan: any, i: number) => (
                            <div key={plan.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-500' : i === 1 ? 'bg-purple-500' : 'bg-blue-500'
                                        }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">{plan.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            R$ {plan.price.toLocaleString('pt-BR')}/mês
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {plan.subscribersCount} assinantes
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Webhooks Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Webhooks Recebidos
                    </h4>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {stats?.totalWebhooks || 0}
                    </p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Processados
                    </h4>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {stats?.processedWebhooks || 0}
                    </p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Com Erros
                    </h4>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {stats?.failedWebhooks || 0}
                    </p>
                </div>
            </div>
        </div>
    );
};
