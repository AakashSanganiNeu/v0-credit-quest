"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertCircle, ExternalLink, ArrowRight } from "lucide-react"
import { MOONBASE_NETWORK } from "@/lib/constants"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function WalletConnect() {
  const router = useRouter()
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [networkName, setNetworkName] = useState("")

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined") {
      const isInstalled = !!window.ethereum && !!window.ethereum.isMetaMask
      setIsMetaMaskInstalled(isInstalled)

      // Check current network if MetaMask is installed
      if (isInstalled) {
        checkNetwork()
      }
    }
  }, [])

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      updateNetworkInfo(chainId)

      // Listen for chain changes
      window.ethereum.on("chainChanged", (chainId: string) => {
        updateNetworkInfo(chainId)
      })
    } catch (error) {
      console.error("Error checking network:", error)
    }
  }

  const updateNetworkInfo = (chainId: string) => {
    // Convert chainId to decimal if it's in hex
    const chainIdDecimal = Number.parseInt(chainId, 16)

    // Set network name based on chainId
    if (chainIdDecimal === 1287) {
      setNetworkName("Moonbase Alpha")
    } else if (chainIdDecimal === 1) {
      setNetworkName("Ethereum Mainnet")
    } else if (chainIdDecimal === 5) {
      setNetworkName("Goerli Testnet")
    } else if (chainIdDecimal === 11155111) {
      setNetworkName("Sepolia Testnet")
    } else if (chainIdDecimal === 137) {
      setNetworkName("Polygon")
    } else {
      setNetworkName(`Network (${chainIdDecimal})`)
    }
  }

  const switchToMoonbase = async () => {
    if (!window.ethereum) return false

    try {
      // Try to switch to Moonbase Alpha
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MOONBASE_NETWORK.chainId }],
      })
      return true
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: MOONBASE_NETWORK.chainId,
                chainName: MOONBASE_NETWORK.chainName,
                nativeCurrency: MOONBASE_NETWORK.nativeCurrency,
                rpcUrls: MOONBASE_NETWORK.rpcUrls,
                blockExplorerUrls: MOONBASE_NETWORK.blockExplorerUrls,
              },
            ],
          })
          return true
        } catch (addError) {
          console.error("Error adding Moonbase network:", addError)
          return false
        }
      }
      console.error("Error switching to Moonbase network:", switchError)
      return false
    }
  }

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // First, try to switch to Moonbase network
      const switched = await switchToMoonbase()
      if (!switched) {
        throw new Error("Failed to switch to Moonbase Alpha network. Please switch manually and try again.")
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock your MetaMask.")
      }

      const ethAddress = accounts[0]
      console.log("Connected with address:", ethAddress)

      // Redirect to dashboard with the actual address
      router.push(`/dashboard?address=${ethAddress}`)
    } catch (err: any) {
      console.error("Error connecting to MetaMask:", err)
      setError(err.message || "Failed to connect to MetaMask. Please try again.")
      setIsLoading(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation for address format
    if (!address || address.length < 10) {
      setError("Please enter a valid address")
      return
    }

    setIsLoading(true)
    setError("")

    // Redirect to dashboard with the manually entered address
    setTimeout(() => {
      router.push(`/dashboard?address=${address}`)
    }, 1000)
  }

  return (
    <section id="wallet-connect" className="py-20 container mx-auto px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription>Connect your wallet to calculate your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isMetaMaskInstalled && networkName && (
                <Alert variant="default" className="bg-muted">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Current network: {networkName}</span>
                    </div>
                    {networkName !== "Moonbase Alpha" && (
                      <Button variant="outline" size="sm" onClick={switchToMoonbase} className="h-7 text-xs">
                        Switch to Moonbase
                      </Button>
                    )}
                  </div>
                </Alert>
              )}

              <Button
                onClick={connectMetaMask}
                className="w-full bg-gradient-to-r from-[#E6007A] to-[#6D3AEE] hover:opacity-90 transition-opacity h-12"
                disabled={isLoading || !isMetaMaskInstalled}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Connect with MetaMask</span>
                  </div>
                )}
              </Button>

              {!isMetaMaskInstalled && (
                <div className="text-center">
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center justify-center gap-1"
                  >
                    Install MetaMask <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or enter address manually</span>
                </div>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your wallet address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-12 px-3 py-2 border rounded-md"
                />
                <Button type="submit" variant="outline" className="w-full h-12" disabled={isLoading}>
                  {isLoading ? "Connecting..." : "Connect Manually"}
                </Button>
              </form>
            </div>

            <div className="pt-4 border-t mt-4">
              <p className="text-sm font-medium mb-2">Demo Addresses</p>
              <div className="space-y-2">
                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Gold Tier</span>
                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">700+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs truncate">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e")
                      }}
                    >
                      <ArrowRight className="h-3 w-3" />
                      <span className="sr-only">Use this address</span>
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Silver Tier</span>
                    <span className="bg-gray-400 text-white text-xs px-2 py-0.5 rounded-full">500-700</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs truncate">0x8B3392483BA26D65E331dB86D4F430aE2f14C4B4</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setAddress("0x8B3392483BA26D65E331dB86D4F430aE2f14C4B4")
                      }}
                    >
                      <ArrowRight className="h-3 w-3" />
                      <span className="sr-only">Use this address</span>
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  <div className="font-medium text-xs mb-1 flex justify-between">
                    <span>Bronze Tier</span>
                    <span className="bg-amber-700 text-white text-xs px-2 py-0.5 rounded-full">300-500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs truncate">0x3F579F097F2CE8696Ae8C417582CfAFdE9Ec9966</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setAddress("0x3F579F097F2CE8696Ae8C417582CfAFdE9Ec9966")
                      }}
                    >
                      <ArrowRight className="h-3 w-3" />
                      <span className="sr-only">Use this address</span>
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use these demo addresses to test different score tiers
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Your wallet address is only used to fetch public blockchain data
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
