import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPatients } from "@/data/mockData";
import { Patient, DietBase, DietModifier } from "@/types/diet";
import { Search, User, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Prescription = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [dietBase, setDietBase] = useState<DietBase | "">("");
  const [dietModifier, setDietModifier] = useState<DietModifier>("Nenhuma");
  const [observations, setObservations] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredPatients = mockPatients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedPatient || !dietBase) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um paciente e uma dieta base.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "✅ Prescrição Salva!",
      description: "A cozinha foi notificada em tempo real.",
      className: "bg-success text-success-foreground"
    });

    // Reset form
    setSelectedPatient(null);
    setDietBase("");
    setDietModifier("Nenhuma");
    setObservations("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Prescrição de Dietas</h1>
            <p className="text-muted-foreground">Selecione um paciente e prescreva a dieta</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Lista de Pacientes */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Pacientes - Enfermaria A</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar paciente ou leito..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedPatient?.id === patient.id 
                      ? "border-2 border-primary bg-primary/5" 
                      : "border"
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{patient.name}</span>
                      </div>
                      {!patient.currentDiet && (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-3 w-3" />
                      <span>Leito: {patient.room}</span>
                    </div>
                    {patient.currentDiet ? (
                      <div className="text-sm bg-secondary rounded px-2 py-1 inline-block">
                        Dieta Atual: {patient.currentDiet}
                      </div>
                    ) : (
                      <div className="text-sm text-warning font-medium">
                        Nenhuma Prescrição Ativa
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Formulário de Prescrição */}
          <Card className={selectedPatient ? "" : "opacity-50"}>
            <CardHeader>
              <CardTitle>Prescrever Dieta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedPatient ? (
                <>
                  {/* Info do Paciente */}
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Paciente</Label>
                      <p className="font-semibold">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Leito</Label>
                      <p className="font-semibold">{selectedPatient.room}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Alergias</Label>
                      <p className="text-sm">{selectedPatient.allergies || "Nenhuma registrada"}</p>
                    </div>
                  </div>

                  {/* Formulário */}
                  <div className="space-y-4">
                    <div>
                      <Label>1. Selecione a Consistência (Base) *</Label>
                      <Select value={dietBase} onValueChange={(value) => setDietBase(value as DietBase)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Escolha a dieta base" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Livre">Dieta Livre</SelectItem>
                          <SelectItem value="Branda">Dieta Branda</SelectItem>
                          <SelectItem value="Pastosa">Dieta Pastosa</SelectItem>
                          <SelectItem value="Líquida Completa">Dieta Líquida Completa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>2. Selecione a Modificação (Terapêutica)</Label>
                      <Select value={dietModifier} onValueChange={(value) => setDietModifier(value as DietModifier)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nenhuma">Nenhuma</SelectItem>
                          <SelectItem value="Hipossódica">Hipossódica</SelectItem>
                          <SelectItem value="DM 1800 kcal">DM 1800 kcal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>3. Observações (Opcional)</Label>
                      <Textarea
                        placeholder="Ex: Paciente recusa mamão, preferência por maçã na sobremesa"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleSave} 
                      className="w-full bg-success hover:bg-success/90 text-lg py-6"
                    >
                      Salvar Prescrição Ativa
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um paciente para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
