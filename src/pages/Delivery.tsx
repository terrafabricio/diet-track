import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockOrders } from "@/data/mockData";
import { Order } from "@/types/diet";
import { ArrowLeft, PackageCheck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { OrderCard } from "@/components/OrderCard";

const Delivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [inTransit, setInTransit] = useState<string[]>([]);

  const readyOrders = orders.filter(o => o.status === "Pronto" && !inTransit.includes(o.id));
  const transitOrders = orders.filter(o => inTransit.includes(o.id));

  const handlePickup = (orderId: string) => {
    setInTransit([...inTransit, orderId]);
    toast({
      title: "Bandeja coletada",
      description: "Item adicionado ao carrinho de entrega.",
    });
  };

  const handleDeliver = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: "Entregue" as const, deliveredAt: new Date(), deliveredBy: "Sandra" }
        : o
    ));
    setInTransit(inTransit.filter(id => id !== orderId));
    toast({
      title: "✅ Entrega Confirmada!",
      description: `Horário da baixa: ${new Date().toLocaleTimeString('pt-BR')}`,
      className: "bg-success text-success-foreground"
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Minhas Entregas</h1>
            <p className="text-muted-foreground">Setor: Enfermaria A - Jantar</p>
          </div>
        </div>

        {/* Em Rota */}
        {transitOrders.length > 0 && (
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="bg-warning/10">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5" />
                  Em Rota
                </span>
                <span className="text-2xl font-bold text-warning">{transitOrders.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {transitOrders.map((order) => (
                <Card key={order.id} className="border-2 border-warning/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-warning mb-1">Leito: {order.room}</p>
                        <p className="font-semibold">{order.patientName}</p>
                        <p className="text-sm text-muted-foreground">{order.diet}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleDeliver(order.id)}
                      className="w-full bg-success hover:bg-success/90 text-lg py-6"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirmar Entrega
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Aguardando Coleta */}
        <Card className="border-status-ready/30">
          <CardHeader className="bg-status-ready/10">
            <CardTitle className="flex items-center justify-between">
              <span>Aguardando Coleta na Cozinha</span>
              <span className="text-2xl font-bold text-status-ready">{readyOrders.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {readyOrders.map((order) => (
              <Card key={order.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-primary mb-1">Leito: {order.room}</p>
                      <p className="font-semibold">{order.patientName}</p>
                      <p className="text-sm text-muted-foreground">{order.diet}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handlePickup(order.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <PackageCheck className="mr-2 h-4 w-4" />
                    Coletar Bandeja
                  </Button>
                </CardContent>
              </Card>
            ))}
            {readyOrders.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma bandeja aguardando coleta
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Delivery;
