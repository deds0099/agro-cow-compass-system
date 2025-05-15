import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type Animal = Database["public"]["Tables"]["animais"]["Row"];
type Producao = Database["public"]["Tables"]["producao"]["Row"];

interface Alerta {
  id: string;
  tipo: "parto" | "producao" | "inseminacao" | "sanitario";
  animal: string;
  descricao: string;
  data: string;
  resolvido: boolean;
  prioridade: "alta" | "media" | "baixa";
}

export default function Alertas() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("pendentes");
  const { toast } = useToast();

  useEffect(() => {
    carregarAlertas();
  }, []);

  const carregarAlertas = async () => {
    try {
      const user_id = (await supabase.auth.getUser()).data.user?.id;

      // Carregar animais
      const { data: animais, error: animaisError } = await supabase
        .from("animais")
        .select("*")
        .eq("user_id", user_id);

      if (animaisError) throw animaisError;

      // Carregar produção
      const { data: producao, error: producaoError } = await supabase
        .from("producao")
        .select("*")
        .eq("user_id", user_id)
        .order("data", { ascending: false });

      if (producaoError) throw producaoError;

      // Carregar alertas resolvidos
      const { data: alertasResolvidos, error: alertasError } = await supabase
        .from("alertas")
        .select("*")
        .eq("user_id", user_id);

      if (alertasError) throw alertasError;

      const novosAlertas: Alerta[] = [];

      // Verificar próximos partos
      animais?.forEach(animal => {
        if (animal.data_proximo_parto) {
          const dataParto = new Date(animal.data_proximo_parto);
          const hoje = new Date();
          const diffDias = Math.ceil((dataParto.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDias <= 7) {
            const alertaId = `parto-${animal.id}`;
            const alertaResolvido = alertasResolvidos?.find(a => a.id === alertaId);
            
            novosAlertas.push({
              id: alertaId,
              tipo: "parto",
              animal: `${animal.numero} - ${animal.nome}`,
              descricao: `Parto previsto para ${diffDias === 0 ? "hoje" : `em ${diffDias} dias`}`,
              data: animal.data_proximo_parto,
              resolvido: alertaResolvido?.resolvido || false,
              prioridade: diffDias <= 3 ? "alta" : "media"
            });
          }
        }
      });

      // Verificar queda na produção
      animais?.forEach(animal => {
        const producoesAnimal = producao?.filter(p => p.animal_id === animal.id);
        if (producao && producoesAnimal && producoesAnimal.length >= 3) {
          const mediaAntiga = producoesAnimal.slice(1, 4).reduce((acc, p) => acc + p.quantidade, 0) / 3;
          const mediaRecente = producoesAnimal.slice(0, 3).reduce((acc, p) => acc + p.quantidade, 0) / 3;
          const variacao = ((mediaRecente - mediaAntiga) / mediaAntiga) * 100;

          if (variacao < -15) {
            const alertaId = `producao-${animal.id}`;
            const alertaResolvido = alertasResolvidos?.find(a => a.id === alertaId);
            
            novosAlertas.push({
              id: alertaId,
              tipo: "producao",
              animal: `${animal.numero} - ${animal.nome}`,
              descricao: `Queda de ${Math.abs(variacao).toFixed(1)}% na produção nos últimos 3 dias`,
              data: producoesAnimal[0].data,
              resolvido: alertaResolvido?.resolvido || false,
              prioridade: "alta"
            });
          }
        }
      });

      setAlertas(novosAlertas);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar alertas",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Aplicar filtros
  const alertasFiltrados = alertas.filter((alerta) => {
    const filtroTipoOk = filtroTipo === "todos" || alerta.tipo === filtroTipo;
    const filtroStatusOk = 
      filtroStatus === "todos" || 
      (filtroStatus === "pendentes" && !alerta.resolvido) ||
      (filtroStatus === "resolvidos" && alerta.resolvido);
    
    return filtroTipoOk && filtroStatusOk;
  });
  
  // Marcar alerta como resolvido
  const handleResolverAlerta = async (id: string) => {
    try {
      const user_id = (await supabase.auth.getUser()).data.user?.id;

      // Verificar se o alerta já existe
      const { data: alertaExistente } = await supabase
        .from("alertas")
        .select("*")
        .eq("id", id)
        .eq("user_id", user_id)
        .single();

      if (alertaExistente) {
        // Atualizar alerta existente
        const { error } = await supabase
          .from("alertas")
          .update({ resolvido: true })
          .eq("id", id)
          .eq("user_id", user_id);

        if (error) throw error;
      } else {
        // Criar novo registro de alerta
        const { error } = await supabase
          .from("alertas")
          .insert({
            id,
            user_id,
            resolvido: true,
            data_resolucao: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Atualizar estado local
      setAlertas(alertas.map((alerta) => 
        alerta.id === id ? { ...alerta, resolvido: true } : alerta
      ));

      toast({
        title: "Alerta resolvido",
        description: "O alerta foi marcado como resolvido com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao resolver alerta",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Alertas e Notificações" />
      
      <div className="flex gap-4 mb-6">
        <select
          className="px-3 py-2 border rounded-md"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos os Tipos</option>
          <option value="parto">Partos</option>
          <option value="producao">Produção</option>
          <option value="inseminacao">Inseminação</option>
          <option value="sanitario">Sanitário</option>
        </select>
        
        <select
          className="px-3 py-2 border rounded-md"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos os Status</option>
          <option value="pendentes">Pendentes</option>
          <option value="resolvidos">Resolvidos</option>
        </select>
      </div>
      
      <div className="grid gap-4">
        {alertasFiltrados.map((alerta) => (
          <Card 
            key={alerta.id}
            className={`${
              alerta.resolvido ? "opacity-60" : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        alerta.tipo === "parto" 
                          ? "bg-farm-warning" 
                          : alerta.tipo === "producao" 
                            ? "bg-farm-alert" 
                            : "bg-farm-info"
                      }
                    >
                      {alerta.tipo}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={
                        alerta.prioridade === "alta" 
                          ? "border-red-500 text-red-500" 
                          : alerta.prioridade === "media" 
                            ? "border-yellow-500 text-yellow-500" 
                            : "border-green-500 text-green-500"
                      }
                    >
                      {alerta.prioridade}
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{alerta.animal}</h3>
                  <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alerta.data).toLocaleDateString()}
                  </p>
                </div>
                
                {!alerta.resolvido && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleResolverAlerta(alerta.id)}
                  >
                    Marcar como Resolvido
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {alertasFiltrados.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Nenhum alerta encontrado com os filtros selecionados.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
