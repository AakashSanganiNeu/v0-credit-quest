import type { UserData } from "@/types/user-data"
import { getSimulatedPolkadotCreditScore } from "./polkadot-score-service"

// Calculate the overall score based on the formula:
// (5 × staking) + (2 × transfers) + (3 × governance_votes) + (10 × NFT_badges)
export function calculateScore(userData: UserData): number {
  const stakingScore = calculateComponentScore(userData.staking, 5, 100)
  const transfersScore = calculateComponentScore(userData.transfers, 2, 100)
  const governanceScore = calculateComponentScore(userData.governance, 3, 100)
  const nftScore = calculateComponentScore(userData.nftBadges, 10, 100)

  const totalScore = stakingScore * 5 + transfersScore * 2 + governanceScore * 3 + nftScore * 10

  // Cap the score at 850
  return Math.min(Math.round(totalScore), 850)
}

// Calculate a component score (0-100) based on the component data
export function calculateComponentScore(componentData: any, weight: number, maxScore: number): number {
  // This is a simplified scoring algorithm
  // In a real application, this would be more sophisticated

  if (componentData.hasOwnProperty("amountStaked")) {
    // Staking component
    const amountScore = Math.min(componentData.amountStaked / 1000, 0.5) * 100
    const durationScore = Math.min(componentData.stakingDuration / 365, 0.3) * 100
    const validatorsScore = Math.min(componentData.validatorsNominated / 16, 0.2) * 100

    return Math.round(amountScore + durationScore + validatorsScore)
  }

  if (componentData.hasOwnProperty("frequency")) {
    // Transfers component
    const frequencyScore = Math.min(componentData.frequency / 50, 0.4) * 100
    const volumeScore = Math.min(componentData.volume / 1000, 0.4) * 100
    const recipientsScore = Math.min(componentData.uniqueRecipients / 20, 0.2) * 100

    return Math.round(frequencyScore + volumeScore + recipientsScore)
  }

  if (componentData.hasOwnProperty("votesCast")) {
    // Governance component
    const votesScore = Math.min(componentData.votesCast / 10, 0.6) * 100
    const proposalsScore = Math.min(componentData.proposalsCreated, 0.3) * 100
    const delegationScore = componentData.delegationActivity ? 10 : 0

    return Math.round(votesScore + proposalsScore + delegationScore)
  }

  if (componentData.hasOwnProperty("badgesOwned")) {
    // NFT badges component
    const badgesScore = Math.min(componentData.badgesOwned / 5, 0.5) * 100
    const rareScore = Math.min(componentData.rareBadges / 2, 0.4) * 100
    const ageScore = Math.min(componentData.badgeAge / 180, 0.1) * 100

    return Math.round(badgesScore + rareScore + ageScore)
  }

  return 0
}

// Update the fetchUserData function to use the Polkadot credit score
export async function fetchUserData(address: string): Promise<UserData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // Get the Polkadot credit score
    const { score, metrics } = await getSimulatedPolkadotCreditScore(address)

    // Extract staking data from the metrics
    const polkadotMetrics = metrics.find((m) => m.chain === "Polkadot") || metrics[0]

    // Convert plancks to DOT (1 DOT = 10^10 plancks)
    const amountStaked = Number.parseInt(polkadotMetrics.activeStake) / 10000000000

    // Generate user data based on the score
    const scoreRatio = (score - 350) / 500 // 0-1 range based on score 350-850

    return {
      staking: {
        amountStaked: Math.round(amountStaked * 10) / 10, // Round to 1 decimal place
        stakingDuration: Math.round(scoreRatio * 365), // 0-365 days
        validatorsNominated: polkadotMetrics.nominations || Math.round(scoreRatio * 16), // 0-16 validators
      },
      transfers: {
        frequency: Math.round(scoreRatio * 50), // 0-50 transfers
        volume: Math.round(scoreRatio * 1000), // 0-1000 DOT
        uniqueRecipients: Math.round(scoreRatio * 20), // 0-20 recipients
      },
      governance: {
        votesCast: polkadotMetrics.democracyVotes || Math.round(scoreRatio * 10), // 0-10 votes
        proposalsCreated: Math.round(scoreRatio * 2), // 0-2 proposals
        delegationActivity: scoreRatio > 0.5, // Active if score > 600
      },
      nftBadges: {
        badgesOwned: Math.round(scoreRatio * 5), // 0-5 badges
        rareBadges: Math.round(scoreRatio * 2), // 0-2 rare badges
        badgeAge: Math.round(scoreRatio * 180), // 0-180 days
      },
    }
  } catch (error) {
    console.error("Error fetching Polkadot credit score:", error)

    // Fallback to default data if there's an error
    return {
      staking: {
        amountStaked: 250,
        stakingDuration: 120,
        validatorsNominated: 5,
      },
      transfers: {
        frequency: 15,
        volume: 350,
        uniqueRecipients: 8,
      },
      governance: {
        votesCast: 4,
        proposalsCreated: 0,
        delegationActivity: false,
      },
      nftBadges: {
        badgesOwned: 2,
        rareBadges: 1,
        badgeAge: 60,
      },
    }
  }
}
