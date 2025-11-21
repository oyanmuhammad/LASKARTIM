"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { UserCircle, Settings, Smartphone, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getSessionClient } from "@/app/actions/auth/get-session-client"
import { logoutAction } from "@/app/actions/auth/logout"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
}

export function DashboardUserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      const session = await getSessionClient()
      if (session?.user) {
        setUser(session.user)
      }
      setLoading(false)
    }
    loadSession()
  }, [])

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    )
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {user.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-sm font-medium max-w-[100px] truncate">{user.name || user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-semibold text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
            <UserCircle className="h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/change-password" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            Ubah Password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/sessions" className="flex items-center gap-2 cursor-pointer">
            <Smartphone className="h-4 w-4" />
            Kelola Sesi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction} className="w-full">
          <button
            type="submit"
            className="w-full text-left px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
