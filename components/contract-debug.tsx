"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isContractOwner, getNFTCount, getContractDetails } from "@/lib/nft-service"
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"

// Hardcoded contract address
const CONTRACT_ADDRESS = "0xbfba3bca253b48b3f3f79fc1446ff3049082869b"

export function ContractDebug() {
  const [isOwner, setIsOwner] = useState<boolean | null>(null)
  const [contractAddress, setContractAddress] = useState<string>(CONTRACT_ADDRESS)
  const [userAddress, setUserAddress] = useState<string>("")
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nftCount, setNftCount] = useState<number | null>(null)
  const [contractInfo, setContractInfo] = useState<any>(null)
  const [contractDetails, setContractDetails] = useState<any>(null)

  useEffect(() => {
    setContractAddress(CONTRACT_ADDRESS)
  }, [])

  const checkOwnership = async () => {
    setChecking(true)
    setError(null)

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      // Get user address
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      setUserAddress(accounts[0])

      // Get contract details
      const details = await getContractDetails()
      setContractDetails(details)

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

      // Get contract info using our helper functions from nft-service.ts
      try {
        // Import ethers dynamically to avoid SSR issues
        const ethersModule = await import("ethers")

        // Helper function to safely get ethers provider (simplified version)
        async function getProvider() {
          if (ethersModule.providers && ethersModule.providers.Web3Provider) {
            return new ethersModule.providers.Web3Provider(window.ethereum)
          } else if (
            ethersModule.ethers &&
            ethersModule.ethers.providers &&
            ethersModule.ethers.providers.Web3Provider
          ) {
            return new ethersModule.ethers.providers.Web3Provider(window.ethereum)
          } else if (ethersModule.BrowserProvider) {
            return new ethersModule.BrowserProvider(window.ethereum)
          } else {
            throw new Error("Could not find a compatible Web3Provider in ethers.js")
          }
        }

        // Helper function to create contract instance (simplified version)
        async function createContract(provider: any, abi: any) {
          const signer = provider.getSigner ? await provider.getSigner() : provider

          if (ethersModule.Contract) {
            return new ethersModule.Contract(contractAddress, abi, signer)
          } else if (ethersModule.ethers && ethersModule.ethers.Contract) {
            return new ethersModule.ethers.Contract(contractAddress, abi, signer)
          } else {
            throw new Error("Could not find Contract constructor in ethers.js")
          }
        }

        const provider = await getProvider()
        const contract = await createContract(provider, [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function balanceOf(address) view returns (uint256)",
          "function tokenCount() view returns (uint256)",
        ])

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
      } catch (infoError: any) {
        console.error("Error getting contract info:", infoError)
        setError(`Error getting contract info: ${infoError.message || "Unknown error"}`)
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

          {contractDetails && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Network Details</h3>
              <p className="text-sm">
                <span className="font-medium">Network:</span> {contractDetails.network.name || "Unknown"} (Chain ID:{" "}
                {contractDetails.network.chainId})
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium">Contract Deployed:</span>
                {contractDetails.hasCode ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
              {contractDetails.hasCode && (
                <p className="text-sm">
                  <span className="font-medium">Code Size:</span> {contractDetails.codeLength} bytes
                </p>
              )}
            </div>
          )}

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
