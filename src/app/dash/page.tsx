'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Home,
    Users,
    BookOpen,
    CreditCard,
    Package,
    Webhook,
    Activity,
    Settings,
    HelpCircle,
    ChevronDown,
    ChevronsRight,
    Moon,
    Sun,
    Bell,
    ArrowLeft,
    Lock,
    TrendingUp,
    DollarSign,
    UserPlus,
    Edit,
    Trash2,
    Search,
    RefreshCw,
} from 'lucide-react';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { SermonsManagement } from '@/components/admin/SermonsManagement';
import { ApiKeyOnboardingModal } from '@/components/onboarding/ApiKeyOnboardingModal';

export default function DashboardPage() {
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [isDark, setIsDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState('Dashboard');
    const [users, setUsers] = useState<any[]>([]);
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showOnboarding, setShowOnboarding] = useState(false);

    const checkApiKey = async (authToken: string, userData: any) => {
        // Não mostrar para admins
        if (userData?.role === 'ADMIN') return;

        try {
            const response = await fetch('/api/user/api-key', {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (!data.apiKey) {
                    setShowOnboarding(true);
                }
            }
        } catch (error) {
            console.error('Error checking API key:', error);
        }
    };

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        const savedToken = localStorage.getItem('sermonia_token');
        const savedUser = localStorage.getItem('sermonia_user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                checkApiKey(savedToken, parsedUser);
            } catch (e) {
                console.error('Erro ao carregar sessão', e);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (token) {
            fetchStats();
            if (selectedMenu === 'Usuários') {
                fetchUsers();
            }
            if (selectedMenu === 'Webhooks') {
                fetchWebhooks();
            }
        }
    }, [token, selectedMenu]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchWebhooks = async () => {
        try {
            const response = await fetch('/api/admin/webhooks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWebhooks(data);
            }
        } catch (error) {
            console.error('Error fetching webhooks:', error);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('sermonia_token', data.token);
                localStorage.setItem('sermonia_user', JSON.stringify(data.user));
                checkApiKey(data.token, data.user);
            } else {
                setLoginError(data.error || 'Credenciais inválidas');
            }
        } catch (error) {
            setLoginError('Erro de conexão');
        }
    };

    const handleLogout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('sermonia_token');
        localStorage.removeItem('sermonia_user');
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
                <div className="text-white text-lg">Carregando...</div>
            </div>
        );
    }

    // Tela de Login
    if (!token || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <button
                        onClick={() => router.push('/')}
                        className="mb-6 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o Editor
                    </button>

                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Lock className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-white text-center mb-2">
                            Dashboard Administrativo
                        </h1>
                        <p className="text-white/60 text-center mb-8">
                            Faça login para acessar o painel
                        </p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 mb-2">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {loginError && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                                    {loginError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
                            >
                                Entrar no Dashboard
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-white/60">
                            Não tem acesso? Entre em contato com o administrador.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Renderiza conteúdo baseado no menu selecionado
    const renderContent = () => {
        switch (selectedMenu) {
            case 'Usuários':
                return <UsersManagement token={token} />;
            case 'Sermões':
                return <SermonsManagement token={token} />;
            case 'Assinaturas':
                return <SubscriptionsContent stats={stats} />;
            case 'Planos':
                return <PlansContent stats={stats} />;
            case 'Webhooks':
                return <WebhooksContent webhooks={webhooks} />;
            case 'Analytics':
                return <AnalyticsContent stats={stats} />;
            case 'Configurações':
                return <SettingsContent user={user} />;
            case 'Suporte':
                return <SupportContent />;
            case 'Dashboard':
            default:
                return <DashboardContent stats={stats} onRefresh={fetchStats} />;
        }
    };

    // Dashboard com Sidebar
    return (
        <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
            <ApiKeyOnboardingModal
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                token={token}
            />
            <div className="flex w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
                {/* Sidebar */}
                <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    selected={selectedMenu}
                    setSelected={setSelectedMenu}
                    user={user}
                />

                {/* Main Content */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedMenu}</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {getMenuDescription(selectedMenu)}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="relative p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                                </button>
                                <button
                                    onClick={() => setIsDark(!isDark)}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Editor
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    Sair
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente Sidebar
const Sidebar = ({ open, setOpen, selected, setSelected, user }: any) => {
    const menuItems = [
        { Icon: Home, title: 'Dashboard' },
        { Icon: Users, title: 'Usuários' },
        { Icon: BookOpen, title: 'Sermões' },
        { Icon: CreditCard, title: 'Assinaturas' },
        { Icon: Package, title: 'Planos' },
        { Icon: Webhook, title: 'Webhooks' },
        { Icon: Activity, title: 'Analytics' },
    ];

    const settingsItems = [
        { Icon: Settings, title: 'Configurações' },
        { Icon: HelpCircle, title: 'Suporte' },
    ];

    return (
        <nav
            className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-16'
                } border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm`}
        >
            {/* Logo/Title */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
                <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        {open && (
                            <div>
                                <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {user?.name || 'Sermonia'}
                                </span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
                                    {user?.role || 'Admin'}
                                </span>
                            </div>
                        )}
                    </div>
                    {open && <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1 mb-8">
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.title}
                        Icon={item.Icon}
                        title={item.title}
                        selected={selected}
                        setSelected={setSelected}
                        open={open}
                    />
                ))}
            </div>

            {/* Settings Section */}
            {open && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Configurações
                    </div>
                    {settingsItems.map((item) => (
                        <MenuItem
                            key={item.title}
                            Icon={item.Icon}
                            title={item.title}
                            selected={selected}
                            setSelected={setSelected}
                            open={open}
                        />
                    ))}
                </div>
            )}

            {/* Toggle Button */}
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
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Ocultar
                        </span>
                    )}
                </div>
            </button>
        </nav>
    );
};

const MenuItem = ({ Icon, title, selected, setSelected, open }: any) => {
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
                <span className="text-sm font-medium">
                    {title}
                </span>
            )}
        </button>
    );
};

// Helper function
function getMenuDescription(menu: string) {
    const descriptions: Record<string, string> = {
        'Dashboard': 'Visão geral do sistema',
        'Usuários': 'Gerencie usuários e permissões',
        'Sermões': 'Acompanhe sermões criados',
        'Assinaturas': 'Gerencie assinaturas ativas',
        'Planos': 'Configure planos de assinatura',
        'Webhooks': 'Monitore eventos de webhook',
        'Analytics': 'Análise de métricas',
        'Configurações': 'Configurações do sistema',
        'Suporte': 'Central de ajuda',
    };
    return descriptions[menu] || '';
}

// Content Components
const DashboardContent = ({ stats, onRefresh }: any) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh();
        setTimeout(() => setIsRefreshing(false), 500);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Estatísticas</h2>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Atualizar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    title="Total de Usuários"
                    value={stats?.users || 0}
                    subtitle={`${stats?.activeUsers || 0} ativos`}
                    color="indigo"
                />
                <StatCard
                    icon={BookOpen}
                    title="Sermões Criados"
                    value={stats?.sermons || 0}
                    subtitle="+8% esta semana"
                    color="purple"
                />
                <StatCard
                    icon={CreditCard}
                    title="Assinaturas Ativas"
                    value={stats?.activeSubscriptions || 0}
                    subtitle={`de ${stats?.totalSubscriptions || 0} total`}
                    color="green"
                />
                <StatCard
                    icon={DollarSign}
                    title="MRR"
                    value={`R$ ${(stats?.revenue || 0).toLocaleString('pt-BR')}`}
                    subtitle="+15% este mês"
                    color="amber"
                />
            </div>

            {stats?.plans && stats.plans.length > 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
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
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => {
    const colorClasses: Record<string, string> = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    };

    return (
        <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
    );
};

const UsersContent = ({ users, searchTerm, setSearchTerm }: any) => {
    const filteredUsers = users.filter((u: any) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                    <UserPlus className="h-4 w-4" />
                    Adicionar Usuário
                </button>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usuário</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sermões</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Assinatura</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((u: any) => (
                            <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">{u.name || 'Sem nome'}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.role === 'ADMIN'
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${u.isActive
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                        }`}>
                                        {u.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                    {u._count?.sermons || 0}
                                </td>
                                <td className="px-6 py-4">
                                    {u.subscriptions?.[0] ? (
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {u.subscriptions[0].plan.name}
                                            </div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                {u.subscriptions[0].status}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500">Sem plano</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Mostrando {filteredUsers.length} de {users.length} usuários
            </div>
        </div>
    );
};

const SermonsContent = ({ stats }: any) => (
    <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Sermões</h3>
        <p className="text-gray-500 dark:text-gray-400">Total: {stats?.sermons || 0} sermões</p>
    </div>
);

const SubscriptionsContent = ({ stats }: any) => (
    <div className="text-center py-12">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Assinaturas</h3>
        <p className="text-gray-500 dark:text-gray-400">Ativas: {stats?.activeSubscriptions || 0}</p>
    </div>
);

const PlansContent = ({ stats }: any) => (
    <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Planos</h3>
        <p className="text-gray-500 dark:text-gray-400">Total: {stats?.plans?.length || 0} planos</p>
    </div>
);

const WebhooksContent = ({ webhooks }: any) => (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Monitor de Webhooks</h3>
            <code className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded text-sm text-indigo-600 dark:text-indigo-400">
                /api/webhook/purchase
            </code>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fonte</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Evento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {webhooks?.map((w: any) => (
                        <tr key={w.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(w.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {w.source}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {w.eventType}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${w.processed
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                    }`}>
                                    {w.processed ? 'Processado' : 'Pendente'}
                                </span>
                                {w.error && <div className="text-xs text-red-500 mt-1">{w.error}</div>}
                            </td>
                        </tr>
                    ))}
                    {(!webhooks || webhooks.length === 0) && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                Nenhum evento registrado
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const AnalyticsContent = ({ stats }: any) => (
    <div className="text-center py-12">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analytics</h3>
        <p className="text-gray-500 dark:text-gray-400">Em desenvolvimento...</p>
    </div>
);

const SettingsContent = ({ user }: any) => (
    <div className="text-center py-12">
        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Configurações</h3>
        <p className="text-gray-500 dark:text-gray-400">Logado como: {user?.email}</p>
    </div>
);

const SupportContent = () => (
    <div className="text-center py-12">
        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Central de Suporte</h3>
        <p className="text-gray-500 dark:text-gray-400">Entre em contato pelo email: contato@sermonia.app</p>
    </div>
);
