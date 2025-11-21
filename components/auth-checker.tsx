"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSessionClient } from "@/app/actions/auth/get-session-client"

export function AuthChecker() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const session = await getSessionClient()
      if (!session) {
        router.push('/login')
      } else {
        setChecked(true)
      }
    }
    checkAuth()
  }, [router])

  if (!checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return null
}
