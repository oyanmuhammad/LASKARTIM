import { z } from "zod"

// Admin schema for status update validation
export const updateStatusSchema = z.object({
  reportId: z.string().min(1, 'Report ID tidak boleh kosong').trim(),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED'], {
    message: 'Status harus DRAFT, IN_PROGRESS, atau COMPLETED'
  }),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
