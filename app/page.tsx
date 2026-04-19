import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const stockItems = [
  {
    medication: "Amoxicillin 500mg",
    status: "Surplus",
    quantity: "48 packs available",
    note: "Good candidate for same-day redistribution",
  },
  {
    medication: "Ventolin Inhaler",
    status: "Low stock",
    quantity: "6 units left",
    note: "Demand spike expected before evening",
  },
  {
    medication: "Metformin 1g",
    status: "Surplus",
    quantity: "32 packs available",
    note: "Expires in six weeks",
  },
]

const matches = [
  {
    pharmacy: "Elm Street Pharmacy",
    medication: "Ventolin Inhaler",
    quantity: "Needs 12 units",
    distance: "1.4 miles away",
    priority: "Urgent",
  },
  {
    pharmacy: "Northside Chemist",
    medication: "Amoxicillin 500mg",
    quantity: "Needs 20 packs",
    distance: "2.1 miles away",
    priority: "Routine",
  },
  {
    pharmacy: "Southbank Pharmacy",
    medication: "Metformin 1g",
    quantity: "Needs 10 packs",
    distance: "2.8 miles away",
    priority: "Routine",
  },
]

const recentActivity = [
  "Accepted a transfer request for 10 insulin pens from Southbank Pharmacy.",
  "Logged new surplus stock for Amoxicillin after the morning delivery.",
  "Flagged Ventolin as low stock for priority matching.",
]

export default function Home() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "17rem",
          "--header-height": "4rem",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="@container/main flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-card via-card to-muted/30">
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Mock pharmacy account</Badge>
                    <Badge variant="outline">Brixton branch</Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">
                    GreenCross Pharmacy
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-sm leading-6">
                    A simple single-account dashboard for logging surplus stock,
                    spotting shortages nearby, and approving transfers between
                    pharmacies.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="mt-2 font-medium">Dr. Maya Patel</p>
                  </div>
                  <div className="rounded-xl border bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Pharmacy ID</p>
                    <p className="mt-2 font-medium">PH-20481</p>
                  </div>
                  <div className="rounded-xl border bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Sync status</p>
                    <p className="mt-2 font-medium">Updated 8 minutes ago</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button>Log stock update</Button>
                  <Button variant="outline">Review transfer queue</Button>
                </CardFooter>
              </Card>
            </div>

            <SectionCards />

            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>

            <div className="grid gap-4 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current stock status</CardTitle>
                  <CardDescription>
                    What GreenCross can offer or needs attention today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stockItems.map((item) => (
                    <div
                      key={item.medication}
                      className="rounded-xl border bg-muted/30 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.medication}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.quantity}
                          </p>
                        </div>
                        <Badge
                          variant={item.status === "Surplus" ? "default" : "outline"}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{item.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick stock log</CardTitle>
                  <CardDescription>
                    Basic shadcn mock form for the current pharmacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication</Label>
                    <Input id="medication" defaultValue="Amoxicillin 500mg" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select defaultValue="surplus">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="surplus">Surplus</SelectItem>
                          <SelectItem value="low-stock">Low stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input id="quantity" defaultValue="20 packs" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" defaultValue="16 May 2026" />
                    </div>
                    <div className="space-y-2">
                      <Label>Urgency</Label>
                      <Select defaultValue="routine">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    This form is static for the prototype.
                  </p>
                  <Button>Save update</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 px-4 lg:grid-cols-[1fr_1fr] lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nearby transfer opportunities</CardTitle>
                  <CardDescription>
                    Suggested matches based on medicine, distance, and urgency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {matches.map((match) => (
                    <div
                      key={`${match.pharmacy}-${match.medication}`}
                      className="rounded-xl border bg-muted/30 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{match.medication}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {match.pharmacy} / {match.distance}
                          </p>
                        </div>
                        <Badge
                          variant={match.priority === "Urgent" ? "destructive" : "outline"}
                        >
                          {match.priority}
                        </Badge>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">{match.quantity}</p>
                        <Button variant="outline" size="sm">
                          Offer transfer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                  <CardDescription>
                    Demo history for this fake pharmacy account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((item, index) => (
                    <div key={item} className="flex gap-3 rounded-xl border bg-muted/30 p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        0{index + 1}
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Export activity</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
