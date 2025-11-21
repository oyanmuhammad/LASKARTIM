'use server'

import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email("Email tidak valid"),
})

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await getSession()
    if (!session?.user) {
      redirect('/login')
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string

    const validatedData = updateProfileSchema.parse({ name, email })

    if (email !== session.user.email) {
      const { data: existingUser } = await db
        .from('User')
        .select('id')
        .eq('email', validatedData.email)
        .single()

      if (existingUser && existingUser.id !== session.user.id) {
        return {
          error: "Email sudah digunakan oleh pengguna lain"
        }
      }
    }

    await db
      .from('User')
      .update({
        name: validatedData.name,
        email: validatedData.email,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', session.user.id)

    revalidatePath('/dashboard')
    
    return {
      success: true,
      message: "Profil berhasil diperbarui"
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.issues[0].message
      }
    }
    
    console.error('Update profile error:', error)
    return {
      error: "Terjadi kesalahan saat memperbarui profil"
    }
  }
}
