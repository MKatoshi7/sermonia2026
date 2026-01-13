import React, { useEffect, useState } from 'react';
import { FileUp } from 'lucide-react';

interface AdminStats {
    users: number;
    activeUsers: number;
    sermons: number;
    sermonsGrowth: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    revenue: number;
    mrrGrowth: number;
}

interface AdminDashboardProps {
    token: string | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token }) => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [savingSetting, setSavingSetting] = useState(false);
    const [error, setError] = useState('');
    const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
    const [parsedUsers, setParsedUsers] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetchStats();
            fetchSettings();
            fetchWebhookLogs();
        }
    }, [token]);

    const fetchWebhookLogs = async () => {
        try {
            const res = await fetch('/api/admin/webhook-logs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setWebhookLogs(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Falha ao carregar estatísticas');
            const data = await res.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const saveSetting = async (key: string, value: string) => {
        setSavingSetting(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key, value, description: 'Pre-prompt para geração de imagens' })
            });

            if (res.ok) {
                setSettings(prev => ({ ...prev, [key]: value }));
                alert('Configuração salva!');
            } else {
                throw new Error('Erro ao salvar');
            }
        } catch (err) {
            alert('Erro ao salvar configuração');
        } finally {
            setSavingSetting(false);
        }
    };

    const handleImportUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length < 2) { alert('Arquivo vazio ou inválido'); return; }

            const headers = lines[0].split(';').map(h => h.trim());

            console.log('📋 Cabeçalhos encontrados:', headers);

            // Buscar índices das colunas necessárias
            const nameIdx = headers.indexOf('Nome');
            const emailIdx = headers.indexOf('Email');
            const dddIdx = headers.indexOf('DDD');
            const phoneIdx = headers.indexOf('Telefone');
            const productIdx = headers.indexOf('Nome do Produto');

            if (nameIdx === -1 || emailIdx === -1) {
                alert('❌ Colunas "Nome" e "Email" não encontradas no CSV.\n\nFormato esperado (primeira linha = cabeçalho):\nNome do Produto;Nome do Produtor;Documento do Produtor;Nome do Afiliado;Transação;Meio de Pagamento;Origem;Moeda;Preço do Produto;Moeda;Preço da Oferta;Taxa de Câmbio;Moeda;Preço Original;Número da Parcela;Recorrência;Data de Venda;Data de Confirmação;Status;Nome;Documento;Email;DDD;Telefone;CEP;Cidade;Estado;Bairro;País;Endereço;Número;Complemento;chave;Código do Produto;Código da Afiliação;Código de Oferta;Origem de Checkout;Tipo de Pagamento;Período Grátis;Tem co-produção;Venda feita como;Preço Total;Tipo pagamento oferta;Taxa de Câmbio Real;Preço Total Convertido;Quantidade de itens;Oferta de Upgrade;Cupom;Moeda;Valor que você recebeu convertido;Taxa de Câmbio do valor recebido;Data Vencimento;Instagram;Origem da venda;Moeda de recebimento;Faturamento líquido;Código do assinante;Nota Fiscal;Valor do frete bruto');
                return;
            }

            console.log(`✅ Índices encontrados - Nome: ${nameIdx}, Email: ${emailIdx}, DDD: ${dddIdx}, Telefone: ${phoneIdx}, Produto: ${productIdx}`);

            const users = lines.slice(1).map((line, idx) => {
                const cols = line.split(';').map(c => c.trim());

                // Validar se a linha tem colunas suficientes
                if (cols.length < Math.max(nameIdx + 1, emailIdx + 1)) {
                    console.warn(`⚠️ Linha ${idx + 2} ignorada - colunas insuficientes`);
                    return null;
                }

                const name = cols[nameIdx];
                const email = cols[emailIdx];
                const ddd = dddIdx !== -1 ? cols[dddIdx] : '';
                const phone = phoneIdx !== -1 ? cols[phoneIdx] : '';
                const fullPhone = ddd && phone ? `${ddd}${phone}` : (phone || '');
                const product = productIdx !== -1 ? cols[productIdx] : 'SermonIA PRO';

                // Validar dados essenciais
                if (!email || !name) {
                    console.warn(`⚠️ Linha ${idx + 2} ignorada - Nome ou Email vazio`);
                    return null;
                }

                console.log(`✅ Linha ${idx + 2} - ${name} (${email}) - ${fullPhone} - ${product}`);

                return { name, email, phone: fullPhone, product };
            }).filter(u => u !== null);

            console.log(`📊 Total de usuários válidos: ${users.length}`);

            if (users.length === 0) {
                alert('❌ Nenhum usuário válido encontrado no CSV. Verifique o formato do arquivo.');
                return;
            }

            setParsedUsers(users);
            e.target.value = ''; // Reset input
        };

        reader.readAsText(file);
    };

    const confirmImport = async () => {
        if (!parsedUsers.length) return;
        if (!confirm(`Confirmar importação de ${parsedUsers.length} usuários?`)) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/users/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users: parsedUsers })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Importação concluída!\n\nCriados: ${data.created}\nPulados (já existem): ${data.skipped}\nErros: ${data.errors.length}\n\n${data.errors.slice(0, 5).join('\n')}${data.errors.length > 5 ? '...' : ''}`);
                setParsedUsers([]);
                fetchStats();
            } else {
                alert('Erro na importação: ' + (data.error || 'Erro desconhecido'));
            }
        } catch (err) {
            alert('Erro ao enviar dados');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-8 animate-fadeIn">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Dashboard Administrativa</h1>

            {loading && <p className="text-slate-500">Carregando dados...</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total de Usuários */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total de Usuários</p>
                    <p className="text-3xl font-bold mt-2 text-slate-900">{stats?.users ?? '-'}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        <span className="text-emerald-600 font-medium">{stats?.activeUsers ?? '-'} ativos</span>
                    </p>
                </div>

                {/* Sermões Criados */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sermões Criados</p>
                    <p className="text-3xl font-bold mt-2 text-indigo-600">{stats?.sermons ?? '-'}</p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <span className={`${(stats?.sermonsGrowth || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'} font-medium`}>
                            {(stats?.sermonsGrowth || 0) > 0 ? '+' : ''}{stats?.sermonsGrowth ?? 0}%
                        </span>
                        esta semana
                    </p>
                </div>

                {/* Assinaturas Ativas */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Assinaturas Ativas</p>
                    <p className="text-3xl font-bold mt-2 text-slate-900">{stats?.activeSubscriptions ?? '-'}</p>
                    <p className="text-sm text-slate-500 mt-1">
                        de {stats?.totalSubscriptions ?? '-'} total
                    </p>
                </div>

                {/* MRR */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">MRR</p>
                    <p className="text-3xl font-bold mt-2 text-emerald-600">
                        {stats?.revenue !== undefined ? `R$ ${stats.revenue.toLocaleString('pt-BR')}` : '-'}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <span className={`${(stats?.mrrGrowth || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'} font-medium`}>
                            {(stats?.mrrGrowth || 0) > 0 ? '+' : ''}{stats?.mrrGrowth ?? 0}%
                        </span>
                        este mês
                    </p>
                </div>
            </div>

            {/* Monitor de Webhooks */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Monitor de Webhooks (GGCheckout)</h2>
                    <button onClick={fetchWebhookLogs} className="text-sm text-indigo-600 hover:underline">Atualizar</button>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                    <p className="text-sm text-slate-500 font-bold uppercase mb-2">URL do Webhook</p>
                    <code className="block bg-slate-900 text-green-400 p-3 rounded-md font-mono text-sm overflow-x-auto">
                        /api/webhook/purchase
                    </code>
                    <p className="text-xs text-slate-500 mt-2">
                        Configure esta URL na GGCheckout para receber eventos de compra automaticamente.
                        <br />
                        Os usuários serão criados com plano <strong>SermonIA PRO (vitalício)</strong> por padrão.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-4 py-2">Data</th>
                                <th className="px-4 py-2">Origem</th>
                                <th className="px-4 py-2">Evento</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Payload</th>
                            </tr>
                        </thead>
                        <tbody>
                            {webhookLogs.map((log) => (
                                <tr key={log.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-4 py-2 whitespace-nowrap">{new Date(log.createdAt).toLocaleString('pt-BR')}</td>
                                    <td className="px-4 py-2">{log.source}</td>
                                    <td className="px-4 py-2 font-medium">{log.eventType}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${log.processed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {log.processed ? 'Processado' : 'Pendente'}
                                        </span>
                                        {log.error && <span className="block text-xs text-red-500 mt-1">{log.error}</span>}
                                    </td>
                                    <td className="px-4 py-2">
                                        <details className="cursor-pointer">
                                            <summary className="text-indigo-600 text-xs">Ver JSON</summary>
                                            <pre className="mt-2 p-2 bg-slate-100 rounded text-xs overflow-x-auto max-w-xs">
                                                {log.payload}
                                            </pre>
                                        </details>
                                    </td>
                                </tr>
                            ))}
                            {webhookLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center text-slate-500">Nenhum webhook recebido ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Configurações do Sistema */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Configurações do Sistema</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Pre-prompt de Geração de Imagem
                        </label>
                        <p className="text-xs text-slate-500 mb-2">
                            Este texto será adicionado antes do pedido do usuário para melhorar a qualidade das imagens.
                        </p>
                        <textarea
                            value={settings['image_gen_pre_prompt'] || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, 'image_gen_pre_prompt': e.target.value }))}
                            className="w-full border border-slate-300 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-mono text-sm"
                            placeholder="Ex: Create a photorealistic, cinematic, high quality image..."
                        />
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={() => saveSetting('image_gen_pre_prompt', settings['image_gen_pre_prompt'] || '')}
                                disabled={savingSetting}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                            >
                                {savingSetting ? 'Salvando...' : 'Salvar Configuração'}
                            </button>
                        </div>
                    </div>

                    {/* Feature Flags */}
                    <div className="pt-4 border-t border-slate-200">
                        <h3 className="text-sm font-bold text-slate-700 mb-3">Funcionalidades</h3>
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div>
                                <p className="font-bold text-slate-800">Geração de Imagens com IA</p>
                                <p className="text-xs text-slate-500">Habilita o botão de gerar imagens para todos os usuários.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings['feature_image_generation_enabled'] === 'true'}
                                    onChange={(e) => saveSetting('feature_image_generation_enabled', e.target.checked ? 'true' : 'false')}
                                    disabled={savingSetting}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gerenciamento de Usuários */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Gerenciamento de Usuários</h2>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-2">Importar Usuários (CSV da GGCheckout)</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Faça upload do arquivo CSV exportado da GGCheckout para criar usuários em lote.
                        <br />
                        <strong>Formato esperado (primeira linha = cabeçalho):</strong>
                        <br />
                        <div className="bg-white p-3 rounded border border-slate-200 mt-2 mb-2 overflow-x-auto">
                            <code className="text-xs text-slate-700 whitespace-nowrap block">
                                Nome do Produto;Nome do Produtor;Documento do Produtor;Nome do Afiliado;Transação;Meio de Pagamento;Origem;Moeda;Preço do Produto;Moeda;Preço da Oferta;Taxa de Câmbio;Moeda;Preço Original;Número da Parcela;Recorrência;Data de Venda;Data de Confirmação;Status;Nome;Documento;Email;DDD;Telefone;CEP;Cidade;Estado;Bairro;País;Endereço;Número;Complemento;chave;Código do Produto;Código da Afiliação;Código de Oferta;Origem de Checkout;Tipo de Pagamento;Período Grátis;Tem co-produção;Venda feita como;Preço Total;Tipo pagamento oferta;Taxa de Câmbio Real;Preço Total Convertido;Quantidade de itens;Oferta de Upgrade;Cupom;Moeda;Valor que você recebeu convertido;Taxa de Câmbio do valor recebido;Data Vencimento;Instagram;Origem da venda;Moeda de recebimento;Faturamento líquido;Código do assinante;Nota Fiscal;Valor do frete bruto
                            </code>
                        </div>
                        <span className="text-xs text-slate-500 block mb-2">
                            📋 <strong>Colunas obrigatórias:</strong> Nome (coluna 20) e Email (coluna 22)
                        </span>
                        <span className="text-xs text-slate-500 block mb-2">
                            📞 <strong>Colunas opcionais:</strong> DDD (coluna 23), Telefone (coluna 24), Nome do Produto (coluna 1)
                        </span>
                        <span className="text-xs text-emerald-600 font-medium block">
                            ✅ Todos os usuários serão criados com plano <strong>SermonIA PRO (vitalício)</strong>
                        </span>
                    </p>

                    <div className="flex items-center gap-4">
                        <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer flex items-center gap-2">
                            <FileUp className="w-4 h-4" />
                            Escolher Arquivo CSV
                            <input
                                type="file"
                                accept=".csv,.txt"
                                className="hidden"
                                onChange={handleImportUsers}
                            />
                        </label>
                        <span className="text-xs text-slate-500">
                            Os usuários criados serão marcados para definir senha no primeiro acesso.
                        </span>
                    </div>

                    {parsedUsers.length > 0 && (
                        <div className="mt-6 animate-fadeIn">
                            <h4 className="font-bold text-slate-800 mb-2">Pré-visualização ({parsedUsers.length} usuários)</h4>
                            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg mb-4">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2">Nome</th>
                                            <th className="px-4 py-2">Email</th>
                                            <th className="px-4 py-2">Telefone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsedUsers.map((u, i) => (
                                            <tr key={i} className="bg-white border-b hover:bg-slate-50">
                                                <td className="px-4 py-2 font-medium text-slate-900">{u.name}</td>
                                                <td className="px-4 py-2">{u.email}</td>
                                                <td className="px-4 py-2">{u.phone}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setParsedUsers([])}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmImport}
                                    disabled={loading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Importando...' : 'Confirmar Importação'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <p>Dados em tempo real do banco de dados Postgres.</p>
            </div>
        </div>
    );
};
