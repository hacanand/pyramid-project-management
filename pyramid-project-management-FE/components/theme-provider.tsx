"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

type ColorMode = "light" | "dark"

export const accentColors = [
  { id: "neutral", label: "Neutral", value: "oklch(0.205 0 0)" },
  { id: "violet", label: "Violet", value: "oklch(0.55 0.24 292)" },
  { id: "blue", label: "Blue", value: "oklch(0.55 0.22 258)" },
  { id: "green", label: "Green", value: "oklch(0.6 0.17 152)" },
  { id: "orange", label: "Orange", value: "oklch(0.68 0.19 45)" },
  { id: "pink", label: "Pink", value: "oklch(0.62 0.24 355)" },
] as const

export type AccentId = (typeof accentColors)[number]["id"]

interface ThemeContextValue {
  mode: ColorMode
  setMode: (m: ColorMode) => void
  toggleMode: () => void
  accent: AccentId
  setAccent: (a: AccentId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function AccentProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useNextTheme()
  // next-themes uses "system" by default unless configured otherwise.
  // We'll treat anything not "dark" as "light".
  const mode = (theme === "dark" ? "dark" : "light") as ColorMode
  
  const [accent, setAccentState] = useState<AccentId>("neutral")

  useEffect(() => {
    const storedAccent = (localStorage.getItem("pyramid-accent") as AccentId) || "neutral"
    setAccentState(storedAccent)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (accent === "neutral") {
      root.style.removeProperty("--primary")
      root.style.removeProperty("--primary-foreground")
      root.style.removeProperty("--sidebar-primary")
      root.style.removeProperty("--sidebar-primary-foreground")
      root.style.removeProperty("--ring")
    } else {
      const found = accentColors.find((c) => c.id === accent) ?? accentColors[0]
      root.style.setProperty("--primary", found.value)
      root.style.setProperty("--primary-foreground", "oklch(0.985 0 0)")
      root.style.setProperty("--sidebar-primary", found.value)
      root.style.setProperty("--sidebar-primary-foreground", "oklch(0.985 0 0)")
      root.style.setProperty("--ring", found.value)
    }
  }, [accent])

  const setMode = useCallback((m: ColorMode) => setTheme(m), [setTheme])
  const toggleMode = useCallback(() => setTheme(mode === "dark" ? "light" : "dark"), [mode, setTheme])
  
  const setAccent = useCallback((a: AccentId) => {
    setAccentState(a)
    localStorage.setItem("pyramid-accent", a)
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AccentProvider>{children}</AccentProvider>
    </NextThemesProvider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
