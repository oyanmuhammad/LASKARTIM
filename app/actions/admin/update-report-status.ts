'use server'

import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { updateStatusSchema } from "@/lib/validations/admin-schema"
import { z } from "zod"

type ReportStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'

export async function updateReportStatusAction(
  reportId: string,
  status: ReportStatus
) {
  try {
    const session = await getSession()
    if (!session?.user) {
      redirect('/login')
    }

    const trimmedReportId = reportId.trim()

    const validatedData = updateStatusSchema.parse({ 
      reportId: trimmedReportId, 
      status 
    })

    const { data: updatedReport, error } = await db
      .from('Report')
      .update({ 
        status: validatedData.status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', validatedData.reportId)
      .select('*, NIKRecord(name)')
      .single();

    if (error || !updatedReport) {
      return {
        success: false,
        error: 'Terjadi kesalahan saat memperbarui status laporan',
      }
    }

    revalidatePath('/dashboard/reports')
    revalidatePath('/dashboard')
    revalidatePath('/aspirasi')

    return {
      success: true,
      message: 'Status laporan berhasil diperbarui',
      report: updatedReport,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    console.error('Update report status error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat memperbarui status laporan',
    }
  }
}
