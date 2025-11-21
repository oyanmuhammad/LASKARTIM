"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSessionClient } from "@/app/actions/auth/get-session-client"

export function LoginRedirectChecker() {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const session = await getSessionClient()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  return null
}
