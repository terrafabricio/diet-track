import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, AlertCircle, BarChart3 } from "lucide-react";
import { mockDivergences, mockNFs, mockAFs } from "@/data/mockRecebimento";
import { Severity } from "@/types/recebimento";

export default function Relatorios() {
  const [period, setPeriod] = useState("30");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  // Extend mock with more data for demo
  const allDivergences = [
    ...mockDivergences,
    {
      id: "div-3",
      nf_id: "nf-3",
      af_id: "af-1",
      field: "Item ausente — Óleo de soja",
      nf_value: "(não encontrado)",
      af_value: "100 L",
      severity: "critical" as Severity,
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: "div-4",
      nf_id: "nf-1",
      af_id: "af-1",
      field: "Preço unitário — Feijão",
      nf_value: "R$ 7,20/kg",
      af_value: "R$ 6,80/kg",
      severity: "warning" as Severity,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];

  const filtered = allDivergences.filter((d) => {
    if (filterSeverity !== "all" && d.severity !== filterSeverity) return false;
    const daysAgo = (Date.now() - new Date(d.created_at).getTime()) / 86400000;
    return daysAgo <= parseInt(period);
  });

  const criticalCount = filtered.filter((d) => d.severity === "critical").length;
  const warningCount = filtered.filter((d) => d.severity === "warning").length;

  const severityConfig: Record<Severity, { label: string; color: string; icon: typeof AlertTriangle }> = {
    critical: { label: "Crítico", color: "bg-destructive text-destructive-foreground", icon: AlertTriangle },
    warning: { label: "Atenção", color: "bg-warning text-warning-foreground", icon: AlertCircle },
    info: { label: "Info", color: "bg-primary text-primary-foreground", icon: AlertCircle },
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Visão geral das divergências</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Críticas</SelectItem>
              <SelectItem value="warning">Atenção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Críticas</p>
                <p className="text-3xl font-bold text-destructive">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atenção</p>
                <p className="text-3xl font-bold text-warning">{warningCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{filtered.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Divergence List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Divergências Recentes</CardTitle>
          <CardDescription>Filtradas por período e severidade</CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma divergência encontrada para o filtro selecionado.
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((div) => {
                const config = severityConfig[div.severity];
                const Icon = config.icon;
                const nf = mockNFs.find((n) => n.id === div.nf_id);
                const af = mockAFs.find((a) => a.id === div.af_id);

                return (
                  <div key={div.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start gap-3 flex-wrap">
                      <Badge className={config.color}>
                        <Icon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{div.field}</p>
                        <div className="mt-1 grid gap-1 text-xs text-muted-foreground">
                          <p>NF: ...{nf?.nf_key.slice(-8) || "?"} → "{div.nf_value}"</p>
                          <p>AF: {af?.af_number || "?"} → "{div.af_value}"</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {new Date(div.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
