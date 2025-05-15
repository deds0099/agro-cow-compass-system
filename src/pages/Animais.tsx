import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnimalForm } from "@/components/animais/AnimalForm";
import { AnimaisTable } from "@/components/animais/AnimaisTable";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Animal = Database["public"]["Tables"]["animais"]["Row"];

type AnimalFormData = {
  nome: string;
  numero: string;
  raca: string;
  data_nascimento: string;
  status: string;
  data_proximo_parto?: string;
  observacoes?: string;
};

export default function Animais() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [animalEmEdicao, setAnimalEmEdicao] = useState<Animal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    carregarAnimais();
  }, []);

  const carregarAnimais = async () => {
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    
    const { data, error } = await supabase
      .from("animais")
      .select("*")
      .eq("user_id", user_id)
      .order("numero");

    if (error) {
      toast({
        title: "Erro ao carregar animais",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setAnimais(data || []);
  };
  
  const handleSaveAnimal = async (data: AnimalFormData) => {
    try {
      const animalData = {
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      };

      if (animalEmEdicao) {
        const { error } = await supabase
          .from("animais")
          .update(animalData)
          .eq("id", animalEmEdicao.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("animais")
          .insert([animalData]);

        if (error) throw error;
      }

      await carregarAnimais();
      setIsDialogOpen(false);
      setAnimalEmEdicao(null);
      toast({
        title: animalEmEdicao ? "Animal atualizado" : "Animal cadastrado",
        description: animalEmEdicao
          ? "O registro do animal foi atualizado com sucesso."
          : "O animal foi cadastrado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar animal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditAnimal = (animal: Animal) => {
    setAnimalEmEdicao(animal);
    setIsDialogOpen(true);
  };

  const handleDeleteAnimal = async (id: string) => {
    try {
      const { error } = await supabase
        .from("animais")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await carregarAnimais();
      toast({
        title: "Animal removido",
        description: "O registro do animal foi excluído com sucesso.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover animal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Cadastro de Animais">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Animal
        </Button>
      </PageHeader>
      
      <AnimaisTable 
        animais={animais}
        onEdit={handleEditAnimal}
        onDelete={handleDeleteAnimal}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {animalEmEdicao ? "Editar Animal" : "Cadastrar Novo Animal"}
            </DialogTitle>
          </DialogHeader>
          <AnimalForm 
            defaultValues={animalEmEdicao} 
            onSubmit={handleSaveAnimal} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
