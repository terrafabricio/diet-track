import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Camera, CameraOff, CheckCircle2, Keyboard, AlertTriangle } from "lucide-react";

type ScanStatus = "idle" | "scanning" | "success" | "error" | "manual";

export default function ReceberNF() {
  const { toast } = useToast();
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [nfKey, setNfKey] = useState("");
  const [unitCode, setUnitCode] = useState("9152");
  const [saving, setSaving] = useState(false);
  const scannerRef = useRef<any>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    setScanStatus("scanning");
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setNfKey(decodedText);
          setScanStatus("success");
          scanner.stop().catch(() => {});
          toast({ title: "QR Code lido com sucesso!" });
        },
        () => {} // ignore scan failures
      );
    } catch (err) {
      console.error("Scanner error:", err);
      setScanStatus("error");
      toast({
        title: "Erro ao acessar câmera",
        description: "Verifique as permissões ou use a entrada manual.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanStatus("idle");
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleSave = async () => {
    if (!nfKey.trim()) {
      toast({ title: "Informe a chave da NF", variant: "destructive" });
      return;
    }
    setSaving(true);
    // Mock save
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "NF registrada com sucesso!", description: `Chave: ...${nfKey.slice(-8)}` });
    setNfKey("");
    setScanStatus("idle");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Receber Nota Fiscal</h1>
        <p className="text-muted-foreground">Escaneie o QR Code do DANFE ou digite a chave manualmente</p>
      </div>

      {/* Scanner Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Passo 1 — Ler chave da NF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scanStatus === "idle" && (
            <div className="flex gap-3">
              <Button onClick={startScanner} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Ativar Câmera
              </Button>
              <Button variant="outline" onClick={() => setScanStatus("manual")} className="flex-1">
                <Keyboard className="mr-2 h-4 w-4" />
                Digitar Manual
              </Button>
            </div>
          )}

          {scanStatus === "scanning" && (
            <div className="space-y-3">
              <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
                <div id="qr-reader" ref={videoRef} className="w-full" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                    Procurando QR Code…
                  </span>
                </div>
              </div>
              <Button variant="outline" onClick={stopScanner} className="w-full">
                <CameraOff className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}

          {scanStatus === "success" && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="text-sm font-medium">Lido com sucesso</p>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {nfKey}
                </p>
              </div>
            </div>
          )}

          {scanStatus === "error" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium">Erro de permissão</p>
                  <p className="text-xs text-muted-foreground">
                    Verifique se o navegador tem acesso à câmera. Use HTTPS.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setScanStatus("manual")} className="w-full">
                <Keyboard className="mr-2 h-4 w-4" />
                Digitar manualmente
              </Button>
            </div>
          )}

          {(scanStatus === "manual" || scanStatus === "success") && (
            <div className="space-y-2">
              <Label htmlFor="nf-key">Chave de Acesso (44 dígitos)</Label>
              <Input
                id="nf-key"
                placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
                value={nfKey}
                onChange={(e) => setNfKey(e.target.value.replace(/\D/g, ""))}
                className="font-mono text-sm"
                maxLength={44}
              />
              <p className="text-xs text-muted-foreground">
                {nfKey.length}/44 dígitos
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Confirm */}
      {(nfKey.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Passo 2 — Confirmar e salvar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={unitCode} onValueChange={setUnitCode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9152">9152</SelectItem>
                  <SelectItem value="6023">6023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 space-y-1">
              <p className="text-xs text-muted-foreground">Chave da NF</p>
              <p className="font-mono text-sm break-all">{nfKey}</p>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar NF"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
