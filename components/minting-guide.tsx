"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Award, CheckCircle, ArrowRight } from "lucide-react"
import { useState } from "react"

export function MintingGuide() {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      title: "Connect Your Wallet",
      description: "Connect your MetaMask wallet to the Moonbase Alpha network",
      icon: Wallet,
    },
    {
      title: "Check Your Score",
      description: "View your PolkaScore and see which badges you qualify for",
      icon: Award,
    },
    {
      title: "Select Badge Tier",
      description: "Choose the badge tier you want to mint (Bronze, Silver, or Gold)",
      icon: CheckCircle,
    },
    {
      title: "Confirm Transaction",
      description: "Approve the transaction in MetaMask to mint your NFT badge",
      icon: ArrowRight,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>How to Mint Your NFT Badge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
            {steps.map((step, index) => (
              <div key={index} className="relative pl-10 pb-8 last:pb-0">
                <div
                  className={`absolute left-0 top-1 size-8 rounded-full flex items-center justify-center ${
                    index + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-5 w-5" />
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous Step
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length}
            >
              Next Step
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
