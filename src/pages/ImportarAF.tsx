import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUp, FileText, Eye, Save, Loader2, AlertCircle } from "lucide-react";

type Step = "upload" | "review" | "saved";

export default function ImportarAF() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");

  // Extracted data
  const [rawText, setRawText] = useState("");
  const [afNumber, setAfNumber] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [unitCode, setUnitCode] = useState("9152");
  const [sourceType, setSourceType] = useState<string>("pdf_text");
  const [items, setItems] = useState<Array<{ product_name: string; qty: string; unit: string; price: string }>>([
    { product_name: "", qty: "", unit: "kg", price: "" },
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setProcessing(true);

    // Simulate text extraction (in production: pdfjs-dist or tesseract.js)
    await new Promise((r) => setTimeout(r, 1500));

    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (isPDF) {
      setSourceType("pdf_text");
      // Simulated extracted text
      const mockText = `AUTORIZAÇÃO DE FORNECIMENTO\nNº AF-2025/${String(Math.floor(Math.random() * 9000) + 1000).padStart(6, "0")}\n\nFornecedor: ${file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")}\nUnidade: ${unitCode}\n\nITENS:\n1. Arroz tipo 1 - 500 kg - R$ 3,50/kg\n2. Feijão carioca - 200 kg - R$ 6,80/kg\n3. Óleo de soja - 100 L - R$ 5,20/L`;
      setRawText(mockText);

      // Best-effort parsing
      const afMatch = mockText.match(/AF-\d+\/\d+/);
      if (afMatch) setAfNumber(afMatch[0]);

      const supplierMatch = mockText.match(/Fornecedor:\s*(.+)/i);
      if (supplierMatch) setSupplierName(supplierMatch[1].trim());

      setItems([
        { product_name: "Arroz tipo 1", qty: "500", unit: "kg", price: "3.50" },
        { product_name: "Feijão carioca", qty: "200", unit: "kg", price: "6.80" },
        { product_name: "Óleo de soja", qty: "100", unit: "L", price: "5.20" },
      ]);
    } else if (isImage) {
      setSourceType("photo_ocr");
      setRawText("(Texto extraído via OCR - simulado para demo)\n\nConteúdo da imagem seria processado por Tesseract.js");
      setAfNumber("");
      setSupplierName("");
    } else {
      toast({ title: "Formato não suportado", description: "Envie um PDF ou imagem (JPG, PNG).", variant: "destructive" });
      setProcessing(false);
      return;
    }

    setProcessing(false);
    setStep("review");
    toast({ title: "Texto extraído com sucesso!", description: "Revise os dados antes de salvar." });
  };

  const addItem = () => {
    setItems([...items, { product_name: "", qty: "", unit: "kg", price: "" }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!afNumber.trim()) {
      toast({ title: "Informe o número da AF", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setStep("saved");
    toast({ title: "AF importada com sucesso!", description: `${afNumber} - ${supplierName}` });
  };

  const reset = () => {
    setStep("upload");
    setRawText("");
    setAfNumber("");
    setSupplierName("");
    setFileName("");
    setItems([{ product_name: "", qty: "", unit: "kg", price: "" }]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Importar AF</h1>
        <p className="text-muted-foreground">Upload de PDF ou foto para extração automática</p>
      </div>

      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Enviar arquivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {processing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Extraindo texto de "{fileName}"...</p>
                  <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Clique para enviar PDF ou foto</p>
                  <p className="text-xs text-muted-foreground">
                    PDF (extração de texto) · JPG/PNG (OCR)
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                A extração é best-effort. Sempre revise os dados antes de salvar.
                Para PDFs digitais, a extração é mais precisa. Fotos e PDFs escaneados usam OCR.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "review" && (
        <>
          {/* Raw text review */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Texto extraído
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="font-mono text-xs min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Fonte: {sourceType === "pdf_text" ? "PDF (texto)" : sourceType === "pdf_ocr" ? "PDF (OCR)" : "Foto (OCR)"}
              </p>
            </CardContent>
          </Card>

          {/* Parsed fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados da AF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nº da AF</Label>
                  <Input value={afNumber} onChange={(e) => setAfNumber(e.target.value)} placeholder="AF-2025/000000" />
                </div>
                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Input value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="Nome do fornecedor" />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select value={unitCode} onValueChange={setUnitCode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9152">9152</SelectItem>
                      <SelectItem value="6023">6023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Itens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="grid gap-2 grid-cols-[1fr_80px_60px_80px_auto] items-end">
                  <div>
                    {i === 0 && <Label className="text-xs">Produto</Label>}
                    <Input
                      value={item.product_name}
                      onChange={(e) => updateItem(i, "product_name", e.target.value)}
                      placeholder="Nome"
                    />
                  </div>
                  <div>
                    {i === 0 && <Label className="text-xs">Qtd</Label>}
                    <Input
                      value={item.qty}
                      onChange={(e) => updateItem(i, "qty", e.target.value)}
                      placeholder="0"
                      type="number"
                    />
                  </div>
                  <div>
                    {i === 0 && <Label className="text-xs">Un</Label>}
                    <Input
                      value={item.unit}
                      onChange={(e) => updateItem(i, "unit", e.target.value)}
                      placeholder="kg"
                    />
                  </div>
                  <div>
                    {i === 0 && <Label className="text-xs">R$/un</Label>}
                    <Input
                      value={item.price}
                      onChange={(e) => updateItem(i, "price", e.target.value)}
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="h-10 w-10 text-destructive">
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItem}>
                + Adicionar item
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={reset} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {saving ? "Salvando..." : "Salvar AF"}
            </Button>
          </div>
        </>
      )}

      {step === "saved" && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-6 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <Save className="h-6 w-6 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AF Importada!</h3>
              <p className="text-sm text-muted-foreground">{afNumber} — {supplierName}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={reset}>Importar outra</Button>
              <Button onClick={() => window.location.href = "/app/confrontar"}>Confrontar agora</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
