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
  PillBottleIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
} from "lucide-react"

const metrics = [
  {
    title: "Surplus listings",
    value: "3",
    detail: "Amoxicillin and Metformin ready to share",
    change: "+2 today",
    icon: TrendingUpIcon,
  },
  {
    title: "Shortage alerts",
    value: "2",
    detail: "Ventolin demand needs support this afternoon",
    change: "High priority",
    icon: TriangleAlertIcon,
  },
  {
    title: "Open transfers",
    value: "4",
    detail: "Two pending approval and two in transit",
    change: "1 just accepted",
    icon: ArrowRightLeftIcon,
  },
  {
    title: "Waste prevented",
    value: "18 packs",
    detail: "Estimated stock saved from expiry this week",
    change: "-6% expiry risk",
    icon: TrendingDownIcon,
  },
]

export function SectionCards() {
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
                Pharmacy redistribution pilot
              </div>
              <div className="text-muted-foreground">{metric.detail}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
