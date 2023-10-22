"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Billboard, Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const customErrorMessage = "O nome deve conter ao menos 1 caractere";

const formSchema = z.object({
  name: z.string().min(1, { message: customErrorMessage }),
  billboardId: z.string().min(1, { message: "Você deve selecionar um destaque"})
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar categoria" : "Criar categoria";
  const description = initialData ? "Editar uma categoria" : "Adicionar nova categoria";
  const toastMessage = initialData ? "Categoria atualizada." : "Categoria criada";
  const action = initialData ? "Salvar alterações" : "Criar categoria";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver( formSchema ),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if( initialData ) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data );
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success( toastMessage );
    } catch ( error ) {
      toast.error("Ocorreu um erro");
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Categoria deletada");

    } catch ( error ) {
      toast.error("Confira se você removeu todos os produtos desta categoria.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4"/>
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nome da categoria" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destaque</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Selecione um destaque" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard => (
                        <SelectItem
                          key={billboard.id}
                          value={billboard.id}  
                        >
                          {billboard.label}
                        </SelectItem>
                      )))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}