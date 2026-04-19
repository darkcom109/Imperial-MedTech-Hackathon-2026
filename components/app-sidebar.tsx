"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ArrowRightLeftIcon,
  BellRingIcon,
  ChartBarIcon,
  CircleHelpIcon,
  CommandIcon,
  FileChartColumnIcon,
  FileClockIcon,
  LayoutDashboardIcon,
  PackageSearchIcon,
  SearchIcon,
  Settings2Icon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Stocks",
    url: "/",
    icon: <PackageSearchIcon />,
  },
  {
    title: "Transfers",
    url: "#",
    icon: <ArrowRightLeftIcon />,
  },
  {
    title: "Analytics",
    url: "#",
    icon: <ChartBarIcon />,
  },
  {
    title: "Partner Pharmacies",
    url: "#",
    icon: <UsersIcon />,
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: <Settings2Icon />,
  },
  {
    title: "Get Help",
    url: "#",
    icon: <CircleHelpIcon />,
  },
  {
    title: "Notifications",
    url: "#",
    icon: <BellRingIcon />,
  },
  {
    title: "Search",
    url: "#",
    icon: <SearchIcon />,
  },
]

const documents = [
  {
    name: "Transfer Log",
    url: "#",
    icon: <FileClockIcon />,
  },
  {
    name: "Waste Report",
    url: "#",
    icon: <FileChartColumnIcon />,
  },
  {
    name: "Compliance Notes",
    url: "#",
    icon: <ShieldCheckIcon />,
  },
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  currentAccount: {
    name: string
    owner: string
  }
}

export function AppSidebar({
  currentAccount,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Fleming Rx</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: currentAccount.owner,
            email: currentAccount.name,
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
