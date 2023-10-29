"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { ProductColumn } from "./columns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ProductColumn
}

export const CellAction: React.FC<CellActionProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("ID do produto copiado");
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/product/${data.id}`)
      router.refresh();
      toast.success("Produto deletado");

    } catch ( error ) {
      toast.error("Ocorreu um erro");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return(
    <>
    <AlertModal 
      isOpen={open}
      onClose={() => setOpen(false) }
      onConfirm={onDelete}
      loading={loading}
    />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only"> Abrir menu</span>
            <MoreHorizontal className="h-4 w-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={ () => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4"/>
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4"/>
            Atualizar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen( true )}>
            <Trash className="mr-2 h-4 w-4"/>
            Excluir
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}