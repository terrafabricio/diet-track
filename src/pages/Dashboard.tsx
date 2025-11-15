import { StatCard } from "@/components/StatCard";
import { Clock, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const stats = {
    avgTime: 28,
    delayed: 3,
    delivered: 312,
    inProgress: mockOrders.filter(o => o.status === "Em Preparo").length
  };

  const statusCounts = {
    new: mockOrders.filter(o => o.status === "Novo").length,
    preparing: mockOrders.filter(o => o.status === "Em Preparo").length,
    ready: mockOrders.filter(o => o.status === "Pronto").length
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Sistema de Nutrição Hospitalar
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestão em tempo real de dietas e pedidos
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/prescricao")}
              className="bg-primary hover:bg-primary/90"
            >
              Prescrever Dieta
            </Button>
            <Button 
              onClick={() => navigate("/producao")}
              variant="outline"
            >
              Ver Produção
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tempo Médio de Entrega"
            value={`${stats.avgTime} min`}
            subtitle="Meta: < 45 min"
            icon={Clock}
            variant="success"
          />
          <StatCard
            title="Pedidos Atrasados"
            value={stats.delayed}
            subtitle="Hoje"
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            title="Refeições Entregues"
            value={stats.delivered}
            subtitle="Hoje"
            icon={CheckCircle2}
            variant="default"
          />
          <StatCard
            title="Em Produção"
            value={stats.inProgress}
            subtitle="Agora"
            icon={TrendingUp}
            variant="default"
          />
        </div>

        {/* Status em Tempo Real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-3 w-3 bg-success rounded-full animate-pulse" />
              Status em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 bg-status-new/10 rounded-lg">
                <span className="font-medium">Novos</span>
                <span className="text-3xl font-bold text-status-new">{statusCounts.new}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-status-preparing/10 rounded-lg">
                <span className="font-medium">Em Preparo</span>
                <span className="text-3xl font-bold text-status-preparing">{statusCounts.preparing}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-status-ready/10 rounded-lg">
                <span className="font-medium">Prontos</span>
                <span className="text-3xl font-bold text-status-ready">{statusCounts.ready}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análise de Gargalo */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Tempo por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Recepção do Pedido</span>
                  <span className="text-sm text-muted-foreground">10 min</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "33%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Produção (Montagem)</span>
                  <span className="text-sm text-muted-foreground">18 min</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: "60%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Logística (Copa)</span>
                  <span className="text-sm text-muted-foreground">8 min</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: "27%" }} />
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>Insight:</strong> O maior tempo está na etapa de Produção (montagem das bandejas).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
