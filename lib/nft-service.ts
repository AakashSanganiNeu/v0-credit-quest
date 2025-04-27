import contractABI from "./DeFiQuestNFT.json"

// Contract address from environment variable
const CONTRACT_ADDRESS =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x55c28Dd0C73bCB183abE5659f33420F9a0442C73"
    : "0x55c28Dd0C73bCB183abE5659f33420F9a0442C73"

// Badge metadata URIs (in a real app, these would be IPFS links)
const BADGE_URIS = {
  bronze: "https://ipfs.io/ipfs/QmXyZ123/bronze-badge.json",
  silver: "https://ipfs.io/ipfs/QmXyZ456/silver-badge.json",
  gold: "https://ipfs.io/ipfs/QmXyZ789/gold-badge.json",
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

export async function mintNFTBadge(badgeType: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!isBrowser || !window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    // Import ethers dynamically to avoid SSR issues
    const { ethers } = await import("ethers")

    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    if (accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const userAddress = accounts[0]

    // Create a provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Get the signer
    const signer = provider.getSigner()

    // Create contract instance
    const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)

    // Get the badge URI based on the badge type
    const badgeUri = BADGE_URIS[badgeType as keyof typeof BADGE_URIS]
    if (!badgeUri) {
      throw new Error("Invalid badge type")
    }

    // Call the mintBadge function
    console.log(`Minting ${badgeType} badge for ${userAddress} with URI ${badgeUri}`)
    const tx = await nftContract.mintBadge(userAddress, badgeUri, {
      gasLimit: 300000, // Explicitly set gas limit
    })

    console.log("Transaction sent:", tx.hash)

    // Wait for the transaction to be mined
    const receipt = await tx.wait()
    console.log("Transaction confirmed:", receipt)

    return {
      success: true,
      txHash: receipt.transactionHash,
    }
  } catch (error: any) {
    console.error("Error minting NFT:", error)
    return {
      success: false,
      error: error.message || "Failed to mint NFT",
    }
  }
}

export async function getNFTCount(): Promise<number> {
  try {
    if (!isBrowser || !window.ethereum) {
      return 0
    }

    // Import ethers dynamically to avoid SSR issues
    const { ethers } = await import("ethers")

    // Create a provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Create contract instance (read-only)
    const nftContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider)

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
    // Import ethers dynamically to avoid SSR issues
    const { ethers } = await import("ethers")

    // Connect to MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const userAddress = await signer.getAddress()

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider)

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
    // Import ethers dynamically to avoid SSR issues
    const { ethers } = await import("ethers")

    // Connect to MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const userAddress = await signer.getAddress()

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider)

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
