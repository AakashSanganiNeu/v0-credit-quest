"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, PieChart, Menu, X, Coins } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-gradient-to-br from-[#E6007A] to-[#6D3AEE]"></div>
          <span className="text-xl font-bold">PolkaScore</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <PieChart className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/stake"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/stake" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Coins className="h-4 w-4" />
            Stake
          </Link>
          <ModeToggle />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-colors",
                pathname === "/" ? "bg-muted" : "hover:bg-muted",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-colors",
                pathname === "/dashboard" ? "bg-muted" : "hover:bg-muted",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <PieChart className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/stake"
              className={cn(
                "flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-colors",
                pathname === "/stake" ? "bg-muted" : "hover:bg-muted",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <Coins className="h-4 w-4" />
              Stake
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
