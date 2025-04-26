"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function HeroSection() {
  const scrollToWalletConnect = () => {
    const element = document.getElementById("wallet-connect")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-background via-background to-background">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
      <div className="absolute h-full w-full bg-gradient-to-br from-[#E6007A]/20 to-[#6D3AEE]/20 opacity-20"></div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E6007A] to-[#6D3AEE]">
              PolkaScore
            </span>
            <span className="block">Your Polkadot Credit Score</span>
          </h1>
          <p className="mb-10 text-xl text-muted-foreground">
            Discover your blockchain reputation based on your Polkadot network activity. Connect your wallet to see your
            personalized credit score.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#E6007A] to-[#6D3AEE] hover:opacity-90 transition-opacity"
              onClick={scrollToWalletConnect}
            >
              Check Your Score
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <Button variant="ghost" size="icon" onClick={scrollToWalletConnect} aria-label="Scroll down">
          <ArrowDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  )
}
