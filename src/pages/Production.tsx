import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/OrderCard";
import { mockOrders } from "@/data/mockData";
import { Order } from "@/types/diet";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Production = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const newOrders = orders.filter(o => o.status === "Novo");
  const preparingOrders = orders.filter(o => o.status === "Em Preparo");
  const readyOrders = orders.filter(o => o.status === "Pronto");

  const handleStartPreparation = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: "Em Preparo" as const, startedAt: new Date(), assignedTo: "Equipe 1" }
        : o
    ));
    setSelectedOrder(null);
    toast({
      title: "Pedido iniciado",
      description: "O pedido está em preparo.",
    });
  };

  const handleMarkReady = (orderId: string) => {
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, status: "Pronto" as const, readyAt: new Date() }
        : o
    ));
    setSelectedOrder(null);
    toast({
      title: "Pedido pronto!",
      description: "A copeira foi notificada.",
      className: "bg-success text-success-foreground"
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Painel de Produção</h1>
              <p className="text-muted-foreground">Refeição: Jantar - 17:30h</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-3 w-3 bg-success rounded-full animate-pulse" />
              Atualização em tempo real
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <Card className="flex-1 border-status-new/30 bg-status-new/5">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-medium">Pedidos Totais</span>
              <span className="text-3xl font-bold text-status-new">{orders.length}</span>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Coluna NOVOS */}
          <Card className="border-status-new/30">
            <CardHeader className="bg-status-new/10">
              <CardTitle className="flex items-center justify-between">
                <span>Novos</span>
                <span className="text-2xl font-bold text-status-new">{newOrders.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 max-h-[800px] overflow-y-auto">
              {newOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
              {newOrders.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pedido novo
                </p>
              )}
            </CardContent>
          </Card>

          {/* Coluna EM PREPARO */}
          <Card className="border-status-preparing/30">
            <CardHeader className="bg-status-preparing/10">
              <CardTitle className="flex items-center justify-between">
                <span>Em Preparo</span>
                <span className="text-2xl font-bold text-status-preparing">{preparingOrders.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 max-h-[800px] overflow-y-auto">
              {preparingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
              {preparingOrders.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pedido em preparo
                </p>
              )}
            </CardContent>
          </Card>

          {/* Coluna PRONTO */}
          <Card className="border-status-ready/30">
            <CardHeader className="bg-status-ready/10">
              <CardTitle className="flex items-center justify-between">
                <span>Pronto p/ Entrega</span>
                <span className="text-2xl font-bold text-status-ready">{readyOrders.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 max-h-[800px] overflow-y-auto">
              {readyOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
              {readyOrders.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pedido pronto
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Informações completas e composição da dieta
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Paciente</Label>
                  <p className="font-semibold">{selectedOrder.patientName}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Leito</Label>
                  <p className="font-semibold">{selectedOrder.room}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Setor</Label>
                  <p className="font-semibold">{selectedOrder.sector}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Dieta</Label>
                  <p className="font-semibold">{selectedOrder.diet}</p>
                </div>
              </div>

              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="text-base">Composição da Dieta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <span>Arroz (papa)</span>
                    <span className="text-muted-foreground">100g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <span>Feijão batido</span>
                    <span className="text-muted-foreground">60g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <span>Prato Principal (carne/frango/peixe)</span>
                    <span className="text-muted-foreground">100g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <span>Legumes (purê)</span>
                    <span className="text-muted-foreground">80g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <span>Sobremesa (fruta macia)</span>
                    <span className="text-muted-foreground">100g</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                {selectedOrder.status === "Novo" && (
                  <Button 
                    onClick={() => handleStartPreparation(selectedOrder.id)}
                    className="flex-1 bg-status-preparing hover:bg-status-preparing/90"
                  >
                    Iniciar Preparo
                  </Button>
                )}
                {selectedOrder.status === "Em Preparo" && (
                  <Button 
                    onClick={() => handleMarkReady(selectedOrder.id)}
                    className="flex-1 bg-status-ready hover:bg-status-ready/90"
                  >
                    Marcar como Pronto
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="flex-1">
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

export default Production;
