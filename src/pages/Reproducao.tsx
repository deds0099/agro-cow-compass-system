
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Reproducao() {
  // Dados fictícios para simulação de indicadores reprodutivos
  const indicadores = {
    taxaServico: 62,
    taxaConcepcao: 55,
    taxaPrenhez: 34,
    intervaloPartos: 12.5,
    periodoServico: 85,
    periodoSeco: 60,
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
  
  // Lista de vacas próximas ao parto
  const proximosPartos = [
    { id: "1", numero: "1001", nome: "Mimosa", dataPrevista: "18/05/2025", diasRestantes: 3 },
    { id: "2", numero: "1042", nome: "Boneca", dataPrevista: "22/05/2025", diasRestantes: 7 },
    { id: "3", numero: "1057", nome: "Estrela", dataPrevista: "29/05/2025", diasRestantes: 14 },
    { id: "4", numero: "1084", nome: "Princesa", dataPrevista: "06/06/2025", diasRestantes: 22 },
  ];
  
  // Lista de vacas para inseminação
  const proximasInseminacoes = [
    { id: "5", numero: "1023", nome: "Violeta", dataIdeal: "16/05/2025", diasRestantes: 1 },
    { id: "6", numero: "1038", nome: "Flor", dataIdeal: "19/05/2025", diasRestantes: 4 },
    { id: "7", numero: "1072", nome: "Formosa", dataIdeal: "21/05/2025", diasRestantes: 6 },
  ];
  
  const getProgressColor = (valor: number, metaMin: number) => {
    return valor >= metaMin ? "bg-farm-success" : "bg-farm-warning";
  };
  
  const getPartoUrgencia = (dias: number) => {
    if (dias <= 3) return "bg-farm-alert text-white";
    if (dias <= 7) return "bg-farm-warning";
    return "bg-muted";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-farm-primary">Reprodução</h1>
      
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
                <div className="text-3xl font-bold">{indicadores.taxaServico}%</div>
                <Progress 
                  className={`mt-2 ${getProgressColor(indicadores.taxaServico, 60)}`} 
                  value={indicadores.taxaServico} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: > 60%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Concepção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.taxaConcepcao}%</div>
                <Progress 
                  className={`mt-2 ${getProgressColor(indicadores.taxaConcepcao, 50)}`} 
                  value={indicadores.taxaConcepcao} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: > 50%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Prenhez</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.taxaPrenhez}%</div>
                <Progress 
                  className={`mt-2 ${getProgressColor(indicadores.taxaPrenhez, 30)}`} 
                  value={indicadores.taxaPrenhez} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: > 30%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Intervalo Entre Partos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.intervaloPartos} <span className="text-lg">meses</span></div>
                <Progress 
                  className={`mt-2 ${getProgressColor(14-indicadores.intervaloPartos, 1)}`} 
                  value={(14-indicadores.intervaloPartos) * 10} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: < 13 meses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Período de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{indicadores.periodoServico} <span className="text-lg">dias</span></div>
                <Progress 
                  className={`mt-2 ${getProgressColor(100-indicadores.periodoServico, 10)}`} 
                  value={(100-indicadores.periodoServico) * 1.1} 
                />
                <p className="text-xs text-muted-foreground mt-1">Meta: < 90 dias</p>
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
                  {proximosPartos.map((parto) => (
                    <li key={parto.id} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge className={getPartoUrgencia(parto.diasRestantes)}>
                          {parto.diasRestantes}d
                        </Badge>
                        <span>{parto.numero} - {parto.nome}</span>
                      </div>
                      <span className="text-muted-foreground">{parto.dataPrevista}</span>
                    </li>
                  ))}
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
                  {proximasInseminacoes.map((inseminacao) => (
                    <li key={inseminacao.id} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-farm-info">
                          {inseminacao.diasRestantes}d
                        </Badge>
                        <span>{inseminacao.numero} - {inseminacao.nome}</span>
                      </div>
                      <span className="text-muted-foreground">{inseminacao.dataIdeal}</span>
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
