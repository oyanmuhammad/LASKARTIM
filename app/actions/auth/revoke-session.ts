'use server'

import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function revokeSessionAction(sessionId: string) {
  try {
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie')
    const currentSessionToken = cookieHeader?.split('better-auth.session_token=')[1]?.split(';')[0]
    
    if (!currentSessionToken) {
      return {
        success: false,
        error: 'Tidak ada sesi aktif',
      }
    }

    // Get current session to verify user
    const { data: currentSession } = await db
      .from('Session')
      .select('userId')
      .eq('token', currentSessionToken)
      .single()

    if (!currentSession) {
      return {
        success: false,
        error: 'Sesi tidak valid',
      }
    }

    // Get target session to verify ownership
    const { data: targetSession } = await db
      .from('Session')
      .select('userId')
      .eq('id', sessionId)
      .single()

    if (!targetSession || targetSession.userId !== currentSession.userId) {
      return {
        success: false,
        error: 'Tidak dapat mencabut sesi ini',
      }
    }

    // Delete the session
    await db.from('Session').delete().eq('id', sessionId)

    revalidatePath('/dashboard/sessions')
    
    return {
      success: true,
      message: 'Sesi berhasil dicabut',
    }
  } catch (error) {
    console.error('Revoke session error:', error)
    return {
      success: false,
      error: 'Gagal mencabut sesi',
    }
  }
}

export async function revokeAllOtherSessionsAction() {
  try {
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie')
    const currentSessionToken = cookieHeader?.split('better-auth.session_token=')[1]?.split(';')[0]
    
    if (!currentSessionToken) {
      return {
        success: false,
        error: 'Tidak ada sesi aktif',
      }
    }

    // Get current session
    const { data: currentSession } = await db
      .from('Session')
      .select('id, userId')
      .eq('token', currentSessionToken)
      .single()

    if (!currentSession) {
      return {
        success: false,
        error: 'Sesi tidak valid',
      }
    }

    // Delete all other sessions for this user
    await db
      .from('Session')
      .delete()
      .eq('userId', currentSession.userId)
      .neq('id', currentSession.id)

    revalidatePath('/dashboard/sessions')
    
    return {
      success: true,
      message: 'Semua sesi lain berhasil dicabut',
    }
  } catch (error) {
    console.error('Revoke all sessions error:', error)
    return {
      success: false,
      error: 'Gagal mencabut sesi',
    }
  }
}
