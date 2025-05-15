import React, { useState, useEffect } from "react";
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
import { fixDateTimezone, formatDate } from "@/lib/date-utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type Animal = Database["public"]["Tables"]["animais"]["Row"];
type Producao = Database["public"]["Tables"]["producao"]["Row"];
type Reproducao = Database["public"]["Tables"]["reproducao"]["Row"];

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("producao");
  const [periodoRelatorio, setPeriodoRelatorio] = useState("ultimos7dias");
  const [formatoExportacao, setFormatoExportacao] = useState("pdf");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date());
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date());
  const [dados, setDados] = useState<{
    producao: Producao[];
    animais: Animal[];
    reproducao: Reproducao[];
  }>({
    producao: [],
    animais: [],
    reproducao: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, [periodoRelatorio, dataInicio, dataFim]);

  const carregarDados = async () => {
    try {
      const user_id = (await supabase.auth.getUser()).data.user?.id;

      // Definir datas com base no período selecionado
      let inicio = new Date();
      let fim = new Date();

      switch (periodoRelatorio) {
        case "ultimos7dias":
          inicio.setDate(inicio.getDate() - 7);
          break;
        case "ultimos30dias":
          inicio.setDate(inicio.getDate() - 30);
          break;
        case "ultimos90dias":
          inicio.setDate(inicio.getDate() - 90);
          break;
        case "personalizado":
          if (dataInicio && dataFim) {
            inicio = dataInicio;
            fim = dataFim;
          }
          break;
      }

      // Carregar produção
      const { data: producao, error: producaoError } = await supabase
        .from("producao")
        .select("*")
        .eq("user_id", user_id)
        .gte("data", inicio.toISOString().split("T")[0])
        .lte("data", fim.toISOString().split("T")[0])
        .order("data", { ascending: true });

      if (producaoError) throw producaoError;

      // Carregar animais
      const { data: animais, error: animaisError } = await supabase
        .from("animais")
        .select("*")
        .eq("user_id", user_id);

      if (animaisError) throw animaisError;

      setDados({
        producao: producao || [],
        animais: animais || [],
        reproducao: [], // TODO: Implementar carregamento de dados de reprodução
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGerarRelatorio = async () => {
    try {
      const { error } = await supabase
        .from("relatorios")
        .insert({
          tipo: tipoRelatorio,
          data_inicio: dataInicio?.toISOString().split("T")[0],
          data_fim: dataFim?.toISOString().split("T")[0],
          formato: formatoExportacao,
        });

      if (error) throw error;

      toast({
        title: "Relatório gerado com sucesso",
        description: "O relatório será processado e disponibilizado em breve.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar relatório",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calcularEstatisticas = () => {
    if (tipoRelatorio === "producao") {
      const producaoTotal = dados.producao.reduce((acc, p) => acc + p.quantidade, 0);
      const mediaDiaria = producaoTotal / (dados.producao.length || 1);
      const maiorProducao = Math.max(...dados.producao.map(p => p.quantidade));
      const menorProducao = Math.min(...dados.producao.map(p => p.quantidade));

      return {
        producaoTotal: producaoTotal.toFixed(1),
        mediaDiaria: mediaDiaria.toFixed(1),
        maiorProducao: maiorProducao.toFixed(1),
        menorProducao: menorProducao.toFixed(1),
      };
    }

    if (tipoRelatorio === "reproducao") {
      const totalInseminacoes = dados.reproducao.length;
      const inseminacoesSucesso = dados.reproducao.filter(r => r.status === "prenhe").length;
      const taxaConcepcao = (inseminacoesSucesso / totalInseminacoes) * 100 || 0;

      return {
        totalInseminacoes,
        inseminacoesSucesso,
        taxaConcepcao: taxaConcepcao.toFixed(1),
      };
    }

    return {};
  };

  const estatisticas = calcularEstatisticas();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Relatórios">
        <Button onClick={handleGerarRelatorio}>
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </PageHeader>
      
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
                  <SelectItem value="ultimos7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="ultimos30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="ultimos90dias">Últimos 90 dias</SelectItem>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {periodoRelatorio === "personalizado" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataInicio ? formatDate(dataInicio.toISOString().split("T")[0]) : "Selecione"}
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
                  <label className="text-sm font-medium">Data Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dataFim ? formatDate(dataFim.toISOString().split("T")[0]) : "Selecione"}
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
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="preview">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Prévia</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview">
          {tipoRelatorio === "producao" && (
            <Card>
              <CardHeader>
                <CardTitle>Prévia do Relatório - Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <ProducaoChart 
                  data={dados.producao}
                  tipo="diario"
                />
                
                <div className="mt-6 border rounded-md p-4">
                  <h3 className="font-medium text-lg mb-2">Resumo de Produção</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Produção Total</p>
                      <p className="text-2xl font-bold">{estatisticas.producaoTotal} L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Média Diária</p>
                      <p className="text-2xl font-bold">{estatisticas.mediaDiaria} L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Maior Produção</p>
                      <p className="text-2xl font-bold">{estatisticas.maiorProducao} L</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Menor Produção</p>
                      <p className="text-2xl font-bold">{estatisticas.menorProducao} L</p>
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
                      <p className="text-muted-foreground text-sm">Total de Inseminações</p>
                      <p className="text-2xl font-bold">{estatisticas.totalInseminacoes}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Inseminações com Sucesso</p>
                      <p className="text-2xl font-bold">{estatisticas.inseminacoesSucesso}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Taxa de Concepção</p>
                      <p className="text-2xl font-bold">{estatisticas.taxaConcepcao}%</p>
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
                  <h3 className="font-medium text-lg mb-4">Resumo do Rebanho</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-muted-foreground text-sm">Total de Animais</p>
                      <p className="text-2xl font-bold">{dados.animais.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Animais Lactantes</p>
                      <p className="text-2xl font-bold">
                        {dados.animais.filter(a => a.status === "lactante").length}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Animais Prenhes</p>
                      <p className="text-2xl font-bold">
                        {dados.animais.filter(a => a.status === "prenhe").length}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Animais Secos</p>
                      <p className="text-2xl font-bold">
                        {dados.animais.filter(a => a.status === "seca").length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
