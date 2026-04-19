"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { date: "2026-03-21", surplus: 4, requests: 2 },
  { date: "2026-03-24", surplus: 5, requests: 3 },
  { date: "2026-03-27", surplus: 3, requests: 4 },
  { date: "2026-03-30", surplus: 6, requests: 2 },
  { date: "2026-04-02", surplus: 7, requests: 4 },
  { date: "2026-04-05", surplus: 5, requests: 5 },
  { date: "2026-04-08", surplus: 8, requests: 3 },
  { date: "2026-04-10", surplus: 6, requests: 4 },
  { date: "2026-04-12", surplus: 4, requests: 6 },
  { date: "2026-04-14", surplus: 7, requests: 5 },
  { date: "2026-04-16", surplus: 6, requests: 4 },
  { date: "2026-04-18", surplus: 9, requests: 3 },
  { date: "2026-04-19", surplus: 8, requests: 2 },
]

const chartConfig = {
  surplus: {
    label: "Surplus posts",
    color: "var(--chart-2)",
  },
  requests: {
    label: "Shortage requests",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("30d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2026-04-19")
    let daysToSubtract = 90

    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Local stock signals</CardTitle>
        <CardDescription>
          Surplus listings versus shortage requests in the nearby network
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 90 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSurplus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-surplus)" stopOpacity={0.85} />
                <stop offset="95%" stopColor="var(--color-surplus)" stopOpacity={0.08} />
              </linearGradient>
              <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-requests)" stopOpacity={0.75} />
                <stop offset="95%" stopColor="var(--color-requests)" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="requests"
              type="monotone"
              fill="url(#fillRequests)"
              stroke="var(--color-requests)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="surplus"
              type="monotone"
              fill="url(#fillSurplus)"
              stroke="var(--color-surplus)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
