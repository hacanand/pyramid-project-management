"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { api } from "@/lib/api/client"
import { setAuthToken } from "@/lib/api/config"
import type { AuthResponse } from "@/lib/types"
import { PyramidLogo } from "@/components/pyramid-logo"
import { Button } from "@/components/ui/button"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleGuestLogin() {
    try {
      setLoading(true)
      const res = await api.post<AuthResponse>("/auth/guest")
      setAuthToken(res.token)
      router.push("/tasks")
    } catch (err) {
      console.error("Login failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <PyramidLogo />
          <span className="text-lg font-semibold">Pyramid</span>
        </div>

        <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-xl font-semibold text-balance">Let&apos;s get back on track</h1>
            <p className="text-sm text-muted-foreground text-pretty">
              Enter your email below to login to your account.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button 
              size="lg" 
              className="h-11 w-full rounded-full text-sm" 
              onClick={handleGuestLogin}
              disabled={loading}
            >
              Continue as Guest
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 w-full rounded-full text-sm"
              disabled={loading}
            >
              <GoogleIcon />
              Login with Google
            </Button>
          </div>
        </div>

        <p className="max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link href="#" className="underline underline-offset-2 hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  )
}
