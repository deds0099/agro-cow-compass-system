import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProducaoForm } from "@/components/producao/ProducaoForm";
import { ProducaoChart } from "@/components/producao/ProducaoChart";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

type Animal = Database["public"]["Tables"]["animais"]["Row"];
type Producao = Database["public"]["Tables"]["producao"]["Row"];

export default function Producao() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("diario");
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [producao, setProducao] = useState<Producao[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const user_id = (await supabase.auth.getUser()).data.user?.id;

    // Carregar animais
    const { data: animaisData, error: animaisError } = await supabase
      .from("animais")
      .select("*")
      .eq("user_id", user_id)
      .order("numero");

    if (animaisError) {
      toast({
        title: "Erro ao carregar animais",
        description: animaisError.message,
        variant: "destructive",
      });
      return;
    }

    setAnimais(animaisData || []);

    // Carregar produção
    const { data: producaoData, error: producaoError } = await supabase
      .from("producao")
      .select("*")
      .eq("user_id", user_id)
      .order("data", { ascending: false });

    if (producaoError) {
      toast({
        title: "Erro ao carregar produção",
        description: producaoError.message,
        variant: "destructive",
      });
      return;
    }

    setProducao(producaoData || []);
  };
  
  const handleSubmitProducao = async (data: any) => {
    try {
      const producaoData = {
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      };

      const { error } = await supabase
        .from("producao")
        .insert([producaoData]);

      if (error) throw error;

      toast({
        title: "Produção registrada",
        description: "O registro de produção foi salvo com sucesso.",
      });

      // Recarregar dados
      await carregarDados();
    } catch (error: any) {
      toast({
        title: "Erro ao registrar produção",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExportar = () => {
    // Implementação para exportar relatórios (PDF/Excel)
    console.log("Exportando dados de produção...");
    alert("Funcionalidade de exportação seria implementada aqui.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Produção de Leite">
        <Button variant="outline" onClick={handleExportar}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Registro de Produção</CardTitle>
          </CardHeader>
          <CardContent>
            <ProducaoForm 
              animais={animais} 
              onSubmit={handleSubmitProducao} 
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Análise de Produção</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="diario" value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
              <TabsList className="mb-4">
                <TabsTrigger value="diario">Diário</TabsTrigger>
                <TabsTrigger value="semanal">Semanal</TabsTrigger>
                <TabsTrigger value="mensal">Mensal</TabsTrigger>
                <TabsTrigger value="raca">Por Raça</TabsTrigger>
              </TabsList>

              <TabsContent value="diario">
                <ProducaoChart 
                  data={producao}
                  tipo="diario"
                />
              </TabsContent>

              <TabsContent value="semanal">
                <ProducaoChart 
                  data={producao}
                  tipo="semanal"
                />
              </TabsContent>

              <TabsContent value="mensal">
                <ProducaoChart 
                  data={producao}
                  tipo="mensal"
                />
              </TabsContent>

              <TabsContent value="raca">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from(new Set(animais.map(a => a.raca))).map(raca => {
                    const animaisRaca = animais.filter(a => a.raca === raca);
                    const producaoRaca = producao.filter(p => 
                      animaisRaca.some(a => a.id === p.animal_id)
                    );
                    const mediaDiaria = producaoRaca.length > 0 
                      ? producaoRaca.reduce((acc, p) => acc + p.quantidade, 0) / producaoRaca.length 
                      : 0;
                    const mediaPorAnimal = mediaDiaria / animaisRaca.length;

                    return (
                      <Card key={raca}>
                        <CardHeader>
                          <CardTitle>{raca}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{mediaDiaria.toFixed(1)} L/dia</div>
                          <div className="text-sm text-muted-foreground">
                            Média por animal: {mediaPorAnimal.toFixed(1)} L
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
