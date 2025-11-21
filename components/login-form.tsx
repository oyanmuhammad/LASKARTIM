"use client"

import React, { useState } from "react"
import { loginAction } from "@/app/actions/auth/login"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { cn } from "@/lib/utils"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (!email || !password) {
      setError("Email dan password harus diisi")
      return
    }

    setLoading(true)
    
    try {
      const result = await loginAction({
        email,
        password,
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
      setError("Gagal melakukan login. Silakan coba lagi.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login Administrator</CardTitle>
        <CardDescription>Masuk untuk mengakses dashboard admin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aspirasi.gov"
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {error ? (
            <div role="alert" className="text-destructive text-sm mt-2 p-3 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          ) : null}

          <CardFooter className="pt-1 px-0">
            <Button 
              type="submit" 
              className={cn("w-full", loading ? "opacity-80" : "")}
              disabled={loading}
            >
              {loading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
