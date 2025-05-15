
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

interface Animal {
  id: string;
  numero: string;
  nome: string;
  dataNascimento: string;
  raca: string;
  dataProximoParto?: string;
  status: "lactante" | "seca" | "prenhe";
}

interface AnimaisTableProps {
  animais: Animal[];
  onEdit: (animal: Animal) => void;
  onDelete: (id: string) => void;
}

export function AnimaisTable({ animais, onEdit, onDelete }: AnimaisTableProps) {
  const [search, setSearch] = useState("");
  
  const filteredAnimais = animais.filter(animal => 
    animal.nome.toLowerCase().includes(search.toLowerCase()) || 
    animal.numero.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR").format(date);
  };

  const getStatusBadge = (status: Animal["status"]) => {
    switch (status) {
      case "lactante":
        return <Badge className="bg-farm-info">Lactante</Badge>;
      case "seca":
        return <Badge variant="outline">Seca</Badge>;
      case "prenhe":
        return <Badge className="bg-farm-success">Prenhe</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="Buscar por nome ou número..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Nascimento</TableHead>
              <TableHead>Raça</TableHead>
              <TableHead>Próximo Parto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimais.length > 0 ? (
              filteredAnimais.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell>{animal.numero}</TableCell>
                  <TableCell>{animal.nome}</TableCell>
                  <TableCell>{formatDate(animal.dataNascimento)}</TableCell>
                  <TableCell>{animal.raca}</TableCell>
                  <TableCell>{formatDate(animal.dataProximoParto || "")}</TableCell>
                  <TableCell>{getStatusBadge(animal.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(animal)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(animal.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum animal encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
