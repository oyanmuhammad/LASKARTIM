'use server'

import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { nikSchema } from "@/lib/validations/nik-schema"
import { z } from "zod"

export async function addNIKAction(nik: string, name: string) {
  try {
    const session = await getSession()
    if (!session?.user) {
      redirect('/login')
    }

    const validatedData = nikSchema.parse({ nik, name })

    const { data: existing } = await db
      .from('NIKRecord')
      .select('nik')
      .eq('nik', validatedData.nik)
      .single();

    if (existing) {
      return {
        success: false,
        error: 'NIK sudah terdaftar dalam sistem',
      }
    }

    const { data: newNIK, error } = await db
      .from('NIKRecord')
      .insert({
        nik: validatedData.nik,
        name: validatedData.name,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !newNIK) {
      return {
        success: false,
        error: 'Terjadi kesalahan saat menambahkan NIK',
      }
    }

    revalidatePath('/dashboard/nik')
    revalidatePath('/dashboard')

    return {
      success: true,
      message: 'NIK berhasil ditambahkan',
      nikRecord: newNIK,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }

    console.error('Add NIK error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat menambahkan NIK',
    }
  }
}
