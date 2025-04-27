// Moonbase Alpha TestNet
export const MOONBASE_NETWORK = {
  chainId: "0x507", // 1287 in hexadecimal
  chainName: "Moonbase Alpha",
  nativeCurrency: {
    name: "DEV",
    symbol: "DEV",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.api.moonbase.moonbeam.network"],
  blockExplorerUrls: ["https://moonbase.moonscan.io/"],
}

// Badge tiers
export const BADGE_TIERS = {
  BRONZE: {
    id: "bronze",
    name: "Bronze",
    minScore: 300,
    maxScore: 500,
    color: "bg-amber-700",
    textColor: "text-white",
    icon: "🥉",
  },
  SILVER: {
    id: "silver",
    name: "Silver",
    minScore: 500,
    maxScore: 700,
    color: "bg-gray-400",
    textColor: "text-white",
    icon: "🥈",
  },
  GOLD: {
    id: "gold",
    name: "Gold",
    minScore: 700,
    maxScore: 1000,
    color: "bg-yellow-500",
    textColor: "text-white",
    icon: "🥇",
  },
}
