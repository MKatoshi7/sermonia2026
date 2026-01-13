import React, { useState, useEffect } from 'react';
import { Webhook, Send, RefreshCw, Eye, Trash2, CheckCircle, XCircle, Clock, Copy } from 'lucide-react';

interface WebhookManagementProps {
    token: string | null;
}

export const WebhookManagement: React.FC<WebhookManagementProps> = ({ token }) => {
    const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [testMode, setTestMode] = useState(false);

    // Campos do teste de webhook
    const [testPayload, setTestPayload] = useState({
        product_name: 'Plano Anual',
        product_value: '897.00',
        customer_email: 'teste@email.com',
        customer_name: 'João Silva',
        customer_phone: '11999999999',
        status: 'approved',
        transaction_id: 'TEST-' + Date.now()
    });

    useEffect(() => {
        if (token) {
            fetchWebhookLogs();
        }
    }, [token]);

    const fetchWebhookLogs = async () => {
        try {
            const response = await fetch('/api/admin/webhook-logs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWebhookLogs(data);
            }
        } catch (error) {
            console.error('Error fetching webhook logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendTestWebhook = async () => {
        try {
            const response = await fetch('/api/webhook/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testPayload)
            });

            const result = await response.json();
            alert(response.ok ? '✅ Webhook teste enviado!' : '❌ Erro: ' + result.error);
            fetchWebhookLogs();
        } catch (error: any) {
            alert('Erro: ' + error.message);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copiado!');
    };

    if (loading) {
        return <div className="text-center py-12">Carregando logs...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Webhooks & Logs
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Teste webhooks e monitore requisições
                    </p>
                </div>
                <button
                    onClick={() => setTestMode(!testMode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${testMode
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                >
                    {testMode ? 'Ver Logs' : 'Testar Webhook'}
                </button>
            </div>

            {testMode ? (
                /* Modo Teste */
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Testar Webhook de Compra
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                value={testPayload.product_name}
                                onChange={(e) => setTestPayload({ ...testPayload, product_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                placeholder="Plano Anual"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Valor</label>
                            <input
                                type="text"
                                value={testPayload.product_value}
                                onChange={(e) => setTestPayload({ ...testPayload, product_value: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                placeholder="897.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email do Cliente</label>
                            <input
                                type="email"
                                value={testPayload.customer_email}
                                onChange={(e) => setTestPayload({ ...testPayload, customer_email: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                placeholder="cliente@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nome do Cliente</label>
                            <input
                                type="text"
                                value={testPayload.customer_name}
                                onChange={(e) => setTestPayload({ ...testPayload, customer_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                placeholder="João Silva"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Telefone</label>
                            <input
                                type="text"
                                value={testPayload.customer_phone}
                                onChange={(e) => setTestPayload({ ...testPayload, customer_phone: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                placeholder="11999999999"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={testPayload.status}
                                onChange={(e) => setTestPayload({ ...testPayload, status: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                            >
                                <option value="approved">Aprovado</option>
                                <option value="pending">Pendente</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-sm font-bold mb-2">Preview do Payload:</h4>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(testPayload, null, 2)}
                        </pre>
                    </div>

                    <button
                        onClick={sendTestWebhook}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                    >
                        <Send className="h-5 w-5" />
                        Enviar Webhook de Teste
                    </button>

                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        💡 <strong>Dica:</strong> Este webhook irá criar/atualizar usuário e assinatura conforme configurado.
                    </div>
                </div>
            ) : (
                /* Lista de Logs */
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total de webhooks: {webhookLogs.length}
                        </div>
                        <button
                            onClick={fetchWebhookLogs}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Produto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Valor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Data</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {webhookLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Nenhum webhook recebido ainda
                                        </td>
                                    </tr>
                                ) : (
                                    webhookLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-6 py-4">
                                                {log.status === 'success' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : log.status === 'error' ? (
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-yellow-600" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{log.customerName}</div>
                                                <div className="text-sm text-gray-500">{log.customerEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">{log.productName}</td>
                                            <td className="px-6 py-4">R$ {log.value}</td>
                                            <td className="px-6 py-4">
                                                {new Date(log.createdAt).toLocaleString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal de Detalhes */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Detalhes do Webhook</h3>
                            <button onClick={() => setSelectedLog(null)} className="text-gray-500 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded overflow-auto">
                            {JSON.stringify(selectedLog, null, 2)}
                        </pre>
                        <button
                            onClick={() => copyToClipboard(JSON.stringify(selectedLog, null, 2))}
                            className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2"
                        >
                            <Copy className="h-4 w-4" />
                            Copiar JSON
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
