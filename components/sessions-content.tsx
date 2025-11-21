"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Monitor, Smartphone, Tablet, Trash2, Shield } from 'lucide-react'
import { getSessionsAction } from '@/app/actions/auth/get-sessions'
import { revokeSessionAction, revokeAllOtherSessionsAction } from '@/app/actions/auth/revoke-session'
import { parseUserAgent, getDeviceDescription } from '@/lib/device-parser'
import { getSessionClient } from '@/app/actions/auth/get-session-client'
import { toast } from 'sonner'

function getDeviceIcon(userAgent: string | null) {
  const { isMobile, isTablet } = parseUserAgent(userAgent)
  
  if (isMobile) return <Smartphone className="h-5 w-5" />
  if (isTablet) return <Tablet className="h-5 w-5" />
  return <Monitor className="h-5 w-5" />
}

function getDeviceName(userAgent: string | null) {
  return getDeviceDescription(userAgent)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

interface Session {
  id: string
  userAgent: string | null
  ipAddress: string | null
  createdAt: string
  expiresAt: string
  isCurrent: boolean
}

export function SessionsContent() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSessions = useCallback(async () => {
    setLoading(true)
    try {
      const authSession = await getSessionClient()
      if (!authSession) {
        router.push('/login')
        return
      }

      const result = await getSessionsAction()
      if (result.success) {
        setSessions(result.sessions)
      } else {
        setError(result.error || 'Failed to load sessions')
      }
    } catch (err) {
      setError('Failed to load sessions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSessionAction(sessionId)
      toast.success('Sesi berhasil dicabut')
      loadSessions()
    } catch (err) {
      toast.error('Gagal mencabut sesi')
      console.error(err)
    }
  }

  const handleRevokeAll = async () => {
    try {
      await revokeAllOtherSessionsAction()
      toast.success('Semua sesi lain berhasil dicabut')
      loadSessions()
    } catch (err) {
      toast.error('Gagal mencabut sesi')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Sesi</CardTitle>
          <CardDescription>Kelola perangkat yang terhubung ke akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const currentSession = sessions.find(s => s.isCurrent)
  const otherSessions = sessions.filter(s => !s.isCurrent)

  return (
    <div className="space-y-4">
      {/* Current Session */}
      {currentSession && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getDeviceIcon(currentSession.userAgent)}
                <div>
                  <CardTitle className="text-lg">
                    {getDeviceName(currentSession.userAgent)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentSession.ipAddress || 'IP tidak diketahui'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="default">Sesi Saat Ini</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Login Terakhir</p>
                <p className="font-medium">{formatDate(currentSession.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kadaluarsa</p>
                <p className="font-medium">{formatDate(currentSession.expiresAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Sessions */}
      {otherSessions.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Sesi Lainnya</h2>
            <Button
              onClick={handleRevokeAll}
              variant="destructive"
              size="sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Cabut Semua Sesi Lain
            </Button>
          </div>
          {otherSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(session.userAgent)}
                    <div>
                      <CardTitle className="text-lg">
                        {getDeviceName(session.userAgent)}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {session.ipAddress || 'IP tidak diketahui'}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRevokeSession(session.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cabut Sesi
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Login Terakhir</p>
                    <p className="font-medium">{formatDate(session.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Kadaluarsa</p>
                    <p className="font-medium">{formatDate(session.expiresAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Tidak ada sesi lain yang aktif
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Tips Keamanan:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Cabut sesi yang tidak Anda kenali</li>
                <li>Maksimal 5 perangkat dapat login bersamaan</li>
                <li>Sesi akan otomatis kadaluarsa setelah 30 hari</li>
                <li>Jika mencabut sesi, perangkat tersebut harus login ulang</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
