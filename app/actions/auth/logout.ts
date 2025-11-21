'use server'

import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
import { db } from '@/lib/db'

export async function logoutAction() {
  try {
    const cookieStore = await cookies()
    const headersList = await headers()
    
    const cookieHeader = headersList.get('cookie')
    const sessionToken = cookieHeader?.split('better-auth.session_token=')[1]?.split(';')[0]
    
    if (sessionToken) {
      await db.from('Session').delete().eq('token', sessionToken)
    }
    
    cookieStore.delete('better-auth.session_token')
  } catch (error) {
    console.error('Logout error:', error)
  }

  redirect('/login')
}
