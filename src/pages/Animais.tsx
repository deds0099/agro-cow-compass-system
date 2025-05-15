
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnimalForm } from "@/components/animais/AnimalForm";
import { AnimaisTable } from "@/components/animais/AnimaisTable";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Dados fictícios para simulação
const animaisIniciais = [
  {
    id: "1",
    numero: "1001",
    nome: "Mimosa",
    dataNascimento: "2020-05-10",
    raca: "Holandesa",
    dataProximoParto: "2025-05-18",
    status: "prenhe" as const,
  },
  {
    id: "2",
    numero: "1042",
    nome: "Boneca",
    dataNascimento: "2021-02-15",
    raca: "Jersey",
    dataProximoParto: "2025-05-22",
    status: "prenhe" as const,
  },
  {
    id: "3",
    numero: "1057",
    nome: "Estrela",
    dataNascimento: "2019-11-23",
    raca: "Gir",
    dataProximoParto: "2025-05-29",
    status: "prenhe" as const,
  },
  {
    id: "4",
    numero: "1063",
    nome: "Manchinha",
    dataNascimento: "2020-09-08",
    raca: "Holandesa",
    status: "lactante" as const,
  },
  {
    id: "5",
    numero: "1078",
    nome: "Malhada",
    dataNascimento: "2021-07-20",
    raca: "Gir",
    status: "seca" as const,
  },
];

export default function Animais() {
  const [animais, setAnimais] = useState(animaisIniciais);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [animalEmEdicao, setAnimalEmEdicao] = useState<any>(null);
  const { toast } = useToast();
  
  const handleSaveAnimal = (data: any) => {
    if (animalEmEdicao) {
      // Editando animal existente
      setAnimais((prev) =>
        prev.map((animal) =>
          animal.id === animalEmEdicao.id ? { ...data, id: animal.id } : animal
        )
      );
      toast({
        title: "Animal atualizado com sucesso",
        description: `As informações de ${data.nome} foram atualizadas.`,
      });
    } else {
      // Novo animal
      const novoAnimal = {
        ...data,
        id: String(animais.length + 1),
      };
      setAnimais((prev) => [...prev, novoAnimal]);
    }
    setIsDialogOpen(false);
    setAnimalEmEdicao(null);
  };

  const handleEditAnimal = (animal: any) => {
    setAnimalEmEdicao(animal);
    setIsDialogOpen(true);
  };

  const handleDeleteAnimal = (id: string) => {
    setAnimais((prev) => prev.filter((animal) => animal.id !== id));
    toast({
      title: "Animal removido",
      description: "O registro do animal foi excluído com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-farm-primary">Cadastro de Animais</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Animal
        </Button>
      </div>
      
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
