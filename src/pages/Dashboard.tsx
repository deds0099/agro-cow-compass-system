import React, { useState, useEffect } from "react";
import { ChartBarIcon, DatabaseIcon, CalendarIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProducaoChart } from "@/components/producao/ProducaoChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/date-utils";

type Animal = Database["public"]["Tables"]["animais"]["Row"];
type Producao = Database["public"]["Tables"]["producao"]["Row"];

export default function Dashboard() {
  const [dados, setDados] = useState({
    totalAnimais: 0,
    animaisLactantes: 0,
    animaisPrenhas: 0,
    producaoHoje: 0,
    producao: [] as Producao[],
    proximosPartos: [] as Animal[],
  });
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

      // Carregar produção
      const { data: producao, error: producaoError } = await supabase
        .from("producao")
        .select("*")
        .eq("user_id", user_id)
        .order("data", { ascending: false });

      if (producaoError) throw producaoError;

      // Calcular estatísticas
      const hoje = new Date().toISOString().split("T")[0];
      const producaoHoje = producao
        ?.filter(p => p.data === hoje)
        .reduce((acc, p) => acc + p.quantidade, 0) || 0;

      const animaisLactantes = animais?.filter(a => a.status === "lactante").length || 0;
      const animaisPrenhas = animais?.filter(a => a.status === "prenhe").length || 0;

      // Ordenar próximos partos
      const proximosPartos = animais
        ?.filter(a => a.data_proximo_parto)
        .sort((a, b) => 
          new Date(a.data_proximo_parto || "").getTime() - 
          new Date(b.data_proximo_parto || "").getTime()
        )
        .slice(0, 3) || [];

      setDados({
        totalAnimais: animais?.length || 0,
        animaisLactantes,
        animaisPrenhas,
        producaoHoje,
        producao: producao || [],
        proximosPartos,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Animais"
          value={dados.totalAnimais}
          description="No rebanho"
          icon={<DatabaseIcon className="h-4 w-4" />}
        />
        
        <StatCard
          title="Animais Lactantes"
          value={dados.animaisLactantes}
          description="Em lactação"
          variant="success"
          icon={<DatabaseIcon className="h-4 w-4" />}
        />
        
        <StatCard
          title="Animais Prenhes"
          value={dados.animaisPrenhas}
          description="Gestantes"
          icon={<CalendarIcon className="h-4 w-4" />}
        />
        
        <StatCard
          title="Produção Hoje"
          value={`${dados.producaoHoje.toFixed(1)}L`}
          variant="success"
          icon={<ChartBarIcon className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produção Diária</CardTitle>
          </CardHeader>
          <CardContent>
            <ProducaoChart 
              data={dados.producao}
              tipo="diario"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Partos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dados.proximosPartos.map((animal) => (
                <div key={animal.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{animal.numero} - {animal.nome}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(animal.data_proximo_parto || "")}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {animal.raca}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
