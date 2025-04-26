"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, AlertCircle, Info } from "lucide-react"

export default function StakePage() {
  const [amount, setAmount] = useState<number>(100)
  const [duration, setDuration] = useState<number>(30)
  const [isStaking, setIsStaking] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const estimatedRewards = (amount * 0.15 * (duration / 365)).toFixed(2)
  const estimatedScoreIncrease = Math.round((amount / 100) * 5 + (duration / 30) * 2)

  const handleStake = () => {
    if (amount < 10) {
      setError("Minimum staking amount is 10 DOT")
      setSuccess("")
      return
    }

    setIsStaking(true)
    setError("")
    setSuccess("")

    // Simulate staking process
    setTimeout(() => {
      setIsStaking(false)
      setSuccess(`Successfully staked ${amount} DOT for ${duration} days`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Stake Your DOT</h1>
          <p className="text-muted-foreground">Earn rewards and improve your PolkaScore</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Staking Options</CardTitle>
                <CardDescription>Choose how much DOT to stake and for how long</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="flexible">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="flexible">Flexible Staking</TabsTrigger>
                    <TabsTrigger value="fixed">Fixed Period</TabsTrigger>
                  </TabsList>
                  <TabsContent value="flexible" className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="amount" className="text-sm font-medium">
                          Amount (DOT)
                        </label>
                        <span className="text-sm">{amount} DOT</span>
                      </div>
                      <Slider
                        id="amount"
                        min={10}
                        max={1000}
                        step={10}
                        value={[amount]}
                        onValueChange={(value) => setAmount(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10 DOT</span>
                        <span>1000 DOT</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label htmlFor="duration" className="text-sm font-medium">
                          Duration (Days)
                        </label>
                        <span className="text-sm">{duration} Days</span>
                      </div>
                      <Slider
                        id="duration"
                        min={7}
                        max={365}
                        step={1}
                        value={[duration]}
                        onValueChange={(value) => setDuration(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>7 Days</span>
                        <span>365 Days</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="h-12"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="fixed" className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="cursor-pointer border-2 hover:border-primary">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-medium">30 Days</h3>
                          <p className="text-sm text-muted-foreground">15% APY</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer border-2 hover:border-primary">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-medium">90 Days</h3>
                          <p className="text-sm text-muted-foreground">18% APY</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer border-2 hover:border-primary">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-medium">180 Days</h3>
                          <p className="text-sm text-muted-foreground">20% APY</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer border-2 hover:border-primary">
                        <CardContent className="p-4 text-center">
                          <h3 className="font-medium">365 Days</h3>
                          <p className="text-sm text-muted-foreground">25% APY</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                    <Info className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleStake}
                  disabled={isStaking}
                  className="w-full bg-gradient-to-r from-[#E6007A] to-[#6D3AEE] hover:opacity-90 transition-opacity h-12"
                >
                  {isStaking ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      <span>Stake {amount} DOT</span>
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Staking Benefits</CardTitle>
                <CardDescription>Rewards and PolkaScore improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm font-medium mb-1">Estimated Rewards</div>
                    <div className="text-2xl font-bold">{estimatedRewards} DOT</div>
                    <div className="text-xs text-muted-foreground">Based on 15% APY</div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm font-medium mb-1">PolkaScore Increase</div>
                    <div className="text-2xl font-bold">+{estimatedScoreIncrease} points</div>
                    <div className="text-xs text-muted-foreground">Staking has 5x weight in score</div>
                  </div>

                  <div className="p-4 rounded-lg border border-dashed">
                    <div className="text-sm font-medium mb-2">Why Stake?</div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Coins className="h-3 w-3 text-primary" />
                        </div>
                        <span>Earn passive income through staking rewards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Coins className="h-3 w-3 text-primary" />
                        </div>
                        <span>Significantly improve your PolkaScore</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                          <Coins className="h-3 w-3 text-primary" />
                        </div>
                        <span>Support the security of the Polkadot network</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
