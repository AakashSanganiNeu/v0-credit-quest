"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchUserNFTs } from "@/lib/nft-service"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NFT {
  tokenId: number
  tokenUri: string
}

export function UserNFTs() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadNFTs() {
      setLoading(true)
      setError(null)

      try {
        const userNFTs = await fetchUserNFTs()
        setNfts(userNFTs)
      } catch (err: any) {
        console.error("Error loading NFTs:", err)
        setError(err.message || "Failed to load NFTs")
      } finally {
        setLoading(false)
      }
    }

    loadNFTs()
  }, [])

  // Function to determine badge type from URI
  const getBadgeType = (uri: string) => {
    if (uri.includes("bronze")) return { name: "Bronze", color: "bg-amber-700 text-white" }
    if (uri.includes("silver")) return { name: "Silver", color: "bg-gray-400 text-white" }
    if (uri.includes("gold")) return { name: "Gold", color: "bg-yellow-500 text-white" }
    return { name: "Unknown", color: "bg-gray-500 text-white" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your NFT Badges</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You don't have any NFT badges yet.</p>
            <p className="text-sm mt-2">Mint a badge to see it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nfts.map((nft) => {
              const badgeType = getBadgeType(nft.tokenUri)
              return (
                <div key={nft.tokenId} className="p-4 border rounded-lg flex items-center gap-4">
                  <div className="size-12 rounded-full flex items-center justify-center text-2xl bg-muted">
                    {badgeType.name === "Bronze" && "🥉"}
                    {badgeType.name === "Silver" && "🥈"}
                    {badgeType.name === "Gold" && "🥇"}
                    {badgeType.name === "Unknown" && "🏅"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center gap-2">
                      Badge #{nft.tokenId}
                      <Badge className={badgeType.color}>{badgeType.name}</Badge>
                    </h3>
                    <div className="flex items-center mt-1">
                      <a
                        href={`https://moonbase.moonscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${nft.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center"
                      >
                        View on Explorer <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
