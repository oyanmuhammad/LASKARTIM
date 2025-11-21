import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Better Auth API Route
 * Handles all authentication endpoints:
 * - POST /api/auth/sign-in
 * - POST /api/auth/sign-up
 * - POST /api/auth/sign-out
 * - GET /api/auth/session
 * - GET /api/auth/get-session
 * - etc.
 */
export const { POST, GET } = toNextJsHandler(auth)
