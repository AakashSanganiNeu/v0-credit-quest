"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ScoreOverview } from "@/components/score-overview"
import { ScoreBreakdown } from "@/components/score-breakdown"
import { ScoreRecommendations } from "@/components/score-recommendations"
import { MintNFT } from "@/components/mint-nft"
import { Skeleton } from "@/components/ui/skeleton"
import { calculateScore, fetchUserData } from "@/lib/score-calculator"
import type { UserData } from "@/types/user-data"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get("address")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!walletAddress) return

      setLoading(true)
      try {
        // In a real app, this would fetch actual blockchain data
        const data = await fetchUserData(walletAddress)
        setUserData(data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [walletAddress])

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold">No wallet address provided</h1>
          <p className="mt-4">Please connect your wallet from the home page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your PolkaScore Dashboard</h1>
          <p className="text-muted-foreground">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ) : userData ? (
          <div className="space-y-8">
            <ScoreOverview score={calculateScore(userData)} />
            <ScoreBreakdown userData={userData} />
            <ScoreRecommendations userData={userData} />
            <MintNFT score={calculateScore(userData)} walletAddress={walletAddress} />
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Error loading data</h2>
            <p className="mt-4">Unable to fetch your blockchain data. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}
