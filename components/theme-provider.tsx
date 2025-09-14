"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  // attribute = "class", // Unused parameter
  // defaultTheme = "system", // Unused parameter
  // enableSystem = true, // Unused parameter
  // disableTransitionOnChange = false, // Unused parameter
  // ..._props // Unused props, removed to avoid warning
}: ThemeProviderProps) {
  // Simple theme provider without next-themes dependency
  // For now, we'll just pass through children
  // You can extend this later with actual theme switching logic
  return <>{children}</>
}
