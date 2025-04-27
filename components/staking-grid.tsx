"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins } from "lucide-react"
import type { UserData } from "@/types/user-data"

interface StakingGridProps {
  userData: UserData
}

export function StakingGrid({ userData }: StakingGridProps) {
  // Sample validator data
  const validators = [
    {
      name: "Validator #1",
      identity: "PolkaGuard",
      commission: "3%",
      amount: userData.staking.amountStaked * 0.3,
    },
    {
      name: "Validator #2",
      identity: "StakeDAO",
      commission: "2.5%",
      amount: userData.staking.amountStaked * 0.25,
    },
    {
      name: "Validator #3",
      identity: "DotStake",
      commission: "4%",
      amount: userData.staking.amountStaked * 0.2,
    },
    {
      name: "Validator #4",
      identity: "ValidatorOne",
      commission: "3.5%",
      amount: userData.staking.amountStaked * 0.15,
    },
    {
      name: "Validator #5",
      identity: "StakeCapital",
      commission: "2%",
      amount: userData.staking.amountStaked * 0.1,
    },
  ]

  // Calculate APY based on staking amount
  const calculateAPY = () => {
    const baseAPY = 12
    const bonusForAmount = Math.min(userData.staking.amountStaked / 100, 3)
    const bonusForDuration = Math.min(userData.staking.stakingDuration / 30, 2)
    return (baseAPY + bonusForAmount + bonusForDuration).toFixed(2)
  }

  // Calculate estimated rewards
  const estimatedRewards = () => {
    const apy = Number.parseFloat(calculateAPY())
    return ((userData.staking.amountStaked * apy) / 100).toFixed(2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staking Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Amount Staked</div>
              <div className="text-2xl font-bold">{userData.staking.amountStaked} DOT</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Duration</div>
              <div className="text-2xl font-bold">{userData.staking.stakingDuration} days</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Validators</div>
              <div className="text-2xl font-bold">{userData.staking.validatorsNominated}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Est. APY</div>
              <div className="text-2xl font-bold">{calculateAPY()}%</div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-12 p-3 border-b bg-muted/50 text-sm font-medium">
              <div className="col-span-4">Validator</div>
              <div className="col-span-3">Identity</div>
              <div className="col-span-2">Commission</div>
              <div className="col-span-3">Amount</div>
            </div>
            <div className="divide-y">
              {userData.staking.validatorsNominated > 0 ? (
                validators.slice(0, userData.staking.validatorsNominated).map((validator, index) => (
                  <div key={index} className="grid grid-cols-12 p-3 text-sm items-center">
                    <div className="col-span-4 font-medium">{validator.name}</div>
                    <div className="col-span-3 text-muted-foreground">{validator.identity}</div>
                    <div className="col-span-2">{validator.commission}</div>
                    <div className="col-span-3 font-medium">{validator.amount.toFixed(2)} DOT</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Coins className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active staking</p>
                  <p className="text-xs mt-1">Staking your DOT will significantly improve your PolkaScore</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
              <div className="text-sm font-medium mb-1">Estimated Annual Rewards</div>
              <div className="text-xl font-bold">{estimatedRewards()} DOT</div>
              <div className="text-xs text-muted-foreground mt-1">Based on current APY</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
              <div className="text-sm font-medium mb-1">Score Impact</div>
              <div className="text-xl font-bold">+{Math.round(userData.staking.amountStaked / 10)} points</div>
              <div className="text-xs text-muted-foreground mt-1">Staking has 5x weight in score</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            Staking activity contributes 5x to your PolkaScore calculation
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
