"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vote, FileText } from "lucide-react"
import type { UserData } from "@/types/user-data"

interface GovernanceGridProps {
  userData: UserData
}

export function GovernanceGrid({ userData }: GovernanceGridProps) {
  // Sample governance data
  const recentVotes = [
    {
      proposalId: "Proposal #23",
      title: "Treasury Funding for Development",
      vote: "Yes",
      date: "2023-04-12",
    },
    {
      proposalId: "Proposal #22",
      title: "Parachain Slot Auction Participation",
      vote: "No",
      date: "2023-03-28",
    },
    {
      proposalId: "Proposal #21",
      title: "Protocol Parameter Update",
      vote: "Yes",
      date: "2023-03-15",
    },
    {
      proposalId: "Proposal #20",
      title: "Community Fund Allocation",
      vote: "Abstain",
      date: "2023-03-01",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Governance Participation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Votes Cast</div>
              <div className="text-2xl font-bold">{userData.governance.votesCast}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Proposals Created</div>
              <div className="text-2xl font-bold">{userData.governance.proposalsCreated}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Delegation</div>
              <div className="text-2xl font-bold">{userData.governance.delegationActivity ? "Active" : "None"}</div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-12 p-3 border-b bg-muted/50 text-sm font-medium">
              <div className="col-span-3">Proposal</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Vote</div>
              <div className="col-span-2">Date</div>
            </div>
            <div className="divide-y">
              {userData.governance.votesCast > 0 ? (
                recentVotes.slice(0, userData.governance.votesCast).map((vote, index) => (
                  <div key={index} className="grid grid-cols-12 p-3 text-sm items-center">
                    <div className="col-span-3 font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {vote.proposalId}
                    </div>
                    <div className="col-span-5 text-muted-foreground">{vote.title}</div>
                    <div className="col-span-2">
                      <Badge
                        className={
                          vote.vote === "Yes" ? "bg-green-500" : vote.vote === "No" ? "bg-red-500" : "bg-yellow-500"
                        }
                      >
                        {vote.vote}
                      </Badge>
                    </div>
                    <div className="col-span-2 text-muted-foreground">{vote.date}</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Vote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No governance participation yet</p>
                  <p className="text-xs mt-1">Participating in governance will improve your PolkaScore</p>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            Governance participation contributes 3x to your PolkaScore calculation
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
