import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { multiSession } from 'better-auth/plugins'
import { prisma } from './db'
import { db } from './db'
import { cookies } from 'next/headers'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignUpEmail: false,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days cache
    },
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update once per day
  },
  appName: 'Layanan Aspirasi Publik',
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  plugins: [
    nextCookies(),
    multiSession({
      maximumSessions: 5, // Max 5 devices per user
    }),
  ],
})

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('better-auth.session_token')?.value
    
    if (!sessionToken) {
      return null
    }

    const { data: session, error } = await db
      .from('Session')
      .select('id, userId, token, expiresAt, User!inner(id, email, name, image, emailVerified)')
      .eq('token', sessionToken)
      .single();

    if (error || !session) {
      return null
    }

    const expiresAt = new Date(session.expiresAt)
    if (expiresAt < new Date()) {
      await db.from('Session').delete().eq('id', session.id)
      return null
    }

    const user = Array.isArray(session.User) ? session.User[0] : session.User

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      },
      session: {
        id: session.id,
        expiresAt: expiresAt,
      },
    }
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

export async function getSessionSafe() {
  try {
    return await getSession()
  } catch {
    return null
  }
}
