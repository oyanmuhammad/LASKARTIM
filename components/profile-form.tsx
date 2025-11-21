'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { updateProfileAction } from "@/app/actions/auth/update-profile"
import { User, Mail, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileFormProps {
  user: {
    name: string
    email: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    setSuccess('')

    const result = await updateProfileAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(result.message || 'Profil berhasil diperbarui')
      setLoading(false)
      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh()
      }, 1500)
    }
  }

  return (
    <Card className="p-6 shadow-lg">
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Nama Lengkap
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name}
            placeholder="Masukkan nama lengkap"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            placeholder="Masukkan email"
            required
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Email dapat diubah tanpa verifikasi
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-emerald-600 dark:text-emerald-400 text-sm">
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          size="lg"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </Card>
  )
}
