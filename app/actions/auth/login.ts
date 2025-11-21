'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { loginSchema } from '@/lib/validations/auth-schema'
import * as bcrypt from 'bcryptjs'
import { cookies, headers } from 'next/headers'

const DEFAULT_EMAIL = 'admin@aspirasi.gov'
const DEFAULT_PASSWORD = 'admin123'

export async function loginAction(formData: unknown) {
  try {
    const validatedData = loginSchema.parse(formData)
    const { email, password } = validatedData

    const { data: user, error } = await db
      .from('User')
      .select('id, email, name, password, image, emailVerified, createdAt, updatedAt')
      .eq('email', email)
      .single();

    if (error || !user || !user.password) {
      return {
        success: false,
        error: 'Email atau password tidak valid',
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return {
        success: false,
        error: 'Email atau password tidak valid',
      }
    }

    // Check if using default credentials
    const isUsingDefaultCredentials = 
      email === DEFAULT_EMAIL && 
      password === DEFAULT_PASSWORD

    // Get device information
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || 'Unknown'
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] || 
                      headersList.get('x-real-ip') || 
                      'Unknown'

    // Create new session with device info
    const sessionId = crypto.randomUUID()
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Clean up expired sessions first
    await db
      .from('Session')
      .delete()
      .eq('userId', user.id)
      .lt('expiresAt', new Date().toISOString())

    // Check current active session count and enforce limit (max 5 devices)
    const { data: existingSessions } = await db
      .from('Session')
      .select('id, createdAt')
      .eq('userId', user.id)
      .gte('expiresAt', new Date().toISOString())
      .order('createdAt', { ascending: true })

    console.log('Existing sessions count:', existingSessions?.length || 0)

    // If user has 5 or more active sessions, delete oldest ones to make room
    if (existingSessions && existingSessions.length >= 5) {
      const sessionsToDelete = existingSessions.slice(0, existingSessions.length - 4)
      console.log('Deleting oldest sessions:', sessionsToDelete.length)
      
      for (const session of sessionsToDelete) {
        const { error: delError } = await db.from('Session').delete().eq('id', session.id)
        if (delError) console.error('Delete session error:', delError)
      }
    }

    // Create new session with all required fields
    const now = new Date().toISOString()
    const { error: insertError } = await db.from('Session').insert({
      id: sessionId,
      userId: user.id,
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
      ipAddress,
      userAgent,
      createdAt: now,
      updatedAt: now,
    }).select()

    if (insertError) {
      console.error('Insert session error:', insertError)
      return {
        success: false,
        error: `Gagal membuat sesi login: ${insertError.message || 'Unknown error'}`,
      }
    }



    const cookieStore = await cookies()
    cookieStore.set('better-auth.session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    // Force password change if using default credentials
    if (isUsingDefaultCredentials) {
      redirect('/dashboard/change-password?force=true')
    }

    redirect('/dashboard')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('NEXT_REDIRECT')) {
        throw error
      }
    }

    console.error('Login error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal melakukan login. Silakan coba lagi.',
    }
  }
}
