"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowRightLeftIcon,
  InboxIcon,
  PillBottleIcon,
  TriangleAlertIcon,
  TrendingUpIcon,
} from "lucide-react"

type SectionCardsProps = {
  activeTransfers: number
  currentAccountName: string
  incomingRequests: number
  shortageCount: number
  surplusCount: number
}

export function SectionCards({
  activeTransfers,
  currentAccountName,
  incomingRequests,
  shortageCount,
  surplusCount,
}: SectionCardsProps) {
  const metrics = [
    {
      title: "Surplus items",
      value: String(surplusCount).padStart(2, "0"),
      detail: `${currentAccountName} can offer these items today`,
      change: surplusCount > 0 ? "Ready to share" : "No spare stock",
      icon: TrendingUpIcon,
    },
    {
      title: "Shortage alerts",
      value: String(shortageCount).padStart(2, "0"),
      detail:
        shortageCount > 0
          ? "Request flow should focus on these medicines first"
          : "No low-stock items flagged right now",
      change: shortageCount > 0 ? "Needs support" : "Stable",
      icon: TriangleAlertIcon,
    },
    {
      title: "Incoming requests",
      value: String(incomingRequests).padStart(2, "0"),
      detail:
        incomingRequests > 0
          ? "Switch here to approve, decline, or dispatch"
          : "No new inbound requests to process",
      change: incomingRequests > 0 ? "Action needed" : "Queue clear",
      icon: InboxIcon,
    },
    {
      title: "Active transfers",
      value: String(activeTransfers).padStart(2, "0"),
      detail: "Requests in progress across both demo accounts",
      change: activeTransfers > 0 ? "Shared workflow live" : "Waiting to start",
      icon: ArrowRightLeftIcon,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-b *:data-[slot=card]:from-card *:data-[slot=card]:to-muted/40 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <Card key={metric.title} className="@container/card">
            <CardHeader>
              <CardDescription>{metric.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {metric.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Icon />
                  {metric.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <PillBottleIcon className="size-4" />
                Two-account redistribution demo
              </div>
              <div className="text-muted-foreground">{metric.detail}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
