"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produtos",
  },
  {
    accessorKey: "phone",
    header: "Fone",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    accessorKey: "totalPrice",
    header: "Preço final",
  },
  {
    accessorKey: "isPaid",
    header: "Pago",
  },
  {
    accessorKey: "createdAt",
    header: "Data de criação",
  }
]
