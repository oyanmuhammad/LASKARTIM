'use server'

import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function deactivateNIKAction(nik: string) {
  try {
    const session = await getSession()
    if (!session?.user) {
      redirect('/login')
    }

    const { data: deactivatedNIK, error } = await db
      .from('NIKRecord')
      .update({ 
        isActive: false,
        updatedAt: new Date().toISOString()
      })
      .eq('nik', nik)
      .select()
      .single();

    if (error || !deactivatedNIK) {
      return {
        success: false,
        error: 'Terjadi kesalahan saat menonaktifkan NIK',
      }
    }

    revalidatePath('/dashboard/nik')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'NIK berhasil dinonaktifkan',
      nikRecord: deactivatedNIK,
    }
  } catch (error) {
    console.error('Deactivate NIK error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat menonaktifkan NIK',
    }
  }
}
