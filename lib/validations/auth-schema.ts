import { z } from 'zod'

/**
 * Schema for admin login validation
 * Email must be valid format, password must be at least 6 characters
 */
export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Schema for password change validation
 * New password must be different from old password and at least 8 characters
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
  confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Password baru harus berbeda dari password saat ini',
  path: ['newPassword'],
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
