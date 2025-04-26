"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CircleDashed, Download, Check } from "lucide-react"

interface MintNFTProps {
  score: number
  walletAddress: string
}

export function MintNFT({ score, walletAddress }: MintNFTProps) {
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const nftRef = useRef<HTMLDivElement>(null)

  const handleMint = () => {
    setMinting(true)

    // Simulate minting process
    setTimeout(() => {
      setMinting(false)
      setMinted(true)
    }, 2000)
  }

  // Generate badge tier based on score
  const getBadgeTier = () => {
    if (score >= 700) return { name: "Diamond", color: "bg-blue-500" }
    if (score >= 600) return { name: "Platinum", color: "bg-slate-400" }
    if (score >= 500) return { name: "Gold", color: "bg-yellow-500" }
    if (score >= 400) return { name: "Silver", color: "bg-gray-400" }
    return { name: "Bronze", color: "bg-amber-700" }
  }

  const badgeTier = getBadgeTier()

  // Function to download NFT as image
  const downloadNFT = () => {
    if (!nftRef.current) return

    // We're using a simple approach to create an image from HTML
    // In a production app, you'd use a more robust solution like html2canvas
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
      ctx.font = "bold 30px sans-serif"
      ctx.fillText(badgeTier.name + " Tier", canvas.width / 2, canvas.height / 2 + 60)

      // Draw wallet address
      ctx.font = "20px monospace"
      const shortAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      ctx.fillText(shortAddress, canvas.width / 2, canvas.height - 80)

      // Draw date
      ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height - 40)

      // Convert to image and trigger download
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `polkascore-${score}-${badgeTier.name.toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint Your Score as NFT</CardTitle>
        <CardDescription>Create a permanent record of your PolkaScore on Asset Hub</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div
            ref={nftRef}
            className="relative aspect-square w-full max-w-[240px] rounded-lg bg-gradient-to-br from-[#E6007A] to-[#6D3AEE] p-1"
          >
            <div className="absolute inset-0 bg-card m-[3px] rounded-[6px]"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <div className="text-sm font-medium text-muted-foreground mb-1">PolkaScore</div>
              <div className="text-5xl font-bold mb-2">{score}</div>
              <Badge className={`${badgeTier.color} text-white mb-4`}>{badgeTier.name}</Badge>
              <div className="text-xs text-muted-foreground">
                Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">NFT Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Permanent record of your credit score on-chain</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Showcase your blockchain reputation to DeFi protocols</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Potential benefits from partner protocols and services</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Historical tracking of your score improvements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center md:justify-end gap-4">
        <Button variant="outline" onClick={downloadNFT}>
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </Button>
        <Button
          onClick={handleMint}
          disabled={minting || minted}
          className="bg-gradient-to-r from-[#E6007A] to-[#6D3AEE] hover:opacity-90 transition-opacity"
        >
          {minting ? (
            <>
              <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : minted ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Minted Successfully
            </>
          ) : (
            "Mint as NFT"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
