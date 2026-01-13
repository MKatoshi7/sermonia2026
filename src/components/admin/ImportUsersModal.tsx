import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
    token: string | null;
    onComplete: () => void;
}

export const ImportUsersModal: React.FC<ImportUsersModalProps> = ({
    isOpen,
    onClose,
    token,
    onComplete
}) => {
    const [csvText, setCsvText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleImport = async () => {
        setLoading(true);
        setResult(null);

        try {
            // Parse CSV
            const lines = csvText.trim().split('\n');

            const csvData = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                return {
                    nome: values[0] || '',
                    telefone: values[1] || '',
                    email: values[2] || ''
                };
            });

            // Envia para API
            const response = await fetch('/api/admin/import-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ csvData })
            });

            const data = await response.json();
            setResult(data);

            if (data.success) {
                setTimeout(() => {
                    onComplete();
                    handleClose();
                }, 3000);
            }

        } catch (error: any) {
            setResult({
                success: false,
                error: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setCsvText('');
        setResult(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                Importar Usuários CSV
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Cole os dados no formato CSV abaixo
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Formato esperado */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Formato esperado (primeira linha = cabeçalho):
                                </p>
                                <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700 overflow-x-auto">
                                    nome,telefone,email
                                    João Silva,11999999999,joao@email.com
                                    Maria Santos,11988888888,maria@email.com
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Text area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cole os dados CSV:
                        </label>
                        <textarea
                            value={csvText}
                            onChange={(e) => setCsvText(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="nome,telefone,email&#10;João Silva,11999999999,joao@email.com"
                        />
                    </div>

                    {/* Result */}
                    {result && (
                        <div className={`p-4 rounded-lg border ${result.success
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                            }`}>
                            <div className="flex items-start gap-2">
                                {result.success ? (
                                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    <p className={`font-medium ${result.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                                        }`}>
                                        {result.message || result.error}
                                    </p>
                                    {result.results && (
                                        <div className="mt-2 text-sm">
                                            <p className="text-gray-700 dark:text-gray-300">
                                                ✓ Sucessos: {result.results.success}/{result.results.total}
                                            </p>
                                            {result.results.errors.length > 0 && (
                                                <details className="mt-2">
                                                    <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                                                        Ver erros ({result.results.errors.length})
                                                    </summary>
                                                    <ul className="mt-2 space-y-1 text-xs max-h-40 overflow-y-auto">
                                                        {result.results.errors.map((err: any, i: number) => (
                                                            <li key={i} className="text-red-600 dark:text-red-400">
                                                                {err.row.email || 'Email vazio'}: {err.error}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={loading || !csvText.trim()}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Importando...' : 'Importar Usuários'}
                        </button>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 pt-4">
                        ℹ️ Todos os usuários importados receberão senha temporária "senha123" e serão obrigados a trocar no primeiro login.
                    </div>
                </div>
            </div>
        </div>
    );
};
