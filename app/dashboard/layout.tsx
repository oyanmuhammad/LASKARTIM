import { Suspense } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { DashboardUserMenu } from "@/components/dashboard-user-menu"
import { AuthChecker } from "@/components/auth-checker"
import Link from "next/link"
import { Home, FileText, Users, Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Auth Check - Dynamic */}
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <AuthChecker />
      </Suspense>

      {/* Navigation Bar - Static Shell */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Always Visible */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold hidden sm:inline">Admin Dashboard</span>
              <span className="text-lg font-bold sm:hidden">Admin</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard/reports"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Laporan
              </Link>
              <Link
                href="/dashboard/nik"
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
              >
                <Users className="h-4 w-4" />
                NIK
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:block">
                <ModeToggle />
              </div>
              
              {/* User Menu - Dynamic with Suspense */}
              <Suspense fallback={
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              }>
                <DashboardUserMenu />
              </Suspense>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <SheetHeader>
                    <SheetTitle>Menu Navigasi</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <Home className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/reports"
                      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">Laporan</span>
                    </Link>
                    <Link
                      href="/dashboard/nik"
                      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <Users className="h-5 w-5" />
                      <span className="font-medium">NIK</span>
                    </Link>
                    <div className="border-t pt-4 sm:hidden">
                      <div className="px-4">
                        <ModeToggle />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  )
}
