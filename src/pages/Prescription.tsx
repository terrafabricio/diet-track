// src/pages/Prescription.tsx (Correção do Erro de Build)

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Paciente {
    id: number;
    nome: string;
    leito: string;
}
interface DietaBase {
    id: number;
    nome_dieta: string;
}
interface Modificador {
    id: number;
    nome_modificador: string;
}

export function PrescriptionPage() {
    const { toast } = useToast();
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [dietas, setDietas] = useState<DietaBase[]>([]);
    const [modificadores, setModificadores] = useState<Modificador[]>([]);
    
    const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);
    const [selectedDietaId, setSelectedDietaId] = useState<string | null>(null);
    const [selectedModificadorId, setSelectedModificadorId] = useState<string | null>(null);
    const [observacoes, setObservacoes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function loadInitialData() {
        const { data: pacientesData, error: pacientesError } = await supabase
            .from('Pacientes')
            .select('*');
        if (pacientesError) console.error('Erro ao buscar pacientes:', pacientesError);
        else setPacientes(pacientesData || []);

        const { data: dietasData, error: dietasError } = await supabase
            .from('DietasBase')
            .select('*');
        if (dietasError) console.error('Erro ao buscar dietas:', dietasError);
        else setDietas(dietasData || []);

        const { data: modificadoresData, error: modificadoresError } = await supabase
            .from('Modificadores')
            .select('*');
        if (modificadoresError) console.error('Erro ao buscar modificadores:', modificadoresError);
        else setModificadores(modificadoresData || []);
    }

    useEffect(() => {
        loadInitialData();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedPacienteId || !selectedDietaId) {
            toast({ title: "Erro", description: "Paciente e Dieta Base são obrigatórios.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);

        const prescricaoParaSalvar = {
            paciente_id: parseInt(selectedPacienteId),
            dieta_base_id: parseInt(selectedDietaId),
            modificador_id: selectedModificadorId ? parseInt(selectedModificadorId) : null,
            observacoes: observacoes,
            status_prescricao: 'ativa'
        };

        const { data: prescricaoData, error: prescricaoError } = await supabase
            .from('Prescricoes')
            .insert(prescricaoParaSalvar)
            .select()
            .single();

        if (prescricaoError || !prescricaoData) {
            console.error('Erro ao salvar prescrição:', prescricaoError);
            toast({ title: "Erro no Servidor", description: "Não foi possível salvar a prescrição.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        // AQUI ESTÁ A CORREÇÃO: Adicionamos "as any" para o Vercel não travar
        const novaPrescricaoId = (prescricaoData as any).id;
        
        const pedidosParaCriar = [
            { prescricao_id: novaPrescricaoId, refeicao: 'Almoço', status: 'novo' as const },
            { prescricao_id: novaPrescricaoId, refeicao: 'Jantar', status: 'novo' as const }
        ];

        const { error: pedidosError } = await supabase
            .from('PedidosProducao')
            .insert(pedidosParaCriar);

        if (pedidosError) {
            console.error('Erro ao criar pedidos de produção:', pedidosError);
            toast({ title: "Erro no Servidor", description: "Prescrição salva, mas falhou ao enviar para a cozinha.", variant: "destructive" });
        } else {
            toast({ title: "Sucesso!", description: "Prescrição salva e enviada para a produção." });
        }

        setSelectedPacienteId(null);
        setSelectedDietaId(null);
        setSelectedModificadorId(null);
        setObservacoes('');
        setIsSubmitting(false);
    }

    return (
        <div className="p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Nova Prescrição de Dieta</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="paciente">Paciente</Label>
                            <Select 
                                value={selectedPacienteId || ''} 
                                onValueChange={setSelectedPacienteId}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="paciente">
                                    <SelectValue placeholder="Selecione um paciente..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {pacientes.map((p) => (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.leito} - {p.nome}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dieta-base">Dieta Base (Consistência)</Label>
                            <Select 
                                value={selectedDietaId || ''} 
                                onValueChange={setSelectedDietaId}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="dieta-base">
                                    <SelectValue placeholder="Selecione a dieta base..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {dietas.map((d) => (
                                        <SelectItem key={d.id} value={d.id.toString()}>
                                            {d.nome_dieta}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="modificador">Modificador (Terapêutica)</Label>
                            <Select 
                                value={selectedModificadorId || ''} 
                                onValueChange={(value) => setSelectedModificadorId(value === 'null' ? null : value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id="modificador">
                                    <SelectValue placeholder="Selecione (opcional)..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">Nenhum</SelectItem>
                                    {modificadores.map((m) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.nome_modificador}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="observacoes">Observações</Label>
                            <Textarea
                                id="observacoes"
                                placeholder="Ex: Paciente recusa mamão, preferência por maçã..."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar e Enviar para Produção"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default PrescriptionPage;
