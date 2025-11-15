// src/components/OrderCard.tsx (Substituição Completa)

import { Order } from '@/types/diet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { useDraggable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';

interface OrderCardProps {
    order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: order.id,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className="mb-4 relative group"
        >
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                {...listeners}
                {...attributes}
            >
                <GripVertical className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex justify-between items-center">
                    <span>{order.patientName}</span>
                    <StatusBadge status={order.status} />
                </CardTitle>
                <p className="text-sm text-muted-foreground">Leito {order.bed}</p>
            </CardHeader>
            <CardContent>
                <p className="font-medium">{order.diet}</p>
                <p className="text-sm text-muted-foreground">{order.meal}</p>
                {order.notes && (
                    <p className="text-sm mt-2 pt-2 border-t">
                        <span className="font-semibold">Obs:</span> {order.notes}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
