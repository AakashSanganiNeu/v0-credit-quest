"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertCircle } from "lucide-react"

export function WalletConnect() {
  const router = useRouter()
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation for Polkadot address format
    if (!address || address.length < 10) {
      setError("Please enter a valid Polkadot address")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate loading
    setTimeout(() => {
      router.push(`/dashboard?address=${address}`)
    }, 1000)
  }

  return (
    <section id="wallet-connect" className="py-20 container mx-auto px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Enter your Polkadot wallet address to calculate your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Input
                    id="address"
                    placeholder="Enter your Polkadot address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E6007A] to-[#6D3AEE] hover:opacity-90 transition-opacity h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span>Connect Wallet</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
            <div className="pt-4 border-t mt-4">
              <p className="text-sm font-medium mb-2">Demo Addresses</p>
              <div className="space-y-2">
                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Diamond Tier</span>
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">700+</span>
                  </div>
                  <span className="font-mono text-xs break-all">15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5</span>
                </div>

                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Platinum Tier</span>
                    <span className="bg-slate-400 text-white text-xs px-2 py-0.5 rounded-full">600-699</span>
                  </div>
                  <span className="font-mono text-xs break-all">14Ztd3KJDaB9xyJtRkREtSZDdhLSbm7UUKr8YGXLUfQB3Ko3</span>
                </div>

                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Gold Tier</span>
                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">500-599</span>
                  </div>
                  <span className="font-mono text-xs break-all">12Y8b4C9ar863uZFNuuQwP4BsCZEKKcHQxbP9MdcNXwBKUa9</span>
                </div>

                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Silver Tier</span>
                    <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full">400-499</span>
                  </div>
                  <span className="font-mono text-xs break-all">16LavPxjMCbJmwKgLxzwQG6SiT7voMFT8EErNnmSvXDFGnJP</span>
                </div>

                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Bronze Tier</span>
                    <span className="bg-amber-700 text-white text-xs px-2 py-0.5 rounded-full">&lt;400</span>
                  </div>
                  <span className="font-mono text-xs break-all">1F9VkLCkGWwtk7nPWjDhQDEUxBTw7HHy8xkfdqtAqbUXbCc</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use these demo addresses to test different PolkaScore tiers
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Your wallet address is only used to fetch public blockchain data
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
