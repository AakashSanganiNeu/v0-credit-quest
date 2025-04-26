import { HeroSection } from "@/components/hero-section"
import { Navbar } from "@/components/navbar"
import { WalletConnect } from "@/components/wallet-connect"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WalletConnect />
    </main>
  )
}
