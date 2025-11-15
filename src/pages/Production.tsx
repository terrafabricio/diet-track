// src/pages/Production.tsx (Substituição Completa)

import { useEffect, useState } from 'react';
// Importa seus tipos originais
import { Order, OrderStatus } from '@/types/diet';
// Importa a "ponte" que criamos na Ação 1
import { supabase } from '@/lib/supabaseClient';
// Importa o "bloco de montar" que criamos na Ação 2
import { OrderColumn } from '@/components/OrderColumn';
// Importa os componentes visuais que você já tinha
import OrderCard from '@/components/OrderCard';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

// Define as colunas do Kanban, alinhadas com o banco de dados
const columns: OrderStatus[] = ['novo', 'em_preparo', 'pronto'];

export function ProductionPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // ---
    // FUNÇÃO 1: Buscar os dados iniciais do Supabase
    // ---
    async function fetchOrders() {
        setLoading(true);
        
        // Esta é a consulta ao banco de dados real
        const { data, error } = await supabase
            .from('PedidosProducao')
            .select(`
                id,
                refeicao,
                status,
                criado_em,
                Prescricoes (
                    observacoes,
                    Pacientes ( nome, leito ),
                    DietasBase ( nome_dieta ),
                    Modificadores ( nome_modificador )
                )
            `)
            // Filtra para mostrar apenas pedidos ativos no Kanban
            .in('status', ['novo', 'em_preparo', 'pronto'])
            .order('criado_em', { ascending: false });

        if (error) {
            console.error('Erro ao buscar pedidos:', error.message);
        } else if (data) {
            // Converte os dados do banco (ex: "nome_dieta") para o formato do seu app (ex: "diet")
            const formattedOrders: Order[] = data.map((item: any) => {
                const presc = item.Prescricoes;
                // Lógica para combinar nomes de dieta, ex: "Branda + Hipossódica"
                const dieta = presc.Modificadores
                    ? `${presc.DietasBase.nome_dieta} + ${presc.Modificadores.nome_modificador}`
                    : presc.DietasBase.nome_dieta;
                
                return {
                    id: item.id.toString(),
                    patientName: presc.Pacientes.nome,
                    bed: presc.Pacientes.leito,
                    diet: dieta,
                    meal: item.refeicao,
                    status: item.status as OrderStatus,
                    createdAt: new Date(item.criado_em),
                    notes: presc.observacoes
                };
            });
            setOrders(formattedOrders);
        }
        setLoading(false);
    }

    // ---
    // FUNÇÃO 2: Lidar com o "Arrastar e Soltar" (Atualizar Status)
    // ---
    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        // Verifica se o card foi movido para uma coluna diferente
        if (over && active.id !== over.id) {
            const orderId = active.id.toString();
            const newStatus = over.id as OrderStatus; // O ID da coluna é o novo status

            // 1. Atualiza a tela (UI) imediatamente (Otimista)
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );

            // 2. Envia a atualização para o banco de dados Supabase
            const { error } = await supabase
                .from('PedidosProducao')
                .update({ 
                    status: newStatus, 
                    atualizado_em: new Date().toISOString() 
                })
                .eq('id', parseInt(orderId));
            
            if (error) {
                console.error('Erro ao atualizar status:', error);
            }
        }
    }

    // ---
    // FUNÇÃO 3: Buscar dados iniciais E "Ouvir" o banco em Tempo Real (WebSockets)
    // ---
    useEffect(() => {
        // 1. Busca os dados assim que a tela carrega
        fetchOrders();

        // 2. Esta é a mágica do WebSocket (O "pipocar" do pedido)
        const channel = supabase
            .channel('pedidos_producao_changes')
            .on(
                'postgres_changes',
                { 
                    event: 'INSERT', // "Ouvir" apenas novos pedidos (INSERT)
                    schema: 'public', 
                    table: 'PedidosProducao' // Na tabela que criamos
                },
                (payload) => {
                    console.log('Novo pedido recebido!', payload.new);
                    // Quando um novo pedido "pipocar", recarregamos a lista inteira
                    fetchOrders();
                }
            )
            .subscribe();

        // 3. Limpa a "audição" quando o usuário sai da tela
        return () => {
            supabase.removeChannel(channel);
        };
    }, []); // O [] vazio garante que isso rode apenas uma vez

    // ---
    // O RENDER (O que o usuário vê)
    // ---
    if (loading) {
        return <div className="p-4 text-center">Carregando Telão da Cozinha...</div>;
    }

    // O JSX (visual) é idêntico ao seu código original, mas agora é alimentado por 'orders' do Supabase
    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex h-[calc(100vh-80px)] gap-4 p-4 overflow-x-auto">
                {columns.map((status) => (
                    <OrderColumn key={status} status={status}>
                        {orders
                            .filter((order) => order.status === status)
                            .map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                    </OrderColumn>
                ))}
            </div>
        </DndContext>
    );
}

export default ProductionPage;
