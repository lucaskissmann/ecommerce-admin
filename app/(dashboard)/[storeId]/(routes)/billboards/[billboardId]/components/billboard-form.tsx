"use client";

import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

const customErrorMessage = "O nome deve conter ao menos 1 caractere";

const formSchema = z.object({
  label: z.string().min(1, { message: customErrorMessage }),
  imageUrl: z.string().min(1, { message: "Você deve adicionar ao menos uma imagem"})
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
  initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar destaque" : "Criar destaque";
  const description = initialData ? "Editar um destaque" : "Adicionar novo destaque";
  const toastMessage = initialData ? "Destaque atualizado." : "Destaque criado";
  const action = initialData ? "Salvar alterações" : "Criar destaque";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver( formSchema ),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if( initialData ) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data );
      }
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success("Destaque deletado");

    } catch ( error ) {
      toast.error("Confira se você removeu todas as categorias deste destaque.");
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
          <FormField 
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tela de fundo</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value ? [field.value] : [] }
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rótulo</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Rótulo do destaque" {...field}/>
                  </FormControl>
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