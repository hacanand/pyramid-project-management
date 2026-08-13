"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search, User, Sun, Palette, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { currentUser } from "@/lib/data"
import { useTheme, accentColors, type AccentId } from "@/components/theme-provider"
import { useProfile, useProfileActions } from "@/lib/hooks"

type Section = "profile" | "theme" | "color"

const NAV: { id: Section; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "theme", label: "Theme", icon: Sun },
  { id: "color", label: "Color", icon: Palette },
]

export function SettingsView() {
  const [section, setSection] = useState<Section>("profile")

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="flex w-64 shrink-0 flex-col gap-4 border-r bg-muted/30 p-4">
        <Link
          href="/tasks"
          className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to app
        </Link>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                section === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto px-8 py-10 lg:px-16">
        <div className="mx-auto max-w-3xl">
          {section === "profile" && <ProfileSection />}
          {section === "theme" && <ThemeSection />}
          {section === "color" && <ColorSection />}
        </div>
      </main>
    </div>
  )
}

function ProfileSection() {
  const { profile, isLoading } = useProfile()
  const { updateProfile } = useProfileActions()
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    username: "",
  })
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        username: profile.username || "",
      })
    }
  }, [profile])

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    try {
      await updateProfile(formData)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !profile) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Row label="Profile picture">
          <Avatar className="size-9">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
            <AvatarFallback>{profile.initials}</AvatarFallback>
          </Avatar>
        </Row>
        <Separator />
        <Row label="Email">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {profile.email}
          </div>
        </Row>
        <Separator />
        <FormRow 
          label="Full name" 
          placeholder="Dexter" 
          value={formData.name}
          onChange={(v) => setFormData(prev => ({ ...prev, name: v }))}
        />
        <Separator />
        <FormRow
          label="Title"
          description="Your job title or role"
          placeholder="Designer"
          value={formData.title}
          onChange={(v) => setFormData(prev => ({ ...prev, title: v }))}
        />
        <Separator />
        <FormRow
          label="Username"
          description="One word, like a nickname or first name"
          placeholder="Dexuser"
          value={formData.username}
          onChange={(v) => setFormData(prev => ({ ...prev, username: v }))}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Workspace access</h2>
        <div className="flex items-center justify-between rounded-xl border bg-card px-6 py-5">
          <span className="text-sm text-muted-foreground">
            Remove yourself from the workspace
          </span>
          <Button
            variant="ghost"
            className="bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive"
          >
            Leave Workspace
          </Button>
        </div>
      </div>
    </div>
  )
}

function ThemeSection() {
  const { mode, setMode } = useTheme()
  const options: { id: "light" | "dark"; label: string }[] = [
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ]
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Theme</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setMode(o.id)}
            className={cn(
              "flex flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors",
              mode === o.id ? "border-foreground ring-1 ring-foreground" : "hover:bg-accent/40",
            )}
          >
            <div
              className={cn(
                "h-20 rounded-lg border",
                o.id === "dark"
                  ? "bg-neutral-900"
                  : o.id === "light"
                    ? "bg-white"
                    : "bg-gradient-to-r from-white to-neutral-900",
              )}
            />
            <span className="flex items-center justify-between text-sm font-medium">
              {o.label}
              {mode === o.id && <Check className="size-4" />}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorSection() {
  const { accent, setAccent } = useTheme()
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Color</h1>
      <p className="text-sm text-muted-foreground">
        Choose an accent color for your workspace.
      </p>
      <div className="flex flex-wrap gap-3">
        {accentColors.map((c: { id: AccentId; label: string; value: string }) => (
          <button
            key={c.id}
            type="button"
            aria-label={c.label}
            onClick={() => setAccent(c.id)}
            className={cn(
              "flex size-12 items-center justify-center rounded-full border-2 transition-transform hover:scale-105",
              accent === c.id ? "border-foreground" : "border-transparent",
            )}
            style={{ backgroundColor: c.value }}
          >
            {accent === c.id && <Check className="size-5 text-white" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  )
}

function FormRow({
  label,
  description,
  placeholder,
  value,
  onChange,
}: {
  label: string
  description?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <Field className="gap-1">
        <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </Field>
      <Input 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-56 bg-muted/50" 
      />
    </div>
  )
}
