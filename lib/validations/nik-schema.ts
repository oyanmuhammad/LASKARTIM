import { z } from "zod"

// Admin schema for status update validation
export const updateStatusSchema = z.object({
  reportId: z.string().cuid('Invalid report ID format'),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'COMPLETED'], {
    message: 'Status harus DRAFT, IN_PROGRESS, atau COMPLETED'
  }),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>

// NIK validation schema
export const nikSchema = z.object({
  nik: z.string()
    .length(16, 'NIK harus 16 digit')
    .regex(/^[0-9]+$/, 'NIK hanya boleh berisi angka'),
  name: z.string()
    .min(1, 'Nama tidak boleh kosong')
    .max(100, 'Nama maksimal 100 karakter')
    .regex(/^[a-zA-Z0-9\s]+$/, 'Nama hanya boleh berisi huruf, angka, dan spasi'),
})

export type NIKInput = z.infer<typeof nikSchema>
