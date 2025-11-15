// src/components/OrderColumn.tsx

import { OrderStatus } from '@/types/diet';
import { useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';

interface OrderColumnProps {
    status: OrderStatus;
    children: React.ReactNode;
}

export function OrderColumn({ status, children }: OrderColumnProps) {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    const statusTextMap: Record<OrderStatus, string> = {
        novo: 'Novos',
        em_preparo: 'Em Preparo',
        pronto: 'Pronto p/ Entrega',
        entregue: 'Entregue',
        cancelado: 'Cancelado',
    };

    return (
        <div
            ref={setNodeRef}
            className="flex-1 p-4 bg-muted/50 rounded-lg min-w-[300px]"
        >
            <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                {statusTextMap[status]}
                <Badge
                    variant="outline"
                    className="h-6 w-6 flex items-center justify-center"
                >
                    {Array.isArray(children) ? children.length : 0}
                </Badge>
            </h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}
