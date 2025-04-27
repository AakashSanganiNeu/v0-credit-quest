"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isContractOwner, getNFTCount } from "@/lib/nft-service"
import { AlertTriangle, Info } from "lucide-react"

export function ContractDebug() {
  const [isOwner, setIsOwner] = useState<boolean | null>(null)
  const [contractAddress, setContractAddress] = useState<string>("")
  const [userAddress, setUserAddress] = useState<string>("")
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nftCount, setNftCount] = useState<number | null>(null)
  const [contractInfo, setContractInfo] = useState<any>(null)

  useEffect(() => {
    setContractAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "Not set")
  }, [])

  const checkOwnership = async () => {
    setChecking(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      // Get user address
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      setUserAddress(accounts[0])

      // Check if user is contract owner
      const owner = await isContractOwner()
      setIsOwner(owner)

      // Get NFT count
      try {
        const count = await getNFTCount()
        setNftCount(count)
      } catch (countError) {
        console.error("Error getting NFT count:", countError)
      }

      // Get contract info
      try {
        const { ethers } = await import("ethers")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(
          contractAddress,
          [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function balanceOf(address) view returns (uint256)",
            "function tokenCount() view returns (uint256)",
          ],
          provider,
        )

        const info = {
          name: "Unknown",
          symbol: "Unknown",
          balance: 0,
          tokenCount: 0,
        }

        try {
          info.name = await contract.name()
        } catch (e) {
          console.log("Error getting contract name:", e)
        }

        try {
          info.symbol = await contract.symbol()
        } catch (e) {
          console.log("Error getting contract symbol:", e)
        }

        try {
          const balance = await contract.balanceOf(accounts[0])
          info.balance = Number(balance)
        } catch (e) {
          console.log("Error getting balance:", e)
        }

        try {
          const tokenCount = await contract.tokenCount()
          info.tokenCount = Number(tokenCount)
        } catch (e) {
          console.log("Error getting token count:", e)
        }

        setContractInfo(info)
      } catch (infoError) {
        console.error("Error getting contract info:", infoError)
      }
    } catch (err: any) {
      console.error("Error checking contract ownership:", err)
      setError(err.message || "Failed to check contract ownership")
    } finally {
      setChecking(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Contract Information</h3>
            <p className="text-sm mb-1">
              <span className="font-medium">Contract Address:</span> {contractAddress}
            </p>
            {userAddress && (
              <p className="text-sm">
                <span className="font-medium">Your Address:</span> {userAddress}
              </p>
            )}
            {nftCount !== null && (
              <p className="text-sm mt-1">
                <span className="font-medium">NFT Count:</span> {nftCount}
              </p>
            )}
            {contractInfo && (
              <>
                <p className="text-sm mt-1">
                  <span className="font-medium">Contract Name:</span> {contractInfo.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Symbol:</span> {contractInfo.symbol}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Your Balance:</span> {contractInfo.balance}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Token Count:</span> {contractInfo.tokenCount}
                </p>
              </>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isOwner !== null && (
            <Alert className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isOwner
                  ? "You are the contract owner."
                  : "You are not the contract owner, but anyone can mint badges with this contract."}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={checkOwnership} disabled={checking} className="w-full">
            {checking ? "Checking..." : "Check Contract Information"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
