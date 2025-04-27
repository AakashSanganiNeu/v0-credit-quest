"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CircleDashed, Download, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BADGE_TIERS } from "@/lib/constants"

interface MintNFTProps {
  score: number
  walletAddress: string
  onMint: (badgeType: string) => void
  mintedBadges: string[]
}

export function MintNFT({ score, walletAddress, onMint, mintedBadges = [] }: MintNFTProps) {
  const [minting, setMinting] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<string>("bronze")
  const nftRef = useRef<HTMLDivElement>(null)

  const badges = [BADGE_TIERS.BRONZE, BADGE_TIERS.SILVER, BADGE_TIERS.GOLD]

  // Determine which badges are available based on score
  const availableBadges = badges.filter((badge) => score >= badge.minScore)

  const handleMint = () => {
    setMinting(true)

    // Simulate minting process
    setTimeout(() => {
      setMinting(false)
      onMint(selectedBadge)
    }, 2000)
  }

  // Function to download NFT as image
  const downloadNFT = () => {
    if (!nftRef.current) return

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

  const selectedBadgeData = badges.find((b) => b.id === selectedBadge) || badges[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint Your Score as NFT</CardTitle>
        <CardDescription>Create a permanent record of your PolkaScore on Asset Hub</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={availableBadges.length > 0 ? availableBadges[0].id : "bronze"}
          onValueChange={setSelectedBadge}
          className="mb-6"
        >
          <TabsList className="grid grid-cols-3">
            {badges.map((badge) => (
              <TabsTrigger
                key={badge.id}
                value={badge.id}
                disabled={score < badge.minScore}
                className={mintedBadges.includes(badge.id) ? "relative" : ""}
              >
                {badge.name}
                {mintedBadges.includes(badge.id) && (
                  <span className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="size-3 text-white" />
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {badges.map((badge) => (
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
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center md:justify-end gap-4">
        <Button variant="outline" onClick={downloadNFT}>
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </Button>
        <Button
          onClick={handleMint}
          disabled={minting || score < selectedBadgeData.minScore || mintedBadges.includes(selectedBadge)}
          className={`${selectedBadgeData.color} hover:opacity-90 transition-opacity`}
        >
          {minting ? (
            <>
              <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : mintedBadges.includes(selectedBadge) ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Already Minted
            </>
          ) : (
            `Mint ${selectedBadgeData.name} Badge`
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
