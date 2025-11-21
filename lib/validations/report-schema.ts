import { z } from "zod";

/**
 * Validation schema for report submission
 * Ensures all inputs are alphanumeric only for security
 */

// Alphanumeric pattern (letters, numbers, spaces only - no special characters)
const alphanumericPattern = /^[a-zA-Z0-9\s]+$/;

// Location enum matching database
export const ReportLocation = z.enum([
  "DUSUN_KARANG_BARU_TIMUR",
  "DUSUN_TAMPATAN",
  "DUSUN_PAOK_DANGKA",
]);

// Category values (stored as string in database)
const validCategories = [
  "INFRASTRUKTUR",
  "SOSIAL",
  "LINGKUNGAN",
  "ADMINISTRASI",
  "LAINNYA",
] as const;

type Category = typeof validCategories[number];

export const reportSubmissionSchema = z.object({
  nik: z
    .string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d{16}$/, "NIK hanya boleh berisi angka"),
  
  category: z
    .string()
    .refine((val): val is Category => validCategories.includes(val as Category), "Kategori tidak valid"),
  
  location: ReportLocation,
  
  title: z
    .string()
    .min(1, "Judul tidak boleh kosong")
    .max(50, "Judul maksimal 50 karakter")
    .regex(alphanumericPattern, "Judul hanya boleh berisi huruf, angka, dan spasi"),
  
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(500, "Deskripsi maksimal 500 karakter")
    .regex(alphanumericPattern, "Deskripsi hanya boleh berisi huruf, angka, dan spasi"),
});

export type ReportSubmissionInput = z.infer<typeof reportSubmissionSchema>;
