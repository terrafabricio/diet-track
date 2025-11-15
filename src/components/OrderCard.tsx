import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/types/diet";
import { StatusBadge } from "./StatusBadge";
import { MapPin, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  const timeAgo = formatDistanceToNow(order.createdAt, { 
    addSuffix: true,
    locale: ptBR 
  });

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-2"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-bold text-lg">{order.room}</span>
            <span className="text-sm text-muted-foreground">({order.sector})</span>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{order.patientName}</span>
          </div>
          
          <div className="bg-primary/10 rounded-md p-2">
            <p className="text-sm font-semibold text-primary">{order.diet}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>

          {order.assignedTo && (
            <p className="text-xs text-muted-foreground">
              Responsável: {order.assignedTo}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
