import React from 'react';
import { Webhook } from 'lucide-react';

interface WebhooksManagementProps {
    token: string | null;
}

export const WebhooksManagement: React.FC<WebhooksManagementProps> = ({ token }) => {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <Webhook className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Monitor de Webhooks
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                    URL do webhook: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                        https://seudominio.com/api/webhook/purchase
                    </code>
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Configure este webhook na sua plataforma de pagamentos (Hotmart, Stripe, etc)
                </p>
            </div>
        </div>
    );
};
