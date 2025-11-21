"use client"

import { useSearchParams } from 'next/navigation'
import PasswordChangeDialog from '@/components/password-change-dialog'

export function ChangePasswordContent() {
  const searchParams = useSearchParams()
  const forceChange = searchParams.get('force') === 'true'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-background -z-10" />
      <div
        className="absolute inset-0 -z-10 opacity-100 dark:opacity-0 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(6, 78, 59, 0.04) 0%, transparent 50%)
          `,
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-0 dark:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(6, 78, 59, 0.08) 0%, transparent 50%)
          `,
        }}
      />

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Layanan Aspirasi Publik
          </h1>
          <p className="text-muted-foreground">
            Platform aspirasi masyarakat yang transparan dan responsif
          </p>
        </div>

        {/* Warning Banner - tampil di atas jika force change */}
        {forceChange && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Keamanan: Password Default Terdeteksi
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  Anda menggunakan password default. Silakan ubah ke password yang kuat untuk melanjutkan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Form */}
        <PasswordChangeDialog forceChange={forceChange} />

        {/* Info footer */}
        <p className="text-center text-xs text-muted-foreground">
          Pastikan password Anda mengandung minimal 8 karakter untuk keamanan optimal
        </p>
      </div>
    </div>
  )
}
