"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react"
import type { UserData } from "@/types/user-data"

interface TransferGridProps {
  userData: UserData
}

export function TransferGrid({ userData }: TransferGridProps) {
  // Sample transfer data
  const recentTransfers = [
    {
      type: "outgoing",
      amount: 25.5,
      recipient: "0x742d...44e",
      date: "2023-04-15",
    },
    {
      type: "incoming",
      amount: 10.2,
      sender: "0x8B33...4B4",
      date: "2023-04-10",
    },
    {
      type: "outgoing",
      amount: 5.0,
      recipient: "0x3F57...966",
      date: "2023-04-05",
    },
    {
      type: "incoming",
      amount: 15.8,
      sender: "0x1F9V...1bCc",
      date: "2023-04-01",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Transfers</div>
              <div className="text-2xl font-bold">{userData.transfers.frequency}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Volume</div>
              <div className="text-2xl font-bold">{userData.transfers.volume} DOT</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Recipients</div>
              <div className="text-2xl font-bold">{userData.transfers.uniqueRecipients}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Amount</div>
              <div className="text-2xl font-bold">
                {userData.transfers.frequency > 0
                  ? (userData.transfers.volume / userData.transfers.frequency).toFixed(2)
                  : "0"}{" "}
                DOT
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-12 p-3 border-b bg-muted/50 text-sm font-medium">
              <div className="col-span-1">Type</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-5">Address</div>
              <div className="col-span-3">Date</div>
            </div>
            <div className="divide-y">
              {recentTransfers.map((transfer, index) => (
                <div key={index} className="grid grid-cols-12 p-3 text-sm items-center">
                  <div className="col-span-1">
                    {transfer.type === "outgoing" ? (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="col-span-3 font-medium">
                    {transfer.type === "outgoing" ? "-" : "+"}
                    {transfer.amount} DOT
                  </div>
                  <div className="col-span-5 text-muted-foreground">
                    {transfer.type === "outgoing" ? `To: ${transfer.recipient}` : `From: ${transfer.sender}`}
                  </div>
                  <div className="col-span-3 flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {transfer.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            Transfer activity contributes 2x to your PolkaScore calculation
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
