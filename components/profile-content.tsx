"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { getSessionClient } from "@/app/actions/auth/get-session-client"

export function ProfileContent() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      const session = await getSessionClient()
      if (!session?.user) {
        router.push('/login')
        return
      }
      setUser({
        name: session.user.name || '',
        email: session.user.email,
      })
      setLoading(false)
    }
    loadSession()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <ProfileForm user={user} />
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Catatan:</strong> Email dapat diubah tanpa verifikasi. Pastikan email yang dimasukkan valid dan dapat diakses.
        </p>
      </div>
    </>
  )
}
