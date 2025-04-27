"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ScoreOverview } from "@/components/score-overview"
import { ScoreBreakdown } from "@/components/score-breakdown"
import { ScoreRecommendations } from "@/components/score-recommendations"
import { MintNFT } from "@/components/mint-nft"
import { UserNFTs } from "@/components/user-nfts"
import { MintingGuide } from "@/components/minting-guide"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchUserData } from "@/lib/score-calculator"
import { getNFTCount, getUserMintedBadgeTypes } from "@/lib/nft-service"
import { getSimulatedPolkadotCreditScore } from "@/lib/polkadot-score-service"
import type { UserData } from "@/types/user-data"
import { ContractDebug } from "@/components/contract-debug"
import { ContractTest } from "@/components/contract-test"
import { TransferGrid } from "@/components/transfer-grid"
import { GovernanceGrid } from "@/components/governance-grid"
import { StakingGrid } from "@/components/staking-grid"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle } from "lucide-react"
import { PolkadotScoreDetails } from "@/components/polkadot-score-details"

export default function Dashboard() {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get("address")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mintedBadges, setMintedBadges] = useState<string[]>([])
  const [score, setScore] = useState<number>(0)
  const [nftCount, setNftCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean>(false)
  const [loadingNFTs, setLoadingNFTs] = useState<boolean>(false)
  const [polkadotMetrics, setPolkadotMetrics] = useState<any>(null)

  // Check if MetaMask is available
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMetaMaskAvailable(!!window.ethereum)
    }
  }, [])

  // Load user data and score
  useEffect(() => {
    const loadData = async () => {
      if (!walletAddress) return

      setLoading(true)
      setError(null)

      try {
        // Get the Polkadot credit score
        const { score: polkadotScore, metrics } = await getSimulatedPolkadotCreditScore(walletAddress)
        setScore(polkadotScore)
        setPolkadotMetrics(metrics)

        // Fetch user data based on the score
        const data = await fetchUserData(walletAddress)
        setUserData(data)

        // Get the NFT count only if MetaMask is available
        if (isMetaMaskAvailable) {
          try {
            const count = await getNFTCount()
            setNftCount(count)
          } catch (nftError) {
            console.error("Error getting NFT count:", nftError)
            // Don't set an error, just log it and continue
          }
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error)
        setError(error.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [walletAddress, isMetaMaskAvailable])

  // Load minted badges from blockchain
  useEffect(() => {
    const loadMintedBadges = async () => {
      if (!isMetaMaskAvailable || !walletAddress) return

      setLoadingNFTs(true)
      try {
        // Get the user's minted badge types from the blockchain
        const badgeTypes = await getUserMintedBadgeTypes()
        setMintedBadges(badgeTypes)
        console.log("Loaded minted badges:", badgeTypes)
      } catch (error) {
        console.error("Error loading minted badges:", error)
      } finally {
        setLoadingNFTs(false)
      }
    }

    loadMintedBadges()
  }, [isMetaMaskAvailable, walletAddress])

  const handleMintBadge = (badgeType: string) => {
    setMintedBadges((prev) => {
      if (prev.includes(badgeType)) return prev
      return [...prev, badgeType]
    })
    setNftCount((prev) => prev + 1)
  }

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
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
            <p className="text-sm">Total NFTs Minted: {nftCount}</p>
          </div>
        </div>

        {!isMetaMaskAvailable && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              MetaMask is not installed or not connected. Some features like NFT minting will not be available.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-8">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ) : userData ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ScoreOverview score={score} />
              </div>
              <div className="lg:col-span-2">
                <MintNFT
                  score={score}
                  walletAddress={walletAddress}
                  onMint={handleMintBadge}
                  mintedBadges={mintedBadges}
                  isLoading={loadingNFTs}
                />
              </div>
            </div>

            {polkadotMetrics && <PolkadotScoreDetails metrics={polkadotMetrics} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MintingGuide />
              {isMetaMaskAvailable && <UserNFTs />}
            </div>

            {isMetaMaskAvailable && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ContractTest />
                <ContractDebug />
              </div>
            )}

            <Tabs defaultValue="staking" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="staking">Staking</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
                <TabsTrigger value="governance">Governance</TabsTrigger>
              </TabsList>
              <TabsContent value="staking" className="pt-6">
                <StakingGrid userData={userData} />
              </TabsContent>
              <TabsContent value="transfers" className="pt-6">
                <TransferGrid userData={userData} />
              </TabsContent>
              <TabsContent value="governance" className="pt-6">
                <GovernanceGrid userData={userData} />
              </TabsContent>
            </Tabs>

            <ScoreBreakdown userData={userData} />
            <ScoreRecommendations userData={userData} />
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
