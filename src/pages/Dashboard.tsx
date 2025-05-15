
import React from "react";
import { ChartBarIcon, DatabaseIcon, CalendarIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProducaoChart } from "@/components/producao/ProducaoChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dados fictícios para simulação
const dadosDashboard = {
  totalAnimais: 86,
  animaisLactantes: 45,
  animaisPrenhas: 22,
  producaoHoje: 450,
  producaoMesPorDia: [
    { data: "01/05", manha: 150, tarde: 120, noite: 130, total: 400 },
    { data: "02/05", manha: 155, tarde: 125, noite: 135, total: 415 },
    { data: "03/05", manha: 160, tarde: 130, noite: 140, total: 430 },
    { data: "04/05", manha: 157, tarde: 127, noite: 137, total: 421 },
    { data: "05/05", manha: 163, tarde: 133, noite: 143, total: 439 },
    { data: "06/05", manha: 167, tarde: 137, noite: 147, total: 451 },
    { data: "07/05", manha: 165, tarde: 135, noite: 145, total: 445 },
  ],
  proximosPartos: [
    { id: "1", animal: "1001 - Mimosa", dataPrevista: "18/05/2025" },
    { id: "2", animal: "1042 - Boneca", dataPrevista: "22/05/2025" },
    { id: "3", animal: "1057 - Estrela", dataPrevista: "29/05/2025" },
  ],
  alertas: [
    { id: "1", tipo: "parto", descricao: "Animal 1001 com parto previsto para hoje" },
    { id: "2", tipo: "producao", descricao: "Queda de 15% na produção do animal 1042" },
    { id: "3", tipo: "inseminacao", descricao: "Animal 1057 pronto para inseminação" },
  ],
};

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-farm-primary">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Animais"
          value={dadosDashboard.totalAnimais}
          description="No rebanho"
          icon={<DatabaseIcon className="h-4 w-4" />}
        />
        
        <StatCard
          title="Animais Lactantes"
          value={dadosDashboard.animaisLactantes}
          description="Em lactação"
          trend={{ value: 5, positive: true }}
          variant="success"
          icon={<DatabaseIcon className="h-4 w-4" />}
        />
        
        <StatCard
          title="Animais Prenhes"
          value={dadosDashboard.animaisPrenhas}
          description="Gestantes"
          icon={<CalendarIcon className="h-4 w-4" />}
        />
        
        <StatCard
          title="Produção Hoje"
          value={`${dadosDashboard.producaoHoje}L`}
          trend={{ value: 3, positive: true }}
          variant="success"
          icon={<ChartBarIcon className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProducaoChart 
            dados={dadosDashboard.producaoMesPorDia} 
            title="Produção dos Últimos 7 Dias"
          />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximos Partos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dadosDashboard.proximosPartos.map((parto) => (
                  <li key={parto.id} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                    <span>{parto.animal}</span>
                    <span className="text-muted-foreground">{parto.dataPrevista}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alertas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dadosDashboard.alertas.map((alerta) => (
                  <li 
                    key={alerta.id} 
                    className={`p-2 rounded flex items-center ${
                      alerta.tipo === "parto" 
                        ? "border-l-2 border-farm-warning" 
                        : alerta.tipo === "producao" 
                          ? "border-l-2 border-farm-alert" 
                          : "border-l-2 border-farm-info"
                    }`}
                  >
                    <span className="ml-2">{alerta.descricao}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
