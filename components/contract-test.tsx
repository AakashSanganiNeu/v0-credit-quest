"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"

export function ContractTest() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testContractCall = async () => {
    setTesting(true)
    setError(null)
    setResult(null)

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed")
      }

      // Import ethers dynamically to avoid SSR issues
      const { ethers } = await import("ethers")

      // Get the contract address from environment variable
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xbfba3bca253b48b3f3f79fc1446ff3049082869b"

      // Create a provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      // Get the network
      const network = await provider.getNetwork()

      // Check if the contract exists
      const code = await provider.getCode(contractAddress)
      if (code === "0x") {
        throw new Error(
          `No contract found at address ${contractAddress} on network ${network.name} (${network.chainId})`,
        )
      }

      // Create a simple contract interface with just the functions we want to test
      const contractInterface = new ethers.utils.Interface([
        "function name() view returns (string)",
        "function tokenCount() view returns (uint256)",
      ])

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, contractInterface, provider)

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
