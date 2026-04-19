import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b bg-background/80 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-1 data-[orientation=vertical]:h-4"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-medium">
                GreenCross Pharmacy Dashboard
              </h1>
              <Badge variant="outline">Mock account</Badge>
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">
              Brixton branch / same-day transfer coordination
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="outline">View queue</Button>
          <Button>Log stock</Button>
        </div>
      </div>
    </header>
  )
}
