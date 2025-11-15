import { OrderStatus } from "@/types/diet";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, CheckCircle2, PackageCheck } from "lucide-react";

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  "Novo": {
    icon: Clock,
    className: "bg-status-new text-white",
    label: "Novo"
  },
  "Em Preparo": {
    icon: ChefHat,
    className: "bg-status-preparing text-white",
    label: "Em Preparo"
  },
  "Pronto": {
    icon: PackageCheck,
    className: "bg-status-ready text-white",
    label: "Pronto"
  },
  "Entregue": {
    icon: CheckCircle2,
    className: "bg-status-delivered text-white",
    label: "Entregue"
  }
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} gap-1.5`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
};
