import React from 'react';
import { CreditCard } from 'lucide-react';

interface SubscriptionsManagementProps {
    token: string | null;
}

export const SubscriptionsManagement: React.FC<SubscriptionsManagementProps> = ({ token }) => {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Gerenciamento de Assinaturas
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Em desenvolvimento...
                </p>
            </div>
        </div>
    );
};
