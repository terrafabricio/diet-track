import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GitCompare, AlertTriangle, AlertCircle, Copy, CheckCircle2, Loader2 } from "lucide-react";
import { mockNFs, mockAFs, mockAFItems } from "@/data/mockRecebimento";
import { Divergence, Severity } from "@/types/recebimento";

function normalize(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export default function Confrontar() {
  const { toast } = useToast();
  const [selectedNFId, setSelectedNFId] = useState<string>("");
  const [selectedAFId, setSelectedAFId] = useState<string>("");
  const [divergences, setDivergences] = useState<Divergence[]>([]);
  const [compared, setCompared] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedNF = mockNFs.find((nf) => nf.id === selectedNFId);
  const selectedAF = mockAFs.find((af) => af.id === selectedAFId);

  const handleCompare = async () => {
    if (!selectedNF || !selectedAF) {
      toast({ title: "Selecione NF e AF", variant: "destructive" });
      return;
    }

    setComparing(true);
    await new Promise((r) => setTimeout(r, 800));

    const divs: Divergence[] = [];
    const now = new Date().toISOString();

    // Compare supplier
    if (normalize(selectedNF.supplier_name || "") !== normalize(selectedAF.supplier_name)) {
      divs.push({
        id: `d-${Date.now()}-1`,
        nf_id: selectedNF.id,
        af_id: selectedAF.id,
        field: "Fornecedor",
        nf_value: selectedNF.supplier_name || "(não informado)",
        af_value: selectedAF.supplier_name,
        severity: "critical",
        created_at: now,
      });
    }

    // Compare unit_code
    if (selectedNF.unit_code !== selectedAF.unit_code) {
      divs.push({
        id: `d-${Date.now()}-2`,
        nf_id: selectedNF.id,
        af_id: selectedAF.id,
        field: "Unidade",
        nf_value: selectedNF.unit_code,
        af_value: selectedAF.unit_code,
        severity: "critical",
        created_at: now,
      });
    }

    // Simulate item divergences
    const afItems = mockAFItems.filter((i) => i.af_id === selectedAF.id);
    if (afItems.length > 0) {
      // Simulate: first item has qty divergence
      const first = afItems[0];
      const simulatedNFQty = first.qty - 20;
      divs.push({
        id: `d-${Date.now()}-3`,
        nf_id: selectedNF.id,
        af_id: selectedAF.id,
        field: `Quantidade — ${first.product_name}`,
        nf_value: `${simulatedNFQty} ${first.unit}`,
        af_value: `${first.qty} ${first.unit}`,
        severity: "critical",
        created_at: now,
      });

      // Last item missing from NF
      if (afItems.length > 2) {
        const last = afItems[afItems.length - 1];
        divs.push({
          id: `d-${Date.now()}-4`,
          nf_id: selectedNF.id,
          af_id: selectedAF.id,
          field: `Item ausente na NF`,
          nf_value: "(não encontrado)",
          af_value: `${last.product_name} — ${last.qty} ${last.unit}`,
          severity: "critical",
          created_at: now,
        });
      }
    }

    setDivergences(divs);
    setCompared(true);
    setComparing(false);
  };

  const severityConfig: Record<Severity, { label: string; color: string; icon: typeof AlertTriangle }> = {
    critical: { label: "Crítico", color: "bg-destructive text-destructive-foreground", icon: AlertTriangle },
    warning: { label: "Atenção", color: "bg-warning text-warning-foreground", icon: AlertCircle },
    info: { label: "Info", color: "bg-primary text-primary-foreground", icon: AlertCircle },
  };

  const generateEmail = () => {
    const lines = divergences.map(
      (d) => `• ${d.field}: NF="${d.nf_value}" × AF="${d.af_value}" [${severityConfig[d.severity].label}]`
    );

    return `Prezados,

Informamos que foram identificadas divergências no confronto entre a Nota Fiscal e a Autorização de Fornecimento:

Unidade: ${selectedNF?.unit_code}
Fornecedor: ${selectedAF?.supplier_name}
AF: ${selectedAF?.af_number}
NF: ...${selectedNF?.nf_key.slice(-8)}

DIVERGÊNCIAS ENCONTRADAS:
${lines.join("\n")}

Solicitamos ajuste conforme dados da AF.

Atenciosamente,
Setor de Recebimento`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateEmail());
    setCopied(true);
    toast({ title: "E-mail copiado!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Confrontar AF × NF</h1>
        <p className="text-muted-foreground">Compare os documentos e identifique divergências</p>
      </div>

      {/* Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            Selecionar documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nota Fiscal (NF)</label>
              <Select value={selectedNFId} onValueChange={setSelectedNFId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a NF" />
                </SelectTrigger>
                <SelectContent>
                  {mockNFs.map((nf) => (
                    <SelectItem key={nf.id} value={nf.id}>
                      ...{nf.nf_key.slice(-8)} — {nf.supplier_name || "N/A"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Autorização de Fornecimento (AF)</label>
              <Select value={selectedAFId} onValueChange={setSelectedAFId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a AF" />
                </SelectTrigger>
                <SelectContent>
                  {mockAFs.map((af) => (
                    <SelectItem key={af.id} value={af.id}>
                      {af.af_number} — {af.supplier_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handleCompare}
            disabled={!selectedNFId || !selectedAFId || comparing}
            className="w-full"
          >
            {comparing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Comparando...</>
            ) : (
              <><GitCompare className="mr-2 h-4 w-4" />Confrontar</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {compared && (
        <>
          {divergences.length === 0 ? (
            <Card className="border-success/30 bg-success/5">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <h3 className="font-semibold">Nenhuma divergência encontrada!</h3>
                <p className="text-sm text-muted-foreground">Os documentos estão compatíveis.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Divergências ({divergences.length})</span>
                    <div className="flex gap-2">
                      <Badge variant="destructive">{divergences.filter((d) => d.severity === "critical").length} críticas</Badge>
                      <Badge className="bg-warning text-warning-foreground">{divergences.filter((d) => d.severity === "warning").length} atenção</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {divergences.map((div) => {
                    const config = severityConfig[div.severity];
                    const Icon = config.icon;
                    return (
                      <div key={div.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-start gap-3">
                          <Badge className={config.color} >
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{div.field}</p>
                            <div className="mt-1 grid gap-1 text-xs">
                              <p><span className="text-muted-foreground">NF:</span> {div.nf_value}</p>
                              <p><span className="text-muted-foreground">AF:</span> {div.af_value}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Email Template */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">E-mail de Ajuste</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <pre className="whitespace-pre-wrap text-xs bg-muted/50 p-4 rounded-lg border font-mono max-h-[300px] overflow-auto">
                    {generateEmail()}
                  </pre>
                  <Button onClick={handleCopy} variant="outline" className="w-full">
                    {copied ? (
                      <><CheckCircle2 className="mr-2 h-4 w-4" />Copiado!</>
                    ) : (
                      <><Copy className="mr-2 h-4 w-4" />Copiar e-mail</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
