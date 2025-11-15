// src/pages/Prescription.tsx (Substituição Completa)

import { useEffect, useState } from 'react';
// Importa o conector que criamos
import { supabase } from '@/lib/supabaseClient';
// Importa os componentes de UI que seu app usa (com os caminhos corretos)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// ---
// Definindo os tipos para os dados que virão do banco
// ---
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
    
    // ---
    // Estados do Formulário (O que o usuário seleciona)
    // ---
    const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);
    const [selectedDietaId, setSelectedDietaId] = useState<string | null>(null);
    const [selectedModificadorId, setSelectedModificadorId] = useState<string | null>(null);
    const [observacoes, setObservacoes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ---
    // FUNÇÃO 1: Buscar os dados para preencher os Dropdowns
    // ---
    async function loadInitialData() {
        // (Em um app real, os pacientes viriam do HIS ou filtro por setor)
        // Por agora, vamos buscar todos
        const { data: pacientesData, error: pacientesError } = await supabase
            .from('Pacientes')
            .select('*');
        if (pacientesError) console.error('Erro ao buscar pacientes:', pacientesError);
        else setPacientes(pacientesData || []);

        // Busca as dietas-base que cadastramos
        const { data: dietasData, error: dietasError } = await supabase
            .from('DietasBase')
            .select('*');
        if (dietasError) console.error('Erro ao buscar dietas:', dietasError);
        else setDietas(dietasData || []);

        // Busca os modificadores que cadastramos
        const { data: modificadoresData, error: modificadoresError } = await supabase
            .from('Modificadores')
            .select('*');
        if (modificadoresError) console.error('Erro ao buscar modificadores:', modificadoresError);
        else setModificadores(modificadoresData || []);
    }

    // ---
    // FUNÇÃO 2: Rodar a FUNÇÃO 1 quando a tela carregar
    // ---
    useEffect(() => {
        loadInitialData();
    }, []);

    // ---
    // FUNÇÃO 3: Salvar a Prescrição (O "Cérebro" do app)
    // ---
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedPacienteId || !selectedDietaId) {
            toast({ title: "Erro", description: "Paciente e Dieta Base são obrigatórios.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);

        // ---
        // ETAPA A: Salvar a Prescrição (na Tabela 'Prescricoes')
        // ---
        const prescricaoParaSalvar = {
            paciente_id: parseInt(selectedPacienteId),
            dieta_base_id: parseInt(selectedDietaId),
            // Converte 'null' ou o ID string para o formato do banco
            modificador_id: selectedModificadorId ? parseInt(selectedModificadorId) : null,
            observacoes: observacoes,
            status_prescricao: 'ativa'
        };

        const { data: prescricaoData, error: prescricaoError } = await supabase
            .from('Prescricoes')
            .insert(prescricaoParaSalvar)
            .select() // Pede ao Supabase para retornar o registro que acabou de ser criado
            .single(); // Esperamos apenas um

        if (prescricaoError || !prescricaoData) {
            console.error('Erro ao salvar prescrição:', prescricaoError);
            toast({ title: "Erro no Servidor", description: "Não foi possível salvar a prescrição.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        // ---
        // ETAPA B: Criar os Pedidos (na Tabela 'PedidosProducao')
        // ISSO É O QUE VAI FAZER "PIPOCAR" NO TELÃO!
        // ---
        const novaPrescricaoId = prescricaoData.id;
        
        // (Em um sistema completo, isso seria mais inteligente,
        // mas para o MVP, vamos criar pedidos para Almoço e Jantar)
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

        // Limpa o formulário
        setSelectedPacienteId(null);
        setSelectedDietaId(null);
        setSelectedModificadorId(null);
        setObservacoes('');
        setIsSubmitting(false);
    }

    // ---
    // O RENDER (O que o usuário vê)
    // ---
    return (
        <div className="p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Nova Prescrição de Dieta</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* --- Campo Paciente --- */}
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

                        {/* --- Campo Dieta Base --- */}
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

                        {/* --- Campo Modificador --- */}
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

                        {/* --- Campo Observações --- */}
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

                        {/* --- Botão Salvar --- */}
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
