import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "success" | "warning" | "error";
}

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  subtitle,
  variant = "default" 
}: StatCardProps) => {
  const variantStyles = {
    default: "border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
    success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10",
    error: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    error: "text-destructive"
  };

  return (
    <Card className={`${variantStyles[variant]} border-2 transition-all hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`rounded-full p-3 ${iconStyles[variant]} bg-background`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
