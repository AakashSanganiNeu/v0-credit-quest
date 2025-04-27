import type { UserData } from "@/types/user-data"

// Helper function to get a random number between min and max
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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

// Update the fetchUserData function to generate a random score between 300 and 850
export async function fetchUserData(address: string): Promise<UserData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate a random score between 300 and 850
  const randomScore = getRandomNumber(300, 850)

  // Randomize staking amount between 300-450
  const randomStakingAmount = getRandomNumber(300, 450)

  // Adjust user data to match the random score
  // We'll create data that would roughly produce this score when calculated
  if (randomScore > 700) {
    // Gold tier (700+ score)
    return {
      staking: {
        amountStaked: randomStakingAmount,
        stakingDuration: 180,
        validatorsNominated: 8,
      },
      transfers: {
        frequency: 32,
        volume: 750,
        uniqueRecipients: 15,
      },
      governance: {
        votesCast: 7,
        proposalsCreated: 1,
        delegationActivity: true,
      },
      nftBadges: {
        badgesOwned: 3,
        rareBadges: 1,
        badgeAge: 90,
      },
    }
  } else if (randomScore > 500) {
    // Silver tier (500-700 score)
    return {
      staking: {
        amountStaked: randomStakingAmount,
        stakingDuration: 45,
        validatorsNominated: 2,
      },
      transfers: {
        frequency: 10,
        volume: 200,
        uniqueRecipients: 5,
      },
      governance: {
        votesCast: 1,
        proposalsCreated: 0,
        delegationActivity: false,
      },
      nftBadges: {
        badgesOwned: 1,
        rareBadges: 0,
        badgeAge: 15,
      },
    }
  } else {
    // Bronze tier (300-500 score)
    return {
      staking: {
        amountStaked: randomStakingAmount,
        stakingDuration: 15,
        validatorsNominated: 1,
      },
      transfers: {
        frequency: 5,
        volume: 100,
        uniqueRecipients: 3,
      },
      governance: {
        votesCast: 0,
        proposalsCreated: 0,
        delegationActivity: false,
      },
      nftBadges: {
        badgesOwned: 0,
        rareBadges: 0,
        badgeAge: 0,
      },
    }
  }
}
