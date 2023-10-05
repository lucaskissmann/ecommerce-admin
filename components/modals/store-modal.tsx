"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Criar loja"
      description="Adicionar uma nova loja para gerenciar produtos e categorias"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Future Create Store Form
    </Modal>
  )
}