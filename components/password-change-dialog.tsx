'use client'

import { useState } from 'react'
import { changePasswordAction } from '@/app/actions/auth/change-password'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'

interface PasswordChangeDialogProps {
  forceChange?: boolean
}

export default function PasswordChangeDialog({ forceChange = false }: PasswordChangeDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validate inputs
    if (!currentPassword) {
      setError('Password saat ini wajib diisi')
      return
    }

    if (!newPassword) {
      setError('Password baru wajib diisi')
      return
    }

    if (newPassword.length < 8) {
      setError('Password baru minimal 8 karakter')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    if (currentPassword === newPassword) {
      setError('Password baru harus berbeda dari password saat ini')
      return
    }

    setLoading(true)

    try {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      })

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      // Catch redirect errors and other exceptions
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        // Redirect errors are expected and handled by Next.js
        return
      }
      setError('Gagal mengubah password. Silakan coba lagi.')
      console.error('Change password error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Ubah Kata Sandi</CardTitle>
        <CardDescription className="text-base">
          {forceChange
            ? 'Anda harus mengubah password default untuk melanjutkan'
            : 'Ubah password administrator Anda'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium">
              Password Saat Ini
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan password saat ini"
                required
                disabled={loading}
                className="pr-24"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    current: !showPasswords.current,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.current ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium">
              Password Baru
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                disabled={loading}
                className="pr-24"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    new: !showPasswords.new,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.new ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Minimal 8 karakter</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">
              Konfirmasi Password Baru
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password baru"
                required
                disabled={loading}
                className="pr-24"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirm: !showPasswords.confirm,
                  })
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPasswords.confirm ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
          </div>

          {error && (
            <div role="alert" className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Sedang mengubah...' : 'Ubah Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
