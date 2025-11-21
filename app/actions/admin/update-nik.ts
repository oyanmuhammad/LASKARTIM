'use server'

import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { nikSchema } from "@/lib/validations/nik-schema"
import { z } from "zod"

export async function updateNIKAction(nik: string, name: string) {
  try {
    const session = await getSession()
    if (!session?.user) {
      redirect('/login')
    }

    const validatedData = nikSchema.parse({ nik, name })

    const { data: updatedNIK, error } = await db
      .from('NIKRecord')
      .update({ 
        name: validatedData.name,
        updatedAt: new Date().toISOString()
      })
      .eq('nik', validatedData.nik)
      .select()
      .single();

    if (error || !updatedNIK) {
      return {
        success: false,
        error: 'Terjadi kesalahan saat memperbarui NIK',
      }
    }

    revalidatePath('/dashboard/nik')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'NIK berhasil diperbarui',
      nikRecord: updatedNIK,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    console.error('Update NIK error:', error)
    return {
      success: false,
      error: 'Terjadi kesalahan saat memperbarui NIK',
    }
  }
}
