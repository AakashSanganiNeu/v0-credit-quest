"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber } from "@/lib/utils"

interface PolkadotScoreDetailsProps {
  metrics: {
    chain: string
    activeStake: string
    nominations: number
    democracyVotes: number
    subScore: number
  }[]
}

export function PolkadotScoreDetails({ metrics }: PolkadotScoreDetailsProps) {
  // Calculate total score
  const totalScore = metrics.reduce((sum, metric) => sum + metric.subScore, 0)

  // Convert plancks to DOT for display
  const formatDOT = (plancks: string) => {
    const dot = Number.parseInt(plancks) / 10000000000
    return formatNumber(dot, 4)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Polkadot Credit Score Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={metrics[0].chain.toLowerCase()}>
          <TabsList className="grid w-full grid-cols-3">
            {metrics.map((metric) => (
              <TabsTrigger key={metric.chain} value={metric.chain.toLowerCase()}>
                {metric.chain}
              </TabsTrigger>
            ))}
          </TabsList>

          {metrics.map((metric) => (
            <TabsContent key={metric.chain} value={metric.chain.toLowerCase()} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Active Stake</div>
                  <div className="text-2xl font-bold">{formatDOT(metric.activeStake)} DOT</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Nominations</div>
                  <div className="text-2xl font-bold">{metric.nominations}</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Democracy Votes</div>
                  <div className="text-2xl font-bold">{metric.democracyVotes}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Sub-score</span>
                  <span className="text-sm font-medium">{metric.subScore.toFixed(2)}</span>
                </div>
                <Progress value={(metric.subScore / totalScore) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Contributes {Math.round((metric.subScore / totalScore) * 100)}% to total score
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-dashed mt-4">
                <h4 className="text-sm font-medium mb-2">Score Calculation</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-mono">
                      0.6 × {formatDOT(metric.activeStake)} DOT ={" "}
                      {(Number.parseFloat(formatDOT(metric.activeStake)) * 0.6).toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="font-mono">
                      0.2 × {metric.nominations} nominations = {(metric.nominations * 0.2).toFixed(2)}
                    </span>
                  </p>
                  <p>
                    <span className="font-mono">
                      0.2 × {metric.democracyVotes} votes = {(metric.democracyVotes * 0.2).toFixed(2)}
                    </span>
                  </p>
                  <p className="font-medium mt-2">
                    <span className="font-mono">Total: {metric.subScore.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-medium mb-2">How Your Score Is Calculated</h4>
            <p className="text-sm text-muted-foreground">
              Your PolkaScore is calculated based on your on-chain activity across multiple Polkadot networks. The score
              takes into account your staked DOT (60%), nominations (20%), and governance participation (20%). The raw
              score is then scaled to a range of 350-850.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Chain Weights</div>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>Polkadot: 50%</li>
                  <li>Kusama: 25%</li>
                  <li>Westend: 25%</li>
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium">Score Range</div>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>Minimum: 350</li>
                  <li>Maximum: 850</li>
                  <li>Excellent: 700+</li>
                  <li>Good: 500-699</li>
                  <li>Fair: 350-499</li>
                </ul>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
