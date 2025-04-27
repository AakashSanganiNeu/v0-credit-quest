"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"

// Hardcoded contract address
const CONTRACT_ADDRESS = "0xbfba3bca253b48b3f3f79fc1446ff3049082869b"

export function ContractTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testContractCall = async () => {
    setTesting(true)
    setError(null)
    setResult(null)

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      // Import ethers dynamically to avoid SSR issues
      const ethersModule = await import("ethers")

      // Helper function to safely get ethers provider
      async function getProvider() {
        try {
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
            console.error("Ethers structure:", JSON.stringify(Object.keys(ethersModule)))
            if (ethersModule.ethers) {
              console.error("Ethers.ethers structure:", JSON.stringify(Object.keys(ethersModule.ethers)))
            }
            throw new Error("Could not find a compatible Web3Provider in ethers.js")
          }
        } catch (error) {
          console.error("Error initializing ethers provider:", error)
          throw error
        }
      }

      // Get provider
      const provider = await getProvider()

      // Get the network
      const network = await provider.getNetwork()
      const networkName = network.name || network.chainName || `Chain ID: ${network.chainId}`

      // Check if the contract exists
      const code = await provider.getCode(CONTRACT_ADDRESS)
      if (code === "0x") {
        throw new Error(
          `No contract found at address ${CONTRACT_ADDRESS} on network ${networkName} (${network.chainId})`,
        )
      }

      // Create a simple contract interface with just the functions we want to test
      let contractInterface
      if (ethersModule.utils && ethersModule.utils.Interface) {
        contractInterface = new ethersModule.utils.Interface([
          "function name() view returns (string)",
          "function tokenCount() view returns (uint256)",
        ])
      } else if (ethersModule.ethers && ethersModule.ethers.utils && ethersModule.ethers.utils.Interface) {
        contractInterface = new ethersModule.ethers.utils.Interface([
          "function name() view returns (string)",
          "function tokenCount() view returns (uint256)",
        ])
      } else if (ethersModule.Interface) {
        contractInterface = new ethersModule.Interface([
          "function name() view returns (string)",
          "function tokenCount() view returns (uint256)",
        ])
      } else {
        throw new Error("Could not find Interface constructor in ethers.js")
      }

      // Create contract instance
      let contract
      if (ethersModule.Contract) {
        contract = new ethersModule.Contract(CONTRACT_ADDRESS, contractInterface, provider)
      } else if (ethersModule.ethers && ethersModule.ethers.Contract) {
        contract = new ethersModule.ethers.Contract(CONTRACT_ADDRESS, contractInterface, provider)
      } else {
        throw new Error("Could not find Contract constructor in ethers.js")
      }

      // Test calling name()
      const name = await contract.name()

      // Test calling tokenCount()
      const tokenCount = await contract.tokenCount()

      setResult(`Contract name: ${name}, Token count: ${tokenCount.toString()}`)
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

          <Button onClick={testContractCall} disabled={testing} className="w-full">
            {testing ? "Testing..." : "Test Contract Connection"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
