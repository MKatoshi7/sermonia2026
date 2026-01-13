"use client"
import React, { useState, useEffect } from "react";
import {
    Home,
    DollarSign,
    Users,
    ChevronDown,
    ChevronsRight,
    Moon,
    Sun,
    TrendingUp,
    Activity,
    Package,
    Bell,
    Settings,
    HelpCircle,
    User,
    BookOpen,
    CreditCard,
    Webhook,
    UserPlus,
    UserMinus,
    Eye,
    EyeOff,
} from "lucide-react";

export const DashboardWithCollapsibleSidebar = ({
    children,
    user,
    onLogout,
    stats,
}: {
    children?: React.ReactNode;
    user?: any;
    onLogout?: () => void;
    stats?: any;
}) => {
    const [isDark, setIsDark] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
            <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
                <Sidebar selected={selected} setSelected={setSelected} user={user} />
                <div className="flex-1">
                    {children || <ExampleContent isDark={isDark} setIsDark={setIsDark} stats={stats} onLogout={onLogout} user={user} />}
                </div>
            </div>
        </div>
    );
};

const Sidebar = ({ selected, setSelected, user }: any) => {
    const [open, setOpen] = useState(true);

    return (
        <nav
            className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-16'
                } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
        >
            <TitleSection open={open} user={user} />

            <div className="space-y-1 mb-8">
                <Option
                    Icon={Home}
                    title="Dashboard"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={Users}
                    title="Usuários"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={BookOpen}
                    title="Sermões"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={CreditCard}
                    title="Assinaturas"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={Package}
                    title="Planos"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={Webhook}
                    title="Webhooks"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
                <Option
                    Icon={Activity}
                    title="Analytics"
                    selected={selected}
                    setSelected={setSelected}
                    open={open}
                />
            </div>

            {open && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Configurações
                    </div>
                    <Option
                        Icon={Settings}
                        title="Configurações"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                    <Option
                        Icon={HelpCircle}
                        title="Suporte"
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                </div>
            )}

            <ToggleClose open={open} setOpen={setOpen} />
        </nav>
    );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }: any) => {
    const isSelected = selected === title;

    return (
        <button
            onClick={() => setSelected(title)}
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${isSelected
                    ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm border-l-2 border-indigo-500"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
        >
            <div className="grid h-full w-12 place-content-center">
                <Icon className="h-4 w-4" />
            </div>

            {open && (
                <span
                    className={`text-sm font-medium transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    {title}
                </span>
            )}

            {notifs && open && (
                <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600 text-xs text-white font-medium">
                    {notifs}
                </span>
            )}
        </button>
    );
};

const TitleSection = ({ open, user }: any) => {
    return (
        <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center gap-3">
                    <Logo />
                    {open && (
                        <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="flex items-center gap-2">
                                <div>
                                    <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {user?.name || 'Sermonia'}
                                    </span>
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
                                        {user?.role || 'Admin'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {open && (
                    <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                )}
            </div>
        </div>
    );
};

const Logo = () => {
    return (
        <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
            <BookOpen className="h-5 w-5 text-white" />
        </div>
    );
};

const ToggleClose = ({ open, setOpen }: any) => {
    return (
        <button
            onClick={() => setOpen(!open)}
            className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        >
            <div className="flex items-center p-3">
                <div className="grid size-10 place-content-center">
                    <ChevronsRight
                        className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${open ? "rotate-180" : ""
                            }`}
                    />
                </div>
                {open && (
                    <span
                        className={`text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        Ocultar
                    </span>
                )}
            </div>
        </button>
    );
};

const ExampleContent = ({ isDark, setIsDark, stats, onLogout, user }: any) => {
    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Administrativo</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Bem-vindo ao painel de controle</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                    </button>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </button>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                            Sair
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Usuários</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.users || 0}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% este mês</p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Sermões Criados</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.sermons || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.activeSubscriptions || 0}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5% este mês</p>
                </div>

                <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">Receita (MRR)</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        R$ {(stats?.revenue || 0).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+15% este mês</p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Atividade Recente</h3>
                            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                                Ver tudo
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { icon: UserPlus, title: "Novo usuário cadastrado", desc: "joao@email.com via webhook", time: "2 min atrás", color: "green" },
                                { icon: BookOpen, title: "Sermão criado", desc: "O Amor de Deus por João Silva", time: "5 min atrás", color: "purple" },
                                { icon: CreditCard, title: "Nova assinatura", desc: "Plano Pro - R$ 97/mês", time: "10 min atrás", color: "blue" },
                                { icon: Activity, title: "Webhook processado", desc: "PURCHASE_COMPLETED", time: "15 min atrás", color: "orange" },
                                { icon: Users, title: "Usuário ativado", desc: "maria@email.com completou cadastro", time: "1 hora atrás", color: "indigo" },
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                    <div className={`p-2 rounded-lg ${activity.color === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
                                            activity.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
                                                activity.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20' :
                                                    activity.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20' :
                                                        'bg-indigo-50 dark:bg-indigo-900/20'
                                        }`}>
                                        <activity.icon className={`h-4 w-4 ${activity.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                                activity.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                                    activity.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                                        activity.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                                            'text-indigo-600 dark:text-indigo-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {activity.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {activity.desc}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Estatísticas Rápidas</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conversão</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">3.2%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">85%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Churn Rate</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2.1%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: '21%' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Planos Populares</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Plano Pro', users: 45, color: 'indigo' },
                                { name: 'Plano Básico', users: 32, color: 'blue' },
                                { name: 'Plano Premium', users: 18, color: 'purple' },
                            ].map((plan, i) => (
                                <div key={i} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${plan.color === 'indigo' ? 'bg-indigo-500' :
                                                plan.color === 'blue' ? 'bg-blue-500' :
                                                    'bg-purple-500'
                                            }`}></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{plan.name}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.users} usuários
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardWithCollapsibleSidebar;
