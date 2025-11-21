import { Suspense } from "react"
import { ProfileContent } from "@/components/profile-content"

export default function ProfilePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-radial from-emerald-100/40 via-teal-50/30 to-cyan-100/20 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-emerald-200/30 to-transparent dark:from-emerald-900/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-teal-200/30 to-transparent dark:from-teal-900/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profil Administrator</h1>
          <p className="text-muted-foreground">
            Kelola informasi profil Anda
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  )
}
