import { Suspense } from 'react'
import { SessionsContent } from '@/components/sessions-content'

export default function SessionsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manajemen Sesi</h1>
        <p className="text-muted-foreground mt-1">
          Kelola perangkat yang terhubung ke akun Anda
        </p>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <SessionsContent />
      </Suspense>
    </div>
  )
}
