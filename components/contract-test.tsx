"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"

// Hardcoded contract address
const CONTRACT_ADDRESS = "0xbfba3bca253b48b3f3f79fc1446ff3049082869b"

// Simple ABI for testing
const TEST_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenCount() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function mintBadge(address, string) returns (uint256)",
]

export function ContractTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const testContractCall = async () => {
    setTesting(true)
    setError(null)
    setResult(null)
    setDebugInfo(null)

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      // Import ethers dynamically to avoid SSR issues
      const ethers = await import("ethers")

      // Log ethers version
      setDebugInfo(`Ethers version: ${ethers.version || "unknown"}`)
      console.log("Ethers version:", ethers.version)

      // Create provider
      let provider
      try {
        if (ethers.providers && ethers.providers.Web3Provider) {
          provider = new ethers.providers.Web3Provider(window.ethereum)
          console.log("Using ethers.providers.Web3Provider")
        } else if (ethers.ethers && ethers.ethers.providers && ethers.ethers.providers.Web3Provider) {
          provider = new ethers.ethers.providers.Web3Provider(window.ethereum)
          console.log("Using ethers.ethers.providers.Web3Provider")
        } else if (ethers.BrowserProvider) {
          provider = new ethers.BrowserProvider(window.ethereum)
          console.log("Using ethers.BrowserProvider")
        } else {
          throw new Error("Could not find a compatible Web3Provider in ethers.js")
        }
      } catch (e) {
        console.error("Error creating provider:", e)
        throw new Error(`Failed to create provider: ${e.message}`)
      }

      // Get the network
      const network = await provider.getNetwork()
      const networkName = network.name || network.chainName || `Chain ID: ${network.chainId}`
      console.log("Connected to network:", networkName)

      // Check if the contract exists
      const code = await provider.getCode(CONTRACT_ADDRESS)
      if (code === "0x") {
        throw new Error(
          `No contract found at address ${CONTRACT_ADDRESS} on network ${networkName} (${network.chainId})`,
        )
      }
      console.log("Contract exists at address:", CONTRACT_ADDRESS)

      // Create contract instance
      let contract
      try {
        // Get signer
        let signer
        try {
          if (provider.getSigner) {
            signer = await provider.getSigner()
            console.log("Got signer from provider")
          } else {
            signer = provider
            console.log("Using provider as signer")
          }
        } catch (e) {
          console.log("Error getting signer:", e)
          signer = provider
        }

        // Create contract
        if (ethers.Contract) {
          contract = new ethers.Contract(CONTRACT_ADDRESS, TEST_ABI, signer)
          console.log("Using ethers.Contract")
        } else if (ethers.ethers && ethers.ethers.Contract) {
          contract = new ethers.ethers.Contract(CONTRACT_ADDRESS, TEST_ABI, signer)
          console.log("Using ethers.ethers.Contract")
        } else {
          throw new Error("Could not find Contract constructor in ethers.js")
        }
      } catch (e) {
        console.error("Error creating contract:", e)
        throw new Error(`Failed to create contract: ${e.message}`)
      }

      // Log available contract methods for debugging
      console.log("Contract functions:", Object.keys(contract.functions || {}))

      // Test calling name()
      let name = "Unknown"
      try {
        name = await contract.name()
        console.log("Contract name:", name)
      } catch (e) {
        console.error("Error calling name():", e)
        name = "Error: " + e.message
      }

      // Test calling symbol()
      let symbol = "Unknown"
      try {
        symbol = await contract.symbol()
        console.log("Contract symbol:", symbol)
      } catch (e) {
        console.error("Error calling symbol():", e)
        symbol = "Error: " + e.message
      }

      // Test calling tokenCount()
      let tokenCount = "Unknown"
      try {
        const count = await contract.tokenCount()
        tokenCount = count.toString()
        console.log("Token count:", tokenCount)
      } catch (e) {
        console.error("Error calling tokenCount():", e)
        tokenCount = "Error: " + e.message
      }

      // Check if mintBadge exists
      const hasMintBadge = Object.keys(contract.functions || {}).includes("mintBadge")
      console.log("Has mintBadge function:", hasMintBadge)

      setResult(`Contract name: ${name}, Symbol: ${symbol}, Token count: ${tokenCount}, Has mintBadge: ${hasMintBadge}`)
    } catch (err: any) {
      console.error("Error testing contract:", err)
      setError(err.message || "Failed to test contract")
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Test basic contract calls before attempting to mint. This helps identify if there are issues with the
            contract connection.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
              <Info className="h-4 w-4" />
              <AlertDescription>{result}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <pre className="text-xs overflow-auto whitespace-pre-wrap">{debugInfo}</pre>
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={testContractCall} disabled={testing} className="w-full">
            {testing ? "Testing..." : "Test Contract Connection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
