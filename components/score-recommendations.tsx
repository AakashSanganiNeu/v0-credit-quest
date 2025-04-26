import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserData } from "@/types/user-data"
import { TrendingUp, Award, Vote, Coins } from "lucide-react"

interface ScoreRecommendationsProps {
  userData: UserData
}

export function ScoreRecommendations({ userData }: ScoreRecommendationsProps) {
  // Generate recommendations based on user data
  const getRecommendations = () => {
    const recommendations = []

    if (userData.staking.amountStaked < 100) {
      recommendations.push({
        title: "Increase your staking amount",
        description: "Staking more DOT can significantly improve your score",
        icon: Coins,
        impact: "High",
      })
    }

    if (userData.governance.votesCast < 5) {
      recommendations.push({
        title: "Participate in governance",
        description: "Vote on more proposals to boost your governance score",
        icon: Vote,
        impact: "Medium",
      })
    }

    if (userData.transfers.frequency < 10) {
      recommendations.push({
        title: "Increase transfer activity",
        description: "Regular transfers show active participation in the network",
        icon: TrendingUp,
        impact: "Low",
      })
    }

    if (userData.nftBadges.badgesOwned < 2) {
      recommendations.push({
        title: "Collect more NFT badges",
        description: "NFT badges have a high weight in your score calculation",
        icon: Award,
        impact: "High",
      })
    }

    return recommendations
  }

  const recommendations = getRecommendations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <CardDescription>Ways to improve your PolkaScore based on your current activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <recommendation.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        recommendation.impact === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : recommendation.impact === "Medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {recommendation.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Award className="size-12 mx-auto text-primary opacity-50 mb-4" />
              <h3 className="text-lg font-medium">Great job!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You're already following best practices. Keep up the good work!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
