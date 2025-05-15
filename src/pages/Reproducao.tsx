import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/date-utils";

type Animal = Database["public"]["Tables"]["animais"]["Row"];
type Reproducao = Database["public"]["Tables"]["reproducao"]["Row"];

export default function Reproducao() {
  const [indicadores, setIndicadores] = useState({
    taxaServico: 0,
    taxaConcepcao: 0,
    taxaPrenhez: 0,
    intervaloPartos: 0,
    periodoServico: 0,
    periodoSeco: 60, // Valor padrão para período seco
  });

  const [proximosPartos, setProximosPartos] = useState<Animal[]>([]);
  const [proximasInseminacoes, setProximasInseminacoes] = useState<Animal[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const user_id = (await supabase.auth.getUser()).data.user?.id;

      // Carregar animais
      const { data: animais, error: animaisError } = await supabase
        .from("animais")
        .select("*")
        .eq("user_id", user_id);

      if (animaisError) throw animaisError;

      // Carregar dados de reprodução
      const { data: reproducao, error: reproducaoError } = await supabase
        .from("reproducao")
        .select("*")
        .eq("user_id", user_id)
        .order("data_inseminacao", { ascending: false });

      if (reproducaoError) throw reproducaoError;

      // Calcular indicadores
      const animaisElegiveis = animais?.filter(a => a.status === "lactante").length || 0;
      const animaisInseminados = reproducao?.filter(r => 
        new Date(r.data_inseminacao) >= new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      ).length || 0;
      
      const animaisPrenhes = reproducao?.filter(r => r.status === "prenhe").length || 0;
      const inseminacoesSucesso = reproducao?.filter(r => 
        r.status === "prenhe" && 
        new Date(r.data_inseminacao) >= new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      ).length || 0;

      // Calcular taxas
      const taxaServico = animaisElegiveis > 0 ? (animaisInseminados / animaisElegiveis) * 100 : 0;
      const taxaConcepcao = animaisInseminados > 0 ? (inseminacoesSucesso / animaisInseminados) * 100 : 0;
      const taxaPrenhez = (taxaServico * taxaConcepcao) / 100;

      // Calcular período de serviço médio
      const periodoServico = reproducao?.reduce((acc, r) => {
        if (r.status === "prenhe") {
          const dias = Math.round(
            (new Date(r.data_inseminacao).getTime() - new Date(r.created_at).getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          return acc + dias;
        }
        return acc;
      }, 0) / (reproducao?.filter(r => r.status === "prenhe").length || 1);

      // Calcular intervalo entre partos médio
      const intervaloPartos = reproducao?.reduce((acc, r) => {
        if (r.data_prevista_parto) {
          const dias = Math.round(
            (new Date(r.data_prevista_parto).getTime() - new Date(r.data_inseminacao).getTime()) / 
            (1000 * 60 * 60 * 24)
          );
          return acc + dias;
        }
        return acc;
      }, 0) / (reproducao?.filter(r => r.data_prevista_parto).length || 1) / 30; // Converter para meses

      setIndicadores({
        taxaServico,
        taxaConcepcao,
        taxaPrenhez,
        intervaloPartos,
        periodoServico,
        periodoSeco: 60, // Valor padrão
      });

      // Filtrar próximos partos
      const partos = animais
        ?.filter(a => a.data_proximo_parto)
        .sort((a, b) => 
          new Date(a.data_proximo_parto || "").getTime() - 
          new Date(b.data_proximo_parto || "").getTime()
        )
        .slice(0, 4) || [];

      setProximosPartos(partos);

      // Filtrar próximas inseminações (animais lactantes sem data de próximo parto)
      const inseminacoes = animais
        ?.filter(a => a.status === "lactante" && !a.data_proximo_parto)
        .slice(0, 3) || [];

      setProximasInseminacoes(inseminacoes);

    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  // Definições de fórmulas e explicações
  const formulas = {
    taxaServico: {
      formula: "TS = (Vacas inseminadas / Vacas elegíveis) × 100",
      explicacao: "Porcentagem de vacas elegíveis que foram inseminadas em um período de 21 dias.",
      meta: "Meta: > 60%",
    },
    taxaConcepcao: {
      formula: "TC = (Vacas prenhes / Vacas inseminadas) × 100",
      explicacao: "Porcentagem de inseminações que resultaram em prenhez confirmada.",
      meta: "Meta: > 50%",
    },
    taxaPrenhez: {
      formula: "TP = (Taxa de serviço × Taxa de concepção) / 100",
      explicacao: "Porcentagem de vacas elegíveis que ficam prenhes em um ciclo de 21 dias.",
      meta: "Meta: > 30%",
    },
    intervaloPartos: {
      formula: "IEP = Período de serviço (dias) + Período de gestação (~280 dias)",
      explicacao: "Tempo médio entre um parto e o seguinte, em meses.",
      meta: "Meta: < 13 meses",
    },
    periodoServico: {
      formula: "PS = Dias entre o parto e a concepção efetiva",
      explicacao: "Dias entre o parto e a inseminação que resultou em prenhez.",
      meta: "Meta: < 90 dias",
    },
    periodoSeco: {
      formula: "PeriodoSeco = Dias entre secagem e o parto",
      explicacao: "Período em que a vaca permanece sem produzir leite antes do parto.",
      meta: "Meta: 45-60 dias",
    },
  };
  
  const getProgressColor = (valor: number, metaMin: number) => {
    return valor >= metaMin ? "bg-farm-success" : "bg-farm-warning";
  };
  
  const getPartoUrgencia = (dias: number) => {
    if (dias <= 3) return "bg-farm-alert text-white";
    if (dias <= 7) return "bg-farm-warning";
    return "bg-muted";
  };

  const calcularDiasRestantes = (data: string | null) => {
    if (!data) return 0;
    const hoje = new Date();
    const dataEvento = new Date(data);
    const diffTime = dataEvento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reprodução" />
      
      <Tabs defaultValue="indicadores">
        <TabsList className="mb-4">
          <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="formulas">Fórmulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="indicadores" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.taxaServico.toFixed(1)}%</div>
                <Progress 
                  className={`mt-2 ${getProgressColor(indicadores.taxaServico, 60)}`} 
                  value={indicadores.taxaServico} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: {`>`} 60%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Concepção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.taxaConcepcao.toFixed(1)}%</div>
                <Progress 
                  className={`mt-2 ${getProgressColor(indicadores.taxaConcepcao, 50)}`} 
                  value={indicadores.taxaConcepcao} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: {`>`} 50%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Prenhez</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.taxaPrenhez.toFixed(1)}%</div>
                <Progress 
                  className={`mt-2 ${getProgressColor(indicadores.taxaPrenhez, 30)}`} 
                  value={indicadores.taxaPrenhez} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: {`>`} 30%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Intervalo Entre Partos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.intervaloPartos.toFixed(1)} <span className="text-lg">meses</span></div>
                <Progress 
                  className={`mt-2 ${getProgressColor(14-indicadores.intervaloPartos, 1)}`} 
                  value={(14-indicadores.intervaloPartos) * 10} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: {`<`} 13 meses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Período de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.periodoServico.toFixed(0)} <span className="text-lg">dias</span></div>
                <Progress 
                  className={`mt-2 ${getProgressColor(100-indicadores.periodoServico, 10)}`} 
                  value={(100-indicadores.periodoServico) * 1.1} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: {`<`} 90 dias</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Período Seco</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.periodoSeco} <span className="text-lg">dias</span></div>
                <Progress 
                  className="mt-2 bg-farm-success" 
                  value={100} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: 45-60 dias</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="alertas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Partos</CardTitle>
                <CardDescription>Animais com parto previsto nos próximos dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {proximosPartos.map((animal) => {
                    const diasRestantes = calcularDiasRestantes(animal.data_proximo_parto);
                    return (
                      <li key={animal.id} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Badge className={getPartoUrgencia(diasRestantes)}>
                            {diasRestantes}d
                          </Badge>
                          <span>{animal.numero} - {animal.nome}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {formatDate(animal.data_proximo_parto || "")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximas Inseminações</CardTitle>
                <CardDescription>Animais prontos para inseminação</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {proximasInseminacoes.map((animal) => (
                    <li key={animal.id} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-farm-info">
                          Pronto
                        </Badge>
                        <span>{animal.numero} - {animal.nome}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {animal.raca}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="formulas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(formulas).map(([key, value]: [string, any]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted rounded-md font-mono text-sm">
                    {value.formula}
                  </div>
                  <p className="mt-2 text-sm">{value.explicacao}</p>
                  <p className="mt-2 text-sm font-medium">{value.meta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
