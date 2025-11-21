'use server'

import { db } from '@/lib/db'
import { headers } from 'next/headers'

export async function getSessionsAction() {
  try {
    const headersList = await headers()
    const cookieHeader = headersList.get('cookie')
    const currentSessionToken = cookieHeader?.split('better-auth.session_token=')[1]?.split(';')[0]
    
    if (!currentSessionToken) {
      return {
        success: false,
        error: 'Tidak ada sesi aktif',
        sessions: [],
      }
    }

    const { data: currentSession } = await db
      .from('Session')
      .select('id, userId')
      .eq('token', currentSessionToken)
      .single()

    if (!currentSession) {
      return {
        success: false,
        error: 'Sesi tidak valid',
        sessions: [],
      }
    }

    // Get all sessions for the user
    const { data: sessions, error } = await db
      .from('Session')
      .select('id, ipAddress, userAgent, createdAt, updatedAt, expiresAt')
      .eq('userId', currentSession.userId)
      .gt('expiresAt', new Date().toISOString())
      .order('createdAt', { ascending: false })

    if (error) {
      return {
        success: false,
        error: 'Gagal mengambil data sesi',
        sessions: [],
      }
    }

    // Mark current session
    const sessionsWithCurrent = sessions?.map(session => ({
      ...session,
      isCurrent: session.id === currentSession.id,
    })) || []

    return {
      success: true,
      sessions: sessionsWithCurrent,
    }
  } catch (error) {
    console.error('Get sessions error:', error)
    return {
      success: false,
      error: 'Gagal mengambil data sesi',
      sessions: [],
    }
  }
}
