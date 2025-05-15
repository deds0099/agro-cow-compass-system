
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProducaoForm } from "@/components/producao/ProducaoForm";
import { ProducaoChart } from "@/components/producao/ProducaoChart";
import { FileText } from "lucide-react";

// Dados fictícios para simulação
const animaisIniciais = [
  { id: "1", numero: "1001", nome: "Mimosa" },
  { id: "2", numero: "1042", nome: "Boneca" },
  { id: "3", numero: "1057", nome: "Estrela" },
  { id: "4", numero: "1063", nome: "Manchinha" },
  { id: "5", numero: "1078", nome: "Malhada" },
];

const producoesDiarias = [
  { data: "01/05", manha: 150, tarde: 120, noite: 130, total: 400 },
  { data: "02/05", manha: 155, tarde: 125, noite: 135, total: 415 },
  { data: "03/05", manha: 160, tarde: 130, noite: 140, total: 430 },
  { data: "04/05", manha: 157, tarde: 127, noite: 137, total: 421 },
  { data: "05/05", manha: 163, tarde: 133, noite: 143, total: 439 },
  { data: "06/05", manha: 167, tarde: 137, noite: 147, total: 451 },
  { data: "07/05", manha: 165, tarde: 135, noite: 145, total: 445 },
];

const producoesMensais = [
  { data: "Janeiro", manha: 4500, tarde: 3800, noite: 4100, total: 12400 },
  { data: "Fevereiro", manha: 4200, tarde: 3600, noite: 3900, total: 11700 },
  { data: "Março", manha: 4600, tarde: 3900, noite: 4300, total: 12800 },
  { data: "Abril", manha: 4800, tarde: 4100, noite: 4500, total: 13400 },
];

export default function Producao() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("diario");
  
  const handleSubmitProducao = (dados: any) => {
    console.log("Produção registrada:", dados);
    // Aqui você integraria com seu back-end ou estado global
  };

  const handleExportar = () => {
    // Implementação para exportar relatórios (PDF/Excel)
    console.log("Exportando dados de produção...");
    alert("Funcionalidade de exportação seria implementada aqui.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-farm-primary">Produção de Leite</h1>
        <Button variant="outline" onClick={handleExportar}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Registro de Produção</CardTitle>
          </CardHeader>
          <CardContent>
            <ProducaoForm 
              animais={animaisIniciais} 
              onSubmit={handleSubmitProducao} 
            />
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Análise de Produção</CardTitle>
              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="grafico">
                <TabsList className="mb-4">
                  <TabsTrigger value="grafico">Gráfico</TabsTrigger>
                  <TabsTrigger value="raca">Por Raça</TabsTrigger>
                </TabsList>
                <TabsContent value="grafico">
                  <ProducaoChart 
                    dados={periodoSelecionado === "diario" ? producoesDiarias : producoesMensais}
                    title={periodoSelecionado === "diario" ? "Produção Diária" : "Produção Mensal"}
                    height={350}
                  />
                </TabsContent>
                <TabsContent value="raca">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Holandesa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">220 L/dia</div>
                        <div className="text-sm text-muted-foreground">Média por animal: 22 L</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Jersey</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">120 L/dia</div>
                        <div className="text-sm text-muted-foreground">Média por animal: 15 L</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Gir</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">90 L/dia</div>
                        <div className="text-sm text-muted-foreground">Média por animal: 12 L</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Girolando</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">170 L/dia</div>
                        <div className="text-sm text-muted-foreground">Média por animal: 17 L</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
