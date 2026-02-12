import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanLine, FileUp, GitCompare, BarChart3, ArrowRight } from "lucide-react";
import { mockNFs, mockAFs, mockDivergences } from "@/data/mockRecebimento";

const actions = [
  {
    title: "Receber NF",
    description: "Ler QR Code ou digitar chave de acesso",
    icon: ScanLine,
    to: "/app/receber",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Importar AF",
    description: "Upload de PDF ou foto com OCR",
    icon: FileUp,
    to: "/app/importar-af",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Confrontar",
    description: "Comparar AF × NF e identificar divergências",
    icon: GitCompare,
    to: "/app/confrontar",
    color: "bg-warning/10 text-warning",
  },
  {
    title: "Relatórios",
    description: "Divergências e métricas dos últimos 30 dias",
    icon: BarChart3,
    to: "/app/relatorios",
    color: "bg-destructive/10 text-destructive",
  },
];

export default function AppDashboard() {
  const navigate = useNavigate();

  const recentItems = [
    ...mockNFs.slice(0, 3).map((nf) => ({
      id: nf.id,
      type: "NF" as const,
      label: `NF ...${nf.nf_key.slice(-8)}`,
      supplier: nf.supplier_name || "—",
      date: nf.created_at,
    })),
    ...mockAFs.slice(0, 2).map((af) => ({
      id: af.id,
      type: "AF" as const,
      label: af.af_number,
      supplier: af.supplier_name,
      date: af.created_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bem-vindo ao Recebimento</h1>
        <p className="text-muted-foreground">
          {mockDivergences.length} divergência(s) pendente(s) · {mockNFs.length} NFs registradas
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <Card
            key={action.to}
            className="cursor-pointer hover:shadow-md transition-shadow group"
            onClick={() => navigate(action.to)}
          >
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`rounded-xl p-3 ${action.color} shrink-0`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold flex items-center gap-2">
                  {action.title}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Começar recebimento</h3>
            <p className="text-sm text-muted-foreground">Escaneie a NF e faça o confronto com a AF</p>
          </div>
          <Button onClick={() => navigate("/app/receber")}>
            <ScanLine className="mr-2 h-4 w-4" />
            Iniciar
          </Button>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Últimos Registros</CardTitle>
          <CardDescription>NFs e AFs mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={item.type === "NF" ? "default" : "secondary"}>
                    {item.type}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.supplier}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
