"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { CellAction } from "./cell-action"

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Título",
  },
  {
    accessorKey: "createdAt",
    header: "Data de criação",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>,
  },
]
