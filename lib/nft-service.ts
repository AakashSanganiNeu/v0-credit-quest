import contractABI from "./DeFiQuestNFT.json"

// Hardcoded contract address
const CONTRACT_ADDRESS = "0xbfba3bca253b48b3f3f79fc1446ff3049082869b"

// Badge metadata URIs (in a real app, these would be IPFS links)
const BADGE_URIS = {
  bronze: "https://ipfs.io/ipfs/QmXyZ123/bronze-badge.json",
  silver: "https://ipfs.io/ipfs/QmXyZ456/silver-badge.json",
  gold: "https://ipfs.io/ipfs/QmXyZ789/gold-badge.json",
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Simple ethers.js import - for Vercel compatibility
let ethers: any = null

// Helper function to safely get ethers provider
async function getEthersProvider() {
  if (!isBrowser || !window.ethereum) {
    throw new Error("MetaMask is not installed or not accessible")
  }

  try {
    // Import ethers only once and cache it
    if (!ethers) {
      ethers = await import("ethers")
      console.log("Ethers imported successfully")
    }

    // Create provider based on ethers version
    let provider

    // Try ethers v5 structure first (most common)
    try {
      if (ethers.providers && ethers.providers.Web3Provider) {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log("Using ethers v5 Web3Provider")
        return provider
      }
    } catch (e) {
      console.log("Failed to use ethers.providers.Web3Provider:", e)
    }

    // Try ethers v5 nested structure
    try {
      if (ethers.ethers && ethers.ethers.providers && ethers.ethers.providers.Web3Provider) {
        provider = new ethers.ethers.providers.Web3Provider(window.ethereum)
        console.log("Using nested ethers v5 Web3Provider")
        return provider
      }
    } catch (e) {
      console.log("Failed to use ethers.ethers.providers.Web3Provider:", e)
    }

    // Try ethers v6 structure
    try {
      if (ethers.BrowserProvider) {
        provider = new ethers.BrowserProvider(window.ethereum)
        console.log("Using ethers v6 BrowserProvider")
        return provider
      }
    } catch (e) {
      console.log("Failed to use ethers.BrowserProvider:", e)
    }

    throw new Error("Could not find a compatible Web3Provider in ethers.js")
  } catch (error) {
    console.error("Error initializing ethers provider:", error)
    throw error
  }
}

// Helper function to create contract instance
async function getContract(provider: any, contractAddress: string, abi: any) {
  if (!ethers) {
    ethers = await import("ethers")
  }

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

    // Create contract instance
    let contract

    // Try ethers v5 Contract
    try {
      if (ethers.Contract) {
        contract = new ethers.Contract(contractAddress, abi, signer)
        console.log("Created contract with ethers.Contract")
        return contract
      }
    } catch (e) {
      console.log("Failed to use ethers.Contract:", e)
    }

    // Try ethers v5 nested Contract
    try {
      if (ethers.ethers && ethers.ethers.Contract) {
        contract = new ethers.ethers.Contract(contractAddress, abi, signer)
        console.log("Created contract with ethers.ethers.Contract")
        return contract
      }
    } catch (e) {
      console.log("Failed to use ethers.ethers.Contract:", e)
    }

    throw new Error("Could not create contract instance")
  } catch (error) {
    console.error("Error creating contract instance:", error)
    throw error
  }
}

export async function mintNFTBadge(badgeType: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!isBrowser || !window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    console.log("Starting mintNFTBadge for badge type:", badgeType)

    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    if (accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const userAddress = accounts[0]
    console.log("User address:", userAddress)

    // Get provider using our helper function
    const provider = await getEthersProvider()
    console.log("Provider initialized successfully")

    // Get the network to verify we're on the right chain
    const network = await provider.getNetwork()
    console.log("Connected to network:", network)

    // Verify the contract exists on this network
    const code = await provider.getCode(CONTRACT_ADDRESS)
    if (code === "0x") {
      throw new Error(
        `No contract found at address ${CONTRACT_ADDRESS} on this network. Please check your network connection.`,
      )
    }
    console.log("Contract exists at address:", CONTRACT_ADDRESS)

    // Create contract instance using our helper function
    console.log("Creating contract instance with ABI:", contractABI.length, "items")
    const nftContract = await getContract(provider, CONTRACT_ADDRESS, contractABI)
    console.log("Contract instance created successfully")

    // Log available contract methods for debugging
    const contractFunctions = Object.keys(nftContract.functions || {})
    console.log("Contract functions:", contractFunctions)

    // Check if mintBadge exists
    if (!contractFunctions.includes("mintBadge")) {
      throw new Error("Contract does not have mintBadge function. Available functions: " + contractFunctions.join(", "))
    }

    // Get the badge URI based on the badge type
    const badgeUri = BADGE_URIS[badgeType as keyof typeof BADGE_URIS]
    if (!badgeUri) {
      throw new Error("Invalid badge type")
    }
    console.log("Badge URI:", badgeUri)

    // Try to get the token count to verify contract interaction works
    try {
      const tokenCount = await nftContract.tokenCount()
      console.log("Current token count:", tokenCount.toString())
    } catch (error) {
      console.warn("Could not get token count, but continuing:", error)
    }

    // Call the mintBadge function with more detailed error handling
    console.log(`Minting ${badgeType} badge for ${userAddress} with URI ${badgeUri}`)

    // Use a direct approach for calling the function
    const tx = await nftContract.mintBadge(userAddress, badgeUri, {
      gasLimit: 500000, // Increased gas limit
    })

    console.log("Transaction sent:", tx.hash)

    // Wait for the transaction to be mined
    const receipt = await tx.wait()
    console.log("Transaction confirmed:", receipt)

    return {
      success: true,
      txHash: receipt.transactionHash || tx.hash,
    }
  } catch (error: any) {
    console.error("Error minting NFT:", error)

    // Try to extract a more meaningful error message
    let errorMessage = "Failed to mint NFT"

    if (error.error?.message) {
      errorMessage = error.error.message
    } else if (error.message) {
      errorMessage = error.message
    } else if (typeof error === "string") {
      errorMessage = error
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function getNFTCount(): Promise<number> {
  try {
    if (!isBrowser || !window.ethereum) {
      return 0
    }

    // Get provider using our helper function
    const provider = await getEthersProvider()

    // Create contract instance using our helper function
    const nftContract = await getContract(provider, CONTRACT_ADDRESS, contractABI)

    // Try to get the token count - the updated contract has tokenCount
    try {
      const count = await nftContract.tokenCount()
      return Number(count)
    } catch (error) {
      console.log("tokenCount() failed, trying alternative methods...")

      try {
        // Try totalSupply() which is standard in some ERC721
        const supply = await nftContract.totalSupply()
        return Number(supply)
      } catch (error) {
        console.log("totalSupply() also failed, using estimation method...")

        // If both fail, we'll try to estimate by checking token IDs
        return await estimateTokenCount(nftContract)
      }
    }
  } catch (error) {
    console.error("Error getting NFT count:", error)
    return 0
  }
}

// Helper function to estimate token count by checking token IDs
async function estimateTokenCount(contract: any): Promise<number> {
  try {
    // We'll check token IDs in batches to find the highest valid ID
    const batchSize = 10
    let maxValidId = 0

    for (let i = 1; i <= 100; i += batchSize) {
      let validInBatch = false

      for (let j = 0; j < batchSize; j++) {
        const tokenId = i + j
        try {
          // Try to get the owner of this token ID
          await contract.ownerOf(tokenId)
          maxValidId = tokenId
          validInBatch = true
        } catch {
          // This token ID doesn't exist, continue
        }
      }

      // If no valid tokens in this batch, we've likely reached the end
      if (!validInBatch) {
        break
      }
    }

    return maxValidId
  } catch (error) {
    console.error("Error estimating token count:", error)
    return 0
  }
}

export async function fetchUserNFTs() {
  if (!isBrowser || !window.ethereum) {
    console.error("MetaMask is not installed!")
    return []
  }

  try {
    // Get provider using our helper function
    const provider = await getEthersProvider()

    // Request account access if needed
    await window.ethereum.request({ method: "eth_requestAccounts" })

    // Get signer and address
    let userAddress
    try {
      const signer = provider.getSigner ? await provider.getSigner() : provider
      userAddress = await signer.getAddress()
    } catch (e) {
      console.log("Error getting signer address:", e)
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      userAddress = accounts[0]
    }

    console.log("Fetching NFTs for address:", userAddress)

    // Create contract instance using our helper function
    const contract = await getContract(provider, CONTRACT_ADDRESS, contractABI)

    const userNFTs = []
    const maxTokensToCheck = 100 // Adjust based on your expected total NFTs minted

    // Try to get the token count using different methods
    let tokenCount = 0
    try {
      tokenCount = await getNFTCount()
      console.log("Token count from getNFTCount:", tokenCount)
    } catch (error) {
      console.error("Error getting token count:", error)
      // Default to checking a fixed number of tokens
      tokenCount = maxTokensToCheck
    }

    // If we couldn't determine the token count, use the max
    const tokensToCheck = tokenCount > 0 ? Math.min(tokenCount, maxTokensToCheck) : maxTokensToCheck

    // Loop through tokenIds 1 to tokensToCheck
    for (let tokenId = 1; tokenId <= tokensToCheck; tokenId++) {
      try {
        const owner = await contract.ownerOf(tokenId)

        if (owner.toLowerCase() === userAddress.toLowerCase()) {
          try {
            const tokenUri = await contract.tokenURI(tokenId)
            userNFTs.push({ tokenId, tokenUri })
          } catch (error) {
            console.log(`Error getting URI for token ${tokenId}:`, error)
            userNFTs.push({ tokenId, tokenUri: "Unknown URI" })
          }
        }
      } catch (error) {
        // ownerOf will throw if token does not exist — that's normal
        continue
      }
    }

    console.log(`Found ${userNFTs.length} NFTs for address ${userAddress}`)
    return userNFTs
  } catch (error) {
    console.error("Error fetching user NFTs:", error)
    return []
  }
}

export async function isContractOwner(): Promise<boolean> {
  if (!isBrowser || !window.ethereum) {
    return false
  }

  try {
    // Get provider using our helper function
    const provider = await getEthersProvider()

    // Get signer and address
    let userAddress
    try {
      const signer = provider.getSigner ? await provider.getSigner() : provider
      userAddress = await signer.getAddress()
    } catch (e) {
      console.log("Error getting signer address:", e)
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      userAddress = accounts[0]
    }

    // Create contract instance using our helper function
    const contract = await getContract(provider, CONTRACT_ADDRESS, contractABI)

    try {
      // Get the contract owner
      const owner = await contract.owner()
      return owner.toLowerCase() === userAddress.toLowerCase()
    } catch (error) {
      console.log("Error calling owner() function:", error)

      // Try alternative methods to check ownership
      try {
        // Some contracts use getOwner() instead
        const owner = await contract.getOwner()
        return owner.toLowerCase() === userAddress.toLowerCase()
      } catch {
        // If we can't determine ownership, assume false
        return false
      }
    }
  } catch (error) {
    console.error("Error checking contract owner:", error)
    return false
  }
}

// Add a function to check contract details
export async function getContractDetails() {
  if (!isBrowser || !window.ethereum) {
    return null
  }

  try {
    // Get provider using our helper function
    const provider = await getEthersProvider()

    // Get network information
    const network = await provider.getNetwork()

    // Get the code at the contract address
    const code = await provider.getCode(CONTRACT_ADDRESS)
    const hasCode = code !== "0x"

    return {
      address: CONTRACT_ADDRESS,
      network: {
        name: network.name || network.chainName || `Chain ID: ${network.chainId}`,
        chainId: network.chainId,
      },
      hasCode,
      codeLength: code.length,
    }
  } catch (error) {
    console.error("Error getting contract details:", error)
    return null
  }
}

// Add this function to determine which badge types a user has already minted
export async function getUserMintedBadgeTypes(): Promise<string[]> {
  try {
    if (!isBrowser || !window.ethereum) {
      return []
    }

    // Get the current wallet address
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    if (accounts.length === 0) {
      console.log("No accounts found when checking minted badges")
      return []
    }

    const currentAddress = accounts[0]
    console.log("Checking minted badges for address:", currentAddress)

    const userNFTs = await fetchUserNFTs()
    const mintedBadgeTypes: string[] = []

    // Determine badge type from token URI
    userNFTs.forEach((nft) => {
      const uri = nft.tokenUri.toLowerCase()
      if (uri.includes("bronze")) {
        mintedBadgeTypes.push("bronze")
      } else if (uri.includes("silver")) {
        mintedBadgeTypes.push("silver")
      } else if (uri.includes("gold")) {
        mintedBadgeTypes.push("gold")
      }
    })

    // Remove duplicates
    return [...new Set(mintedBadgeTypes)]
  } catch (error) {
    console.error("Error getting user minted badge types:", error)
    return []
  }
}
