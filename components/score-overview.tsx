"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, TrendingUp, AlertTriangle } from "lucide-react"

interface ScoreOverviewProps {
  score: number
}

export function ScoreOverview({ score }: ScoreOverviewProps) {
  // Determine score category
  const getScoreCategory = () => {
    if (score >= 700) return { label: "Excellent", color: "bg-green-500" }
    if (score >= 600) return { label: "Good", color: "bg-blue-500" }
    if (score >= 500) return { label: "Fair", color: "bg-yellow-500" }
    if (score >= 400) return { label: "Poor", color: "bg-orange-500" }
    return { label: "Very Poor", color: "bg-red-500" }
  }

  const category = getScoreCategory()
  const percentageScore = (score / 850) * 100

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#E6007A]/10 to-[#6D3AEE]/10 pb-8">
        <CardTitle className="text-2xl flex items-center justify-between">
          <span>Your PolkaScore</span>
          <Badge className={`${category.color} text-white`}>{category.label}</Badge>
        </CardTitle>
        <CardDescription>Based on your Polkadot blockchain activity</CardDescription>
      </CardHeader>
      <CardContent className="-mt-8">
        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="score">Score Overview</TabsTrigger>
            <TabsTrigger value="history">Score History</TabsTrigger>
          </TabsList>
          <TabsContent value="score" className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E6007A]/20 to-[#6D3AEE]/20"></div>
                <div className="absolute inset-2 rounded-full bg-card"></div>
                <div className="relative text-center">
                  <div className="text-6xl font-bold">{score}</div>
                  <div className="text-sm text-muted-foreground">out of 850</div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score Range</span>
                    <span>0-850</span>
                  </div>
                  <Progress value={percentageScore} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <Award className="h-5 w-5 text-[#E6007A]" />
                    <div className="text-sm">Top 25% of users</div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="h-5 w-5 text-[#6D3AEE]" />
                    <div className="text-sm">+15 points this month</div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div className="text-sm">2 improvement areas</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="history" className="pt-6">
            <div className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Score history will be available after 30 days of tracking</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
