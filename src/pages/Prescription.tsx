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

        try {
            const prescricaoParaSalvar = {
                paciente_id: parseInt(selectedPacienteId, 10),
                dieta_base_id: parseInt(selectedDietaId, 10),
                modificador_id: selectedModificadorId ? parseInt(selectedModificadorId, 10) : null,
                observacoes: observacoes,
                status_prescricao: 'ativa'
            };

            const { data: prescricaoData, error: prescricaoError } = await supabase
                .from('Prescricoes')
                .insert(prescricaoParaSalvar)
                .select()
                .single();

            if (prescricaoError) {
                console.error('Erro ao salvar prescrição:', prescricaoError);
                toast({ title: "Erro", description: "Falha ao salvar prescrição.", variant: "destructive" });
            } else {
                // Criação dos pedidos no telão
                const novaPrescricaoId = (prescricaoData as any).id;
                const pedidosParaCriar = [
                    { prescricao_id: novaPrescricaoId, refeicao: 'Almoço', status: 'novo' as const },
                    { prescricao_id: novaPrescricaoId, refeicao: 'Jantar', status: 'novo' as const }
                ];
                await supabase.from('PedidosProducao').insert(pedidosParaCriar);

                toast({ title: "Prescrição salva", description: "Prescrição registrada com sucesso.", variant: "default" });
                setSelectedPacienteId(null);
                setSelectedDietaId(null);
                setSelectedModificadorId(null);
                setObservacoes('');
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Erro", description: "Erro inesperado ao salvar.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Nova Prescrição</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Paciente</Label>
                                <Select onValueChange={(v) => setSelectedPacienteId(v)} value={selectedPacienteId ?? undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um paciente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pacientes.map(p => (
                                            <SelectItem key={p.id} value={String(p.id)}>{p.nome} — {p.leito}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Dieta Base</Label>
                                <Select onValueChange={(v) => setSelectedDietaId(v)} value={selectedDietaId ?? undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a dieta base" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dietas.map(d => (
                                            <SelectItem key={d.id} value={String(d.id)}>{d.nome_dieta}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Modificador (opcional)</Label>
                                <Select onValueChange={(v) => setSelectedModificadorId(v)} value={selectedModificadorId ?? undefined}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um modificador (opcional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Nenhum</SelectItem>
                                        {modificadores.map(m => (
                                            <SelectItem key={m.id} value={String(m.id)}>{m.nome_modificador}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Observações</Label>
                                <Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
                            </div>

                            <div className="flex items-center justify-end">
                                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Salvar Prescrição'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default PrescriptionPage;
