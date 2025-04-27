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
      const ethersModule = await import("ethers")

      // Log available properties for debugging
      const ethersInfo = {
        version: ethersModule.version || "unknown",
        hasProviders: !!ethersModule.providers,
        hasEthers: !!ethersModule.ethers,
        hasBrowserProvider: !!ethersModule.BrowserProvider,
        hasContract: !!ethersModule.Contract,
      }

      if (ethersModule.ethers) {
        ethersInfo.ethersHasProviders = !!ethersModule.ethers.providers
        ethersInfo.ethersHasContract = !!ethersModule.ethers.Contract
      }

      setDebugInfo(`Ethers info: ${JSON.stringify(ethersInfo, null, 2)}`)
      console.log("Ethers info:", ethersInfo)

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
      console.log("Provider initialized successfully")

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

      // Create a simple contract interface with just the functions we want to test
      let contractInterface
      try {
        if (ethersModule.utils && ethersModule.utils.Interface) {
          contractInterface = new ethersModule.utils.Interface([
            "function name() view returns (string)",
            "function tokenCount() view returns (uint256)",
          ])
          console.log("Using ethers.utils.Interface")
        } else if (ethersModule.ethers && ethersModule.ethers.utils && ethersModule.ethers.utils.Interface) {
          contractInterface = new ethersModule.ethers.utils.Interface([
            "function name() view returns (string)",
            "function tokenCount() view returns (uint256)",
          ])
          console.log("Using ethers.ethers.utils.Interface")
        } else if (ethersModule.Interface) {
          contractInterface = new ethersModule.Interface([
            "function name() view returns (string)",
            "function tokenCount() view returns (uint256)",
          ])
          console.log("Using ethers.Interface")
        } else {
          throw new Error("Could not find Interface constructor in ethers.js")
        }
      } catch (error) {
        console.error("Error creating interface:", error)
        throw new Error(`Failed to create contract interface: ${error.message}`)
      }

      // Create contract instance
      let contract
      try {
        if (ethersModule.Contract) {
          contract = new ethersModule.Contract(CONTRACT_ADDRESS, contractInterface, provider)
          console.log("Using ethers.Contract")
        } else if (ethersModule.ethers && ethersModule.ethers.Contract) {
          contract = new ethersModule.ethers.Contract(CONTRACT_ADDRESS, contractInterface, provider)
          console.log("Using ethers.ethers.Contract")
        } else {
          throw new Error("Could not find Contract constructor in ethers.js")
        }
      } catch (error) {
        console.error("Error creating contract:", error)
        throw new Error(`Failed to create contract instance: ${error.message}`)
      }

      // Log available contract methods for debugging
      console.log("Contract methods:", Object.keys(contract.functions || {}))

      // Test calling name()
      let name
      try {
        name = await contract.name()
        console.log("Contract name:", name)
      } catch (error) {
        console.error("Error calling name():", error)
        name = "Error: " + error.message
      }

      // Test calling tokenCount()
      let tokenCount
      try {
        tokenCount = await contract.tokenCount()
        console.log("Token count:", tokenCount.toString())
      } catch (error) {
        console.error("Error calling tokenCount():", error)
        tokenCount = "Error: " + error.message
      }

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
