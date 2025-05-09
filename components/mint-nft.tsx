"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CircleDashed, Download, Check, Lock, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BADGE_TIERS } from "@/lib/constants"
import { mintNFTBadge } from "@/lib/nft-service"
import { Skeleton } from "@/components/ui/skeleton"

interface MintNFTProps {
  score: number
  walletAddress: string
  onMint: (badgeType: string) => void
  mintedBadges: string[]
  isLoading?: boolean
}

export function MintNFT({ score, walletAddress, onMint, mintedBadges = [], isLoading = false }: MintNFTProps) {
  const [minting, setMinting] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const nftRef = useRef<HTMLDivElement>(null)

  const badges = [BADGE_TIERS.BRONZE, BADGE_TIERS.SILVER, BADGE_TIERS.GOLD]

  // Determine which badges are available based on score
  const availableBadges = badges.filter((badge) => score >= badge.minScore)

  // Set the default selected badge based on the highest available tier
  useEffect(() => {
    if (availableBadges.length > 0) {
      // Find the highest tier badge that's available but not minted yet
      const unmintedBadges = availableBadges.filter((badge) => !mintedBadges.includes(badge.id))
      if (unmintedBadges.length > 0) {
        // Select the highest tier unminted badge
        setSelectedBadge(unmintedBadges[unmintedBadges.length - 1].id)
      } else {
        // If all available badges are minted, select the highest tier
        setSelectedBadge(availableBadges[availableBadges.length - 1].id)
      }
    } else {
      // Default to bronze if no badges are available
      setSelectedBadge("bronze")
    }
  }, [score, mintedBadges, availableBadges])

  const handleMint = async () => {
    if (!selectedBadge) return

    setMinting(true)
    setError(null)
    setTxHash(null)

    try {
      console.log(`Starting mint process for badge type: ${selectedBadge}`)

      // Call the NFT service to mint the badge
      const result = await mintNFTBadge(selectedBadge)

      if (result.success && result.txHash) {
        setTxHash(result.txHash)
        onMint(selectedBadge)
      } else {
        setError(result.error || "Failed to mint NFT")
      }
    } catch (err: any) {
      console.error("Error in handleMint:", err)
      setError(err.message || "An unexpected error occurred")
    } finally {
      setMinting(false)
    }
  }

  // Function to download NFT as image
  const downloadNFT = () => {
    if (!nftRef.current || !selectedBadge) return

    // We're using a simple approach to create an image from HTML
    const nftElement = nftRef.current

    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions
    canvas.width = nftElement.offsetWidth * 2 // Higher resolution
    canvas.height = nftElement.offsetHeight * 2

    if (ctx) {
      // Draw background
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set up text
      ctx.fillStyle = "#fff"
      ctx.font = "bold 40px sans-serif"
      ctx.textAlign = "center"

      // Draw title
      ctx.fillText("PolkaScore", canvas.width / 2, 60)

      // Draw score
      ctx.font = "bold 100px sans-serif"
      ctx.fillText(score.toString(), canvas.width / 2, canvas.height / 2)

      // Draw badge tier
      const currentBadge = badges.find((b) => b.id === selectedBadge) || badges[0]
      ctx.font = "bold 30px sans-serif"
      ctx.fillText(currentBadge.name + " Badge", canvas.width / 2, canvas.height / 2 + 60)

      // Draw wallet address
      ctx.font = "20px monospace"
      const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      ctx.fillText(shortAddress, canvas.width / 2, canvas.height - 80)

      // Draw date
      ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 40)

      // Convert to image and trigger download
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `polkascore-${score}-${currentBadge.name.toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    }
  }

  const selectedBadgeData = selectedBadge ? badges.find((b) => b.id === selectedBadge) : badges[0]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mint Your Score as NFT</CardTitle>
          <CardDescription>Create a permanent record of your PolkaScore on Moonbase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint Your Score as NFT</CardTitle>
        <CardDescription>Create a permanent record of your PolkaScore on Moonbase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Your Current Score</h3>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="text-right">
              <h3 className="font-medium">Available Badges</h3>
              <div className="flex gap-2 mt-1 justify-end">
                {score >= 300 && <span className="text-xl">🥉</span>}
                {score >= 500 && <span className="text-xl">🥈</span>}
                {score >= 700 && <span className="text-xl">🥇</span>}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {txHash && (
          <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
            <AlertDescription className="flex items-center justify-between">
              <span>NFT minted successfully!</span>
              <a
                href={`https://moonbase.moonscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm underline"
              >
                View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedBadge || "bronze"} onValueChange={setSelectedBadge} className="mb-6">
          <TabsList className="grid grid-cols-3">
            {badges.map((badge) => {
              const isMinted = mintedBadges.includes(badge.id)
              const isAvailable = score >= badge.minScore

              return (
                <TabsTrigger key={badge.id} value={badge.id} disabled={!isAvailable} className="relative">
                  {badge.name}
                  {isMinted && (
                    <span className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="size-3 text-white" />
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="absolute -top-1 -right-1 size-4 bg-gray-500 rounded-full flex items-center justify-center">
                      <Lock className="size-3 text-white" />
                    </span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {badges.map((badge) => {
            const isAvailable = score >= badge.minScore
            const isMinted = mintedBadges.includes(badge.id)

            return (
              <TabsContent key={badge.id} value={badge.id} className="pt-4">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div
                    ref={nftRef}
                    className={`relative aspect-square w-full max-w-[240px] rounded-lg ${badge.color} p-1`}
                  >
                    <div className="absolute inset-0 bg-card m-[3px] rounded-[6px]"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="text-sm font-medium text-muted-foreground mb-1">PolkaScore</div>
                      <div className="text-5xl font-bold mb-2">{score}</div>
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <Badge className={`${badge.color} ${badge.textColor} mb-4`}>{badge.name}</Badge>
                      <div className="text-xs text-muted-foreground">
                        Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{badge.name} Badge Benefits</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Permanent record of your {badge.name} tier achievement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Showcase your blockchain reputation to DeFi protocols</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Access to {badge.name}-tier benefits in partner protocols</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                          <span>Historical tracking of your score improvements</span>
                        </li>
                      </ul>
                    </div>

                    {!isAvailable && (
                      <div className="p-4 bg-muted/80 rounded-lg border border-dashed">
                        <h4 className="font-medium flex items-center gap-2">
                          <Lock className="size-4" />
                          Badge Locked
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You need a score of at least {badge.minScore} to mint this badge. You're{" "}
                          {badge.minScore - score} points away.
                        </p>
                      </div>
                    )}

                    {isMinted && (
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <h4 className="font-medium flex items-center gap-2 text-green-500">
                          <Check className="size-4" />
                          Badge Already Minted
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You've already minted this badge. You can view it in your NFT collection.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center md:justify-end gap-4">
        <Button variant="outline" onClick={downloadNFT}>
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </Button>
        <Button
          onClick={handleMint}
          disabled={
            minting ||
            !selectedBadge ||
            !selectedBadgeData ||
            score < (selectedBadgeData?.minScore || 0) ||
            mintedBadges.includes(selectedBadge)
          }
          className={`${selectedBadgeData?.color || ""} hover:opacity-90 transition-opacity`}
        >
          {minting ? (
            <>
              <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : mintedBadges.includes(selectedBadge || "") ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Already Minted
            </>
          ) : (
            `Mint ${selectedBadgeData?.name || ""} Badge`
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
