import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, FileText, Activity, Calendar, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsProps {
    token: string | null;
}

export const Analytics: React.FC<AnalyticsProps> = ({ token }) => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30'); // dias

    useEffect(() => {
        if (token) {
            fetchAnalytics();
        }
    }, [token, period]);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`/api/admin/analytics?period=${period}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Carregando analytics...</div>;
    }

    const stats = analytics || {
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        totalSermons: 0,
        newUsersThisPeriod: 0,
        activeUsersToday: 0,
        conversionRate: 0,
        churnRate: 0,
        planDistribution: [],
        revenueByPlan: [],
        userGrowth: [],
        sermonsPerUser: 0
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Analytics
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Visão geral do desempenho da plataforma
                    </p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                >
                    <option value="7">Últimos 7 dias</option>
                    <option value="30">Últimos 30 dias</option>
                    <option value="90">Últimos 90 dias</option>
                    <option value="365">Último ano</option>
                </select>
            </div>

            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Usuários Totais"
                    value={stats.totalUsers}
                    icon={<Users className="h-6 w-6" />}
                    color="blue"
                    change={`+${stats.newUsersThisPeriod} este período`}
                />
                <StatCard
                    title="Assinaturas Ativas"
                    value={stats.activeSubscriptions}
                    icon={<Activity className="h-6 w-6" />}
                    color="green"
                    change={`Taxa conversão: ${stats.conversionRate}%`}
                />
                <StatCard
                    title="Receita Total"
                    value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
                    icon={<DollarSign className="h-6 w-6" />}
                    color="purple"
                    change="MRR"
                />
                <StatCard
                    title="Sermões Criados"
                    value={stats.totalSermons}
                    icon={<FileText className="h-6 w-6" />}
                    color="orange"
                    change={`Média: ${stats.sermonsPerUser.toFixed(1)}/usuário`}
                />
            </div>

            {/* Métricas Secundárias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                    title="Usuários Ativos Hoje"
                    value={stats.activeUsersToday}
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                />
                <MetricCard
                    title="Taxa de Churn"
                    value={`${stats.churnRate}%`}
                    icon={<PieChart className="h-5 w-5 text-red-600" />}
                />
                <MetricCard
                    title="Novos Usuários"
                    value={stats.newUsersThisPeriod}
                    icon={<Users className="h-5 w-5 text-blue-600" />}
                />
            </div>

            {/* Distribuição de Planos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Distribuição de Planos">
                    <div className="space-y-3">
                        {stats.planDistribution.map((plan: any, i: number) => (
                            <PlanBar key={i} name={plan.name} count={plan.count} total={stats.activeSubscriptions} />
                        ))}
                        {stats.planDistribution.length === 0 && (
                            <div className="text-center py-8 text-gray-500">Sem dados de planos</div>
                        )}
                    </div>
                </ChartCard>

                <ChartCard title="Receita por Plano">
                    <div className="space-y-3">
                        {stats.revenueByPlan.map((plan: any, i: number) => (
                            <RevenueBar key={i} name={plan.name} revenue={plan.revenue} total={stats.totalRevenue} />
                        ))}
                        {stats.revenueByPlan.length === 0 && (
                            <div className="text-center py-8 text-gray-500">Sem dados de receita</div>
                        )}
                    </div>
                </ChartCard>
            </div>

            {/* Crescimento de Usuários */}
            <ChartCard title="Crescimento de Usuários (Últimos 12 meses)">
                <div className="h-64 flex items-end justify-between gap-2">
                    {stats.userGrowth.map((month: any, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center group">
                            <div
                                className="w-full bg-indigo-600 rounded-t hover:bg-indigo-700 transition-colors relative"
                                style={{ height: `${(month.count / Math.max(...stats.userGrowth.map((m: any) => m.count))) * 100}%` }}
                            >
                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100">
                                    {month.count}
                                </span>
                            </div>
                            <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{month.month}</span>
                        </div>
                    ))}
                    {stats.userGrowth.length === 0 && (
                        <div className="w-full text-center py-20 text-gray-500">Sem dados de crescimento</div>
                    )}
                </div>
            </ChartCard>
        </div>
    );
};

// Componentes auxiliares
const StatCard = ({ title, value, icon, color, change }: any) => {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors[color as keyof typeof colors]}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{change}</p>
        </div>
    );
};

const MetricCard = ({ title, value, icon }: any) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{value}</p>
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children }: any) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
        {children}
    </div>
);

const PlanBar = ({ name, count, total }: any) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-300">{name}</span>
                <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const RevenueBar = ({ name, revenue, total }: any) => {
    const percentage = total > 0 ? (revenue / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-300">{name}</span>
                <span className="font-medium">R$ {revenue.toLocaleString('pt-BR')} ({percentage.toFixed(0)}%)</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
