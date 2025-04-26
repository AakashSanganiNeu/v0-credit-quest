"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import type { UserData } from "@/types/user-data"
import { calculateComponentScore } from "@/lib/score-calculator"
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ScoreBreakdownProps {
  userData: UserData
}

export function ScoreBreakdown({ userData }: ScoreBreakdownProps) {
  const stakingScore = calculateComponentScore(userData.staking, 5, 100)
  const transfersScore = calculateComponentScore(userData.transfers, 2, 100)
  const governanceScore = calculateComponentScore(userData.governance, 3, 100)
  const nftScore = calculateComponentScore(userData.nftBadges, 10, 100)

  const scoreComponents = [
    { name: "Staking", value: stakingScore, weight: 5, max: 100, color: "#E6007A" },
    { name: "Transfers", value: transfersScore, weight: 2, max: 100, color: "#6D3AEE" },
    { name: "Governance", value: governanceScore, weight: 3, max: 100, color: "#00B2FF" },
    { name: "NFT Badges", value: nftScore, weight: 10, max: 100, color: "#51CE7B" },
  ]

  // Sample data for charts
  const stakingHistory = [
    { month: "Jan", amount: 120 },
    { month: "Feb", amount: 150 },
    { month: "Mar", amount: 180 },
    { month: "Apr", amount: 220 },
    { month: "May", amount: 250 },
    { month: "Jun", amount: 280 },
  ]

  const transfersHistory = [
    { month: "Jan", count: 5 },
    { month: "Feb", count: 8 },
    { month: "Mar", count: 12 },
    { month: "Apr", count: 7 },
    { month: "May", count: 14 },
    { month: "Jun", count: 10 },
  ]

  const governanceHistory = [
    { month: "Jan", votes: 0 },
    { month: "Feb", votes: 1 },
    { month: "Mar", votes: 0 },
    { month: "Apr", votes: 2 },
    { month: "May", votes: 1 },
    { month: "Jun", votes: 3 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
        <CardDescription>Detailed analysis of the factors contributing to your score</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Score Components</h3>
            <div className="space-y-4">
              {scoreComponents.map((component) => (
                <div key={component.name} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: component.color }}></div>
                      <span>{component.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{component.value}</span>
                      <span className="text-muted-foreground">/{component.max}</span>
                    </div>
                  </div>
                  <Progress value={(component.value / component.max) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Weight: {component.weight}x • Contributes{" "}
                    {Math.round(((component.value * component.weight) / 850) * 100)}% to total score
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="staking">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="staking">Staking</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
              <TabsTrigger value="governance">Governance</TabsTrigger>
              <TabsTrigger value="nft">NFT Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="staking" className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Amount Staked</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.staking.amountStaked} DOT</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Staking Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.staking.stakingDuration} days</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Validators Nominated</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.staking.validatorsNominated}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[300px] pt-4">
                  <h4 className="text-sm font-medium mb-4">Staking History (6 Months)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stakingHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#E6007A" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transfers" className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.transfers.frequency}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Transfer Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.transfers.volume} DOT</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Unique Recipients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.transfers.uniqueRecipients}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[300px] pt-4">
                  <h4 className="text-sm font-medium mb-4">Transfer Activity (6 Months)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transfersHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6D3AEE" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="governance" className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.governance.votesCast}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Proposals Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.governance.proposalsCreated}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Delegation Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {userData.governance.delegationActivity ? "Active" : "None"}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-[300px] pt-4">
                  <h4 className="text-sm font-medium mb-4">Governance Participation (6 Months)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={governanceHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#00B2FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nft" className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">NFT Badges Owned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.nftBadges.badgesOwned}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Rare Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.nftBadges.rareBadges}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Badge Age (Avg)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{userData.nftBadges.badgeAge} days</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {[1, 2, 3, 4].map((badge) => (
                    <div key={badge} className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <div className="size-16 mx-auto rounded-full bg-gradient-to-br from-[#E6007A]/30 to-[#6D3AEE]/30 flex items-center justify-center">
                          <div className="text-2xl">🏆</div>
                        </div>
                        <div className="mt-2 text-sm font-medium">Badge #{badge}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
