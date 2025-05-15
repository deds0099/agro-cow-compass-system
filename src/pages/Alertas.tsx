
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  // Dados fictícios para simulação
  const alertasIniciais: Alerta[] = [
    {
      id: "1",
      tipo: "parto",
      animal: "1001 - Mimosa",
      descricao: "Parto previsto para hoje",
      data: "15/05/2025",
      resolvido: false,
      prioridade: "alta",
    },
    {
      id: "2",
      tipo: "producao",
      animal: "1042 - Boneca",
      descricao: "Queda de 15% na produção nos últimos 3 dias",
      data: "14/05/2025",
      resolvido: false,
      prioridade: "alta",
    },
    {
      id: "3",
      tipo: "inseminacao",
      animal: "1057 - Estrela",
      descricao: "Pronta para inseminação",
      data: "13/05/2025",
      resolvido: false,
      prioridade: "media",
    },
    {
      id: "4",
      tipo: "sanitario",
      animal: "1063 - Manchinha",
      descricao: "Vacinação atrasada - Brucelose",
      data: "10/05/2025",
      resolvido: false,
      prioridade: "baixa",
    },
    {
      id: "5",
      tipo: "sanitario",
      animal: "1078 - Malhada",
      descricao: "Vermifugação programada",
      data: "09/05/2025",
      resolvido: true,
      prioridade: "baixa",
    },
  ];
  
  const [alertas, setAlertas] = useState<Alerta[]>(alertasIniciais);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("pendentes");
  
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
  const handleResolverAlerta = (id: string) => {
    setAlertas(alertas.map((alerta) => 
      alerta.id === id ? { ...alerta, resolvido: true } : alerta
    ));
  };
  
  // Obter classe CSS para cor do alerta baseado na prioridade
  const getPrioridadeClass = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-farm-alert text-white";
      case "media": return "bg-farm-warning";
      case "baixa": return "bg-farm-info text-white";
      default: return "bg-muted";
    }
  };
  
  // Obter ícone do alerta baseado no tipo
  const getTipoIcone = (tipo: string) => {
    switch (tipo) {
      case "parto": return "🐄";
      case "producao": return "🥛";
      case "inseminacao": return "💉";
      case "sanitario": return "🩺";
      default: return "⚠️";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-farm-primary">Alertas</h1>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tipo de Alerta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="parto">Partos</SelectItem>
            <SelectItem value="producao">Produção</SelectItem>
            <SelectItem value="inseminacao">Inseminação</SelectItem>
            <SelectItem value="sanitario">Sanitário</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendentes">Pendentes</SelectItem>
            <SelectItem value="resolvidos">Resolvidos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Alertas {filtroStatus === "resolvidos" ? "Resolvidos" : "Pendentes"}</CardTitle>
        </CardHeader>
        <CardContent>
          {alertasFiltrados.length > 0 ? (
            <ul className="space-y-3">
              {alertasFiltrados.map((alerta) => (
                <li 
                  key={alerta.id}
                  className={`p-4 rounded-lg border transition-all ${
                    alerta.resolvido 
                      ? "bg-muted/50 border-muted" 
                      : "bg-white border-muted hover:border-farm-primary"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getTipoIcone(alerta.tipo)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPrioridadeClass(alerta.prioridade)}>
                            {alerta.prioridade.toUpperCase()}
                          </Badge>
                          <span className="font-medium">{alerta.animal}</span>
                        </div>
                        <p className="mt-1">{alerta.descricao}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Data: {alerta.data}
                        </p>
                      </div>
                    </div>
                    
                    {!alerta.resolvido && (
                      <Button 
                        variant="secondary" 
                        onClick={() => handleResolverAlerta(alerta.id)}
                        className="md:self-center"
                      >
                        Marcar como Resolvido
                      </Button>
                    )}
                    
                    {alerta.resolvido && (
                      <Badge variant="outline" className="md:self-center">
                        Resolvido
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum alerta encontrado com os filtros atuais
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
