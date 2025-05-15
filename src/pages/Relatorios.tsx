
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ProducaoChart } from "@/components/producao/ProducaoChart";
import { FileText, Calendar as CalendarIcon } from "lucide-react";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("producao");
  const [periodoRelatorio, setPeriodoRelatorio] = useState("ultimos7dias");
  const [formatoExportacao, setFormatoExportacao] = useState("pdf");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date());
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());
  
  // Dados fictícios para simulação
  const producaoDiaria = [
    { data: "01/05", manha: 150, tarde: 120, noite: 130, total: 400 },
    { data: "02/05", manha: 155, tarde: 125, noite: 135, total: 415 },
    { data: "03/05", manha: 160, tarde: 130, noite: 140, total: 430 },
    { data: "04/05", manha: 157, tarde: 127, noite: 137, total: 421 },
    { data: "05/05", manha: 163, tarde: 133, noite: 143, total: 439 },
    { data: "06/05", manha: 167, tarde: 137, noite: 147, total: 451 },
    { data: "07/05", manha: 165, tarde: 135, noite: 145, total: 445 },
  ];
  
  // Formato de data para exibição
  const formatarData = (data: Date | undefined) => {
    if (!data) return "";
    return new Intl.DateTimeFormat("pt-BR").format(data);
  };
  
  // Gerar relatório
  const handleGerarRelatorio = () => {
    console.log("Gerando relatório:", {
      tipo: tipoRelatorio,
      periodo: periodoRelatorio,
      formato: formatoExportacao,
      dataInicio: dataInicio ? formatarData(dataInicio) : "",
      dataFim: dataFim ? formatarData(dataFim) : "",
    });
    
    alert(`Relatório de ${tipoRelatorio} seria gerado no formato ${formatoExportacao}.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-farm-primary">Relatórios</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuração do Relatório</CardTitle>
          <CardDescription>
            Selecione os parâmetros para gerar o relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Relatório</label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="producao">Produção</SelectItem>
                  <SelectItem value="reproducao">Reprodução</SelectItem>
                  <SelectItem value="animais">Animais</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={periodoRelatorio} onValueChange={setPeriodoRelatorio}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="ultimos7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="ultimos30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {periodoRelatorio === "personalizado" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Início</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left flex gap-2"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {dataInicio ? formatarData(dataInicio) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataInicio}
                        onSelect={setDataInicio}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Fim</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left flex gap-2"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        {dataFim ? formatarData(dataFim) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dataFim}
                        onSelect={setDataFim}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Formato</label>
              <Select value={formatoExportacao} onValueChange={setFormatoExportacao}>
                <SelectTrigger>
                  <SelectValue placeholder="Formato de exportação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleGerarRelatorio}>
              <FileText className="mr-2 h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="preview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Prévia</TabsTrigger>
          <TabsTrigger value="saved">Relatórios Salvos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          {tipoRelatorio === "producao" && (
            <Card>
              <CardHeader>
                <CardTitle>Prévia do Relatório - Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <ProducaoChart 
                  dados={producaoDiaria}
                  title="Produção dos Últimos 7 Dias"
                  height={350}
                />
                
                <div className="mt-6 border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-2">Resumo de Produção</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Produção Total</p>
                      <p className="text-2xl font-bold">3.001 L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Média Diária</p>
                      <p className="text-2xl font-bold">428,7 L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Maior Produção</p>
                      <p className="text-2xl font-bold">451 L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Menor Produção</p>
                      <p className="text-2xl font-bold">400 L</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {tipoRelatorio === "reproducao" && (
            <Card>
              <CardHeader>
                <CardTitle>Prévia do Relatório - Reprodução</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-4">Resumo de Indicadores Reprodutivos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-muted-foreground text-sm">Taxa de Prenhez</p>
                      <p className="text-2xl font-bold">34%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Taxa de Serviço</p>
                      <p className="text-2xl font-bold">62%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Taxa de Concepção</p>
                      <p className="text-2xl font-bold">55%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Intervalo Entre Partos</p>
                      <p className="text-2xl font-bold">12,5 meses</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Período de Serviço</p>
                      <p className="text-2xl font-bold">85 dias</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Período Seco</p>
                      <p className="text-2xl font-bold">60 dias</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {tipoRelatorio === "animais" && (
            <Card>
              <CardHeader>
                <CardTitle>Prévia do Relatório - Animais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-4">Distribuição do Rebanho</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-muted-foreground text-sm">Total</p>
                      <p className="text-2xl font-bold">86</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Lactantes</p>
                      <p className="text-2xl font-bold">45</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Secas</p>
                      <p className="text-2xl font-bold">19</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Prenhes</p>
                      <p className="text-2xl font-bold">22</p>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-2">Distribuição por Raça</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Holandesa</p>
                      <p className="text-xl font-bold">38</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Jersey</p>
                      <p className="text-xl font-bold">14</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Gir</p>
                      <p className="text-xl font-bold">22</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Girolando</p>
                      <p className="text-xl font-bold">12</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {tipoRelatorio === "financeiro" && (
            <Card>
              <CardHeader>
                <CardTitle>Prévia do Relatório - Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-4">Resumo Financeiro</h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-muted-foreground text-sm">Receita Total</p>
                      <p className="text-2xl font-bold">R$ 15.320,00</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Despesas</p>
                      <p className="text-2xl font-bold">R$ 8.750,00</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Lucro</p>
                      <p className="text-2xl font-bold text-farm-success">R$ 6.570,00</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Custo por Litro</p>
                      <p className="text-2xl font-bold">R$ 1,35</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Salvos</CardTitle>
              <CardDescription>
                Acesse relatórios gerados anteriormente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="border rounded-md p-3 flex justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium">Produção - Abril 2025</h4>
                    <p className="text-sm text-muted-foreground">Gerado em 01/05/2025 - PDF</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </li>
                <li className="border rounded-md p-3 flex justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium">Reprodução - 1º Trimestre 2025</h4>
                    <p className="text-sm text-muted-foreground">Gerado em 05/04/2025 - Excel</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </li>
                <li className="border rounded-md p-3 flex justify-between items-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-medium">Inventário de Animais</h4>
                    <p className="text-sm text-muted-foreground">Gerado em 15/03/2025 - PDF</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
