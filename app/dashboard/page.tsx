import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"

const dashboardAccount = {
  name: "GreenCross Pharmacy",
  owner: "Dr. Maya Patel",
  branch: "Brixton Branch",
}

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar currentAccount={dashboardAccount} variant="inset" />
      <SidebarInset>
        <SiteHeader
          currentAccountName={dashboardAccount.name}
          incomingRequests={1}
        />
        <div className="@container/main flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Dashboard snapshot</Badge>
                    <Badge variant="outline">Antibiotic stock network</Badge>
                  </div>
                  <CardTitle>{dashboardAccount.name}</CardTitle>
                  <CardDescription>
                    Summary view of stock pressure, active transfers, and recent
                    antibiotic workflow items.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="mt-2 font-medium">{dashboardAccount.owner}</p>
                  </div>
                  <div className="rounded-xl border bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="mt-2 font-medium">{dashboardAccount.branch}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <SectionCards
              activeTransfers={2}
              currentAccountName={dashboardAccount.name}
              incomingRequests={1}
              shortageCount={1}
              surplusCount={2}
            />

            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>

            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer records</CardTitle>
                  <CardDescription>
                    Recent antibiotic requests, stock reviews, and dispatch items.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <DataTable data={data} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
