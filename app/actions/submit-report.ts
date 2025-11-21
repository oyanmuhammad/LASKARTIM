"use server";

import { db } from "@/lib/db";
import { reportSubmissionSchema } from "@/lib/validations/report-schema";
import { checkSpamLimit } from "@/lib/spam-checker";
import { headers } from "next/headers";
import { checkRateLimit, getClientIP, recordFailedAttempt, resetRateLimit } from "@/lib/rate-limiter";
import { revalidatePath } from "next/cache";

interface SubmitReportResult {
  success: boolean;
  reportId?: string;
  message?: string;
  error?: string;
  rateLimitMessage?: string;
}

export async function submitReportAction(data: {
  nik: string;
  category: string;
  location: string;
  title: string;
  description: string;
}): Promise<SubmitReportResult> {
  try {
    const headersList = await headers();
    const clientIP = getClientIP(headersList);

    const rateLimitCheck = await checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: "Terlalu banyak percobaan",
        rateLimitMessage: rateLimitCheck.message,
      };
    }

    const validation = reportSubmissionSchema.safeParse(data);
    if (!validation.success) {
      const errors = validation.error.issues.map((e) => e.message).join(", ");
      await recordFailedAttempt(clientIP);
      return {
        success: false,
        error: errors,
      };
    }

    const validatedData = validation.data;

    const { data: nikRecord, error: nikError } = await db
      .from('NIKRecord')
      .select('nik, name, isActive')
      .eq('nik', validatedData.nik)
      .maybeSingle();

    if (nikError || !nikRecord) {
      await recordFailedAttempt(clientIP);
      return {
        success: false,
        error: "NIK tidak ditemukan dalam database",
      };
    }

    if (!nikRecord.isActive) {
      await recordFailedAttempt(clientIP);
      return {
        success: false,
        error: "NIK tidak aktif. Silakan hubungi administrator.",
      };
    }

    await resetRateLimit(clientIP);

    const spamCheck = await checkSpamLimit(validatedData.nik);
    if (!spamCheck.allowed) {
      return {
        success: false,
        error: spamCheck.message,
      };
    }

    const locationMap: Record<string, string> = {
      "DUSUN_KARANG_BARU_TIMUR": "DUSUN_KARANG_BARU_TIMUR",
      "DUSUN_TAMPATAN": "DUSUN_TAMPATAN",
      "DUSUN_PAOK_DANGKA": "DUSUN_PAOK_DANGKA",
    };

    const { createId } = await import('@paralleldrive/cuid2');
    const reportId = createId();

    const { data: report, error: reportError } = await db
      .from('Report')
      .insert([{
        id: reportId,
        nik: validatedData.nik,
        title: validatedData.title,
        category: validatedData.category,
        location: locationMap[validatedData.location] || "DUSUN_KARANG_BARU_TIMUR",
        description: validatedData.description,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }])
      .select('id')
      .single();

    if (reportError || !report) {
      return {
        success: false,
        error: "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.",
      };
    }

    // Revalidate all pages that display reports
    revalidatePath('/dashboard/reports')
    revalidatePath('/dashboard')
    revalidatePath('/aspirasi')

    return {
      success: true,
      reportId: report.id,
      message: "Laporan berhasil dikirim! Tim kami akan segera menindaklanjuti aspirasi Anda.",
    };
  } catch (error) {
    console.error("Error submitting report:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.",
    };
  }
}
