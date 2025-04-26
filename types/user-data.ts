export interface UserData {
  staking: {
    amountStaked: number
    stakingDuration: number
    validatorsNominated: number
  }
  transfers: {
    frequency: number
    volume: number
    uniqueRecipients: number
  }
  governance: {
    votesCast: number
    proposalsCreated: number
    delegationActivity: boolean
  }
  nftBadges: {
    badgesOwned: number
    rareBadges: number
    badgeAge: number
  }
}
