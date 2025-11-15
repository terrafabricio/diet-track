// src/components/StatusBadge.tsx (Substituição Completa)

import { OrderStatus } from '@/types/diet';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
    status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const statusTextMap: Record<OrderStatus, string> = {
        novo: 'Novo',
        em_preparo: 'Em Preparo',
        pronto: 'Pronto',
        entregue: 'Entregue',
        cancelado: 'Cancelado',
    };

    const statusColorMap: Record<OrderStatus, string> = {
        novo: 'bg-blue-500 text-white',
        em_preparo: 'bg-yellow-500 text-black',
        pronto: 'bg-green-500 text-white',
        entregue: 'bg-gray-500 text-white',
        cancelado: 'bg-red-500 text-white',
    };

    return (
        <Badge className={cn('capitalize', statusColorMap[status])}>
            {statusTextMap[status]}
        </Badge>
    );
}
