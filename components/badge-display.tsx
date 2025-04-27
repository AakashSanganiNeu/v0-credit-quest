"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BADGE_TIERS } from "@/lib/constants"

interface BadgeDisplayProps {
  score: number
  mintedBadges: string[]
}

export function BadgeDisplay({ score, mintedBadges = [] }: BadgeDisplayProps) {
  const badges = [BADGE_TIERS.BRONZE, BADGE_TIERS.SILVER, BADGE_TIERS.GOLD]

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium mb-4">Your Achievement Badges</h3>
          <div className="flex justify-center gap-6">
            {badges.map((badge) => {
              const isMinted = mintedBadges.includes(badge.id)
              const isAvailable = score >= badge.minScore

              return (
                <TooltipProvider key={badge.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            size-16 rounded-full flex items-center justify-center text-2xl
                            ${
                              isAvailable
                                ? isMinted
                                  ? `${badge.color} ${badge.textColor} ring-2 ring-offset-2 ring-offset-background ring-primary`
                                  : `${badge.color} ${badge.textColor} opacity-100`
                                : "bg-gray-200 text-gray-400 opacity-50"
                            }
                          `}
                        >
                          {badge.icon}
                        </div>
                        <span className={`mt-2 text-sm font-medium ${!isAvailable ? "text-muted-foreground" : ""}`}>
                          {badge.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{badge.minScore}+ points</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isAvailable
                        ? isMinted
                          ? `${badge.name} Badge Minted!`
                          : `${badge.name} Badge Available to Mint`
                        : `Requires ${badge.minScore}+ points`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
