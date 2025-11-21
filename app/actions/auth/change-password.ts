'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { changePasswordSchema } from '@/lib/validations/auth-schema'
import * as bcrypt from 'bcryptjs'
import { getSession } from '@/lib/auth'

export async function changePasswordAction(formData: unknown) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return {
        success: false,
        error: 'Anda harus login terlebih dahulu',
      }
    }

    const validatedData = changePasswordSchema.parse(formData)
    const { currentPassword, newPassword } = validatedData

    const { data: user, error } = await db
      .from('User')
      .select('id, password')
      .eq('id', session.user.id)
      .single()

    if (error || !user) {
      return {
        success: false,
        error: 'User tidak ditemukan',
      }
    }

    if (!user.password) {
      return {
        success: false,
        error: 'User belum memiliki password',
      }
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatch) {
      return {
        success: false,
        error: 'Password saat ini tidak valid',
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db
      .from('User')
      .update({ 
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      })
      .eq('id', user.id)

    redirect('/dashboard')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengubah password. Silakan coba lagi.',
    }
  }
}
