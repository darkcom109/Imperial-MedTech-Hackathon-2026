"use client"

import * as React from "react"
import type { CSSProperties } from "react"

import { AppSidebar } from "@/components/app-sidebar"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type StockStatus = "surplus" | "low-stock"
type Priority = "Routine" | "Urgent"
type RequestStatus =
  | "pending"
  | "approved"
  | "dispatched"
  | "completed"
  | "declined"

type InventoryItem = {
  medication: string
  note: string
  quantity: number
  status: StockStatus
  unit: string
}

type PharmacyAccount = {
  accountId: string
  address: string
  branch: string
  id: string
  inventory: InventoryItem[]
  name: string
  owner: string
  sync: string
}

type TransferRequest = {
  createdAt: number
  fromAccountId: string
  fromAccountName: string
  id: string
  medication: string
  note: string
  priority: Priority
  quantity: number
  status: RequestStatus
  toAccountId: string
  toAccountName: string
  unit: string
  updatedAt: number
}

type RequestOption = {
  availableQuantity: number
  medication: string
  unit: string
}

const INITIAL_ACCOUNTS: PharmacyAccount[] = [
  {
    id: "greencross",
    name: "GreenCross Pharmacy",
    branch: "Brixton Branch",
    address: "214 Acre Lane, London",
    owner: "Dr. Maya Patel",
    accountId: "PH-20481",
    sync: "Updated 2 minutes ago",
    inventory: [
      {
        medication: "Amoxicillin 500mg",
        status: "surplus",
        quantity: 48,
        unit: "packs",
        note: "Available for same-day redistribution.",
      },
      {
        medication: "Doxycycline 100mg",
        status: "low-stock",
        quantity: 6,
        unit: "packs",
        note: "Remaining stock may not cover tomorrow's prescriptions.",
      },
      {
        medication: "Clarithromycin 500mg",
        status: "surplus",
        quantity: 24,
        unit: "packs",
        note: "Extra stock available after today's delivery.",
      },
    ],
  },
  {
    id: "elmstreet",
    name: "Elm Street Pharmacy",
    branch: "Clapham Branch",
    address: "89 Stonhouse Street, London",
    owner: "Aisha Khan",
    accountId: "PH-10833",
    sync: "Updated 5 minutes ago",
    inventory: [
      {
        medication: "Doxycycline 100mg",
        status: "surplus",
        quantity: 30,
        unit: "packs",
        note: "Enough stock to support nearby pharmacies.",
      },
      {
        medication: "Amoxicillin 500mg",
        status: "low-stock",
        quantity: 4,
        unit: "packs",
        note: "Weekend demand is outpacing supply.",
      },
      {
        medication: "Co-amoxiclav 625mg",
        status: "surplus",
        quantity: 18,
        unit: "packs",
        note: "Reserve stock can cover urgent community demand.",
      },
    ],
  },
]

const INITIAL_REQUESTS: TransferRequest[] = [
  {
    id: "REQ-100",
    fromAccountId: "elmstreet",
    fromAccountName: "Elm Street Pharmacy",
    toAccountId: "greencross",
    toAccountName: "GreenCross Pharmacy",
    medication: "Amoxicillin 500mg",
    quantity: 8,
    unit: "packs",
    priority: "Routine",
    note: "Weekend antibiotic demand was higher than forecast.",
    status: "pending",
    createdAt: Date.parse("2026-04-19T09:12:00"),
    updatedAt: Date.parse("2026-04-19T09:12:00"),
  },
]

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timestamp)
}

function getPartnerAccount(accounts: PharmacyAccount[], currentAccountId: string) {
  return accounts.find((account) => account.id !== currentAccountId)!
}

function getRequestOptions(
  currentAccount: PharmacyAccount,
  partnerAccount: PharmacyAccount
) {
  return currentAccount.inventory
    .filter((item) => item.status === "low-stock")
    .map((item) => {
      const supplierItem = partnerAccount.inventory.find(
        (partnerItem) =>
          partnerItem.medication === item.medication &&
          partnerItem.status === "surplus"
      )

      if (!supplierItem) {
        return null
      }

      return {
        availableQuantity: supplierItem.quantity,
        medication: item.medication,
        unit: supplierItem.unit,
      }
    })
    .filter((item): item is RequestOption => item !== null)
}

function getStatusBadgeClass(status: RequestStatus) {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "dispatched":
      return "border-sky-200 bg-sky-50 text-sky-700"
    case "completed":
      return "border-teal-200 bg-teal-50 text-teal-700"
    case "declined":
      return "border-rose-200 bg-rose-50 text-rose-700"
    default:
      return "border-amber-200 bg-amber-50 text-amber-700"
  }
}

function getInventoryBadgeClass(status: StockStatus) {
  return status === "surplus"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700"
}

function getPriorityBadgeClass(priority: Priority) {
  return priority === "Urgent"
    ? "border-rose-200 bg-rose-50 text-rose-700"
    : "border-slate-200 bg-slate-50 text-slate-700"
}

function formatRequestStatus(status: RequestStatus) {
  switch (status) {
    case "approved":
      return "Approved"
    case "dispatched":
      return "Dispatched"
    case "completed":
      return "Completed"
    case "declined":
      return "Declined"
    default:
      return "Pending"
  }
}

function formatInventoryQuantity(item: InventoryItem) {
  const suffix = item.status === "surplus" ? "available" : "on hand"
  return `${item.quantity} ${item.unit} ${suffix}`
}

export default function Home() {
  const [accounts, setAccounts] = React.useState(INITIAL_ACCOUNTS)
  const initialOptions = getRequestOptions(accounts[0], accounts[1])

  const [currentAccountId, setCurrentAccountId] = React.useState(
    accounts[0].id
  )
  const [requests, setRequests] = React.useState(INITIAL_REQUESTS)
  const [notice, setNotice] = React.useState(
    "Create a request in the sender modal, then switch accounts to process it in the receiver modal."
  )
  const [notification, setNotification] = React.useState(
    "Demo notification: GreenCross Pharmacy has 1 incoming request awaiting review."
  )
  const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false)
  const [detailRequestId, setDetailRequestId] = React.useState<string | null>(null)
  const requestCounterRef = React.useRef(101)
  const timelineRef = React.useRef(Date.parse("2026-04-19T10:00:00"))
  const [requestForm, setRequestForm] = React.useState<{
    medication: string
    note: string
    priority: Priority
    quantity: string
  }>({
    medication: initialOptions[0]?.medication ?? "",
    note: "",
    priority: "Routine",
    quantity: initialOptions[0]
      ? String(Math.min(initialOptions[0].availableQuantity, 10))
      : "",
  })

  const currentAccount = accounts.find(
    (account) => account.id === currentAccountId
  )!

  const stockChartData = currentAccount.inventory.map((item) => ({
    medication: item.medication,
    quantity: item.quantity,
    fill:
      item.status === "surplus"
        ? "hsl(142 71% 45%)" // green
        : "hsl(38 92% 50%)", // amber
  }))

  const stockChartConfig = {
    quantity: {
      label: "Stock quantity",
      color: "hsl(var(--chart-1))",
    },
  } satisfies import("@/components/ui/chart").ChartConfig
  const partnerAccount = getPartnerAccount(accounts, currentAccountId)
  const requestOptions = getRequestOptions(currentAccount, partnerAccount)
  const selectedOption =
    requestOptions.find((option) => option.medication === requestForm.medication) ??
    requestOptions[0]
  const selectedDetailRequest = detailRequestId
    ? requests.find((request) => request.id === detailRequestId) ?? null
    : null
  const selectedRequestIsIncoming =
    selectedDetailRequest?.toAccountId === currentAccount.id

  const incomingRequests = [...requests]
    .filter((request) => request.toAccountId === currentAccount.id)
    .sort((a, b) => b.updatedAt - a.updatedAt)

  const actionableIncomingRequests = incomingRequests.filter(
    (request) => request.status !== "completed" && request.status !== "declined"
  )

  const outgoingRequests = [...requests]
    .filter((request) => request.fromAccountId === currentAccount.id)
    .sort((a, b) => b.updatedAt - a.updatedAt)

  function getNextTimelineStamp() {
    timelineRef.current += 4 * 60 * 1000
    return timelineRef.current
  }

  function resetFormForAccount(nextAccountId: string) {
    const nextCurrent = INITIAL_ACCOUNTS.find(
      (account) => account.id === nextAccountId
    )!
    const nextPartner = getPartnerAccount(accounts, nextAccountId)
    const nextOptions = getRequestOptions(nextCurrent, nextPartner)
    const nextDefault = nextOptions[0]

    setRequestForm({
      medication: nextDefault?.medication ?? "",
      note: "",
      priority: "Routine",
      quantity: nextDefault
        ? String(Math.min(nextDefault.availableQuantity, 10))
        : "",
    })
  }

  function handleSwitchAccount(nextAccountId: string) {
    if (nextAccountId === currentAccountId) {
      return
    }

    const nextAccount = accounts.find(
      (account) => account.id === nextAccountId
    )!

    setCurrentAccountId(nextAccountId)
    setIsRequestModalOpen(false)
    setDetailRequestId(null)
    resetFormForAccount(nextAccountId)
    setNotice(`${nextAccount.name} is now active.`)
    setNotification(
      `Active branch changed: ${nextAccount.name} is ready to review live transfer activity.`
    )
  }

  function handleCreateRequest() {
    if (!selectedOption) {
      setNotice(
        `No matched surplus is currently available at ${partnerAccount.name}.`
      )
      return
    }

    const parsedQuantity = Number(requestForm.quantity)

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setNotice("Enter a valid request quantity.")
      return
    }

    if (parsedQuantity > selectedOption.availableQuantity) {
      setNotice(
        `Only ${selectedOption.availableQuantity} ${selectedOption.unit} are available at ${partnerAccount.name}.`
      )
      return
    }

    const now = getNextTimelineStamp()
    const requestId = `REQ-${requestCounterRef.current}`
    requestCounterRef.current += 1

    setRequests((previousRequests) => [
      {
        id: requestId,
        fromAccountId: currentAccount.id,
        fromAccountName: currentAccount.name,
        toAccountId: partnerAccount.id,
        toAccountName: partnerAccount.name,
        medication: selectedOption.medication,
        quantity: parsedQuantity,
        unit: selectedOption.unit,
        priority: requestForm.priority,
        note: requestForm.note.trim(),
        status: "pending",
        createdAt: now,
        updatedAt: now,
      },
      ...previousRequests,
    ])

    setIsRequestModalOpen(false)
    setNotice(
      `Request sent from ${currentAccount.name} to ${partnerAccount.name}. Switch accounts and open the request details to process it.`
    )
    setNotification(
      `New request created: ${currentAccount.name} asked ${partnerAccount.name} for ${parsedQuantity} ${selectedOption.unit} of ${selectedOption.medication}.`
    )
    setRequestForm({
      medication: selectedOption.medication,
      note: "",
      priority: "Routine",
      quantity: String(Math.min(selectedOption.availableQuantity, 10)),
    })
  }

  function updateRequestStatus(
    requestId: string,
    nextStatus: RequestStatus,
    message: string
  ) {
    const currentRequest = requests.find((request) => request.id === requestId)

    if (!currentRequest) {
      return
    }

    setRequests((previousRequests) =>
      previousRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: nextStatus,
              updatedAt: getNextTimelineStamp(),
            }
          : request
      )
    )

    if (nextStatus === "dispatched") {
      setAccounts((previousAccounts) =>
        previousAccounts.map((account) => {
          if (account.id !== currentRequest.toAccountId) {
            return account
          }

          return {
            ...account,
            inventory: account.inventory.map((item) => {
              if (item.medication !== currentRequest.medication) {
                return item
              }

              const nextQuantity = Math.max(0, item.quantity - currentRequest.quantity)
              const nextStatusForItem: StockStatus =
                nextQuantity <= 5 ? "low-stock" : item.status

              return {
                ...item,
                quantity: nextQuantity,
                status: nextStatusForItem,
                note:
                  nextStatusForItem === "low-stock"
                    ? "Stock reduced after dispatch. Replenishment may be needed soon."
                    : item.note,
              }
            }),
          }
        })
      )

      setNotification(
        `${currentRequest.toAccountName} dispatched ${currentRequest.quantity} ${currentRequest.unit} of ${currentRequest.medication}. Supplier stock has been reduced.`
      )
    } else if (nextStatus === "completed") {
      setAccounts((previousAccounts) =>
        previousAccounts.map((account) => {
          if (account.id !== currentRequest.fromAccountId) {
            return account
          }

          return {
            ...account,
            inventory: account.inventory.map((item) => {
              if (item.medication !== currentRequest.medication) {
                return item
              }

              return {
                ...item,
                quantity: item.quantity + currentRequest.quantity,
                status: item.quantity + currentRequest.quantity > 10 ? "surplus" : item.status,
                note: "Stock updated after confirmed receipt from partner pharmacy.",
              }
            }),
          }
        })
      )

      setNotification(
        `${currentRequest.fromAccountName} confirmed receipt of ${currentRequest.quantity} ${currentRequest.unit} of ${currentRequest.medication}.`
      )
    } else if (nextStatus === "approved") {
      setNotification(
        `${currentRequest.toAccountName} approved the request for ${currentRequest.medication}.`
      )
    } else if (nextStatus === "declined") {
      setNotification(
        `${currentRequest.toAccountName} declined the request for ${currentRequest.medication}.`
      )
    }

    setNotice(message)
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "17rem",
          "--header-height": "4rem",
        } as CSSProperties
      }
    >
      <AppSidebar
        currentAccount={{
          name: currentAccount.name,
          owner: currentAccount.owner,
        }}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader
          currentAccountName={currentAccount.name}
          incomingRequests={actionableIncomingRequests.length}
        />
        <div className="@container/main flex flex-1 flex-col gap-4">
          <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
                {notification}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{currentAccount.name}</CardTitle>
                  <CardDescription>
                    Switch accounts, send a request, then process it on the other side.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Owner</p>
                      <p className="mt-2 font-medium">{currentAccount.owner}</p>
                    </div>
                    <div className="rounded-xl border bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Pharmacy ID</p>
                      <p className="mt-2 font-medium">{currentAccount.accountId}</p>
                    </div>
                    <div className="rounded-xl border bg-background/80 p-4 sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Current status</p>
                      <p className="mt-2 font-medium">{notice}</p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleSwitchAccount(account.id)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left transition",
                          currentAccount.id === account.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "bg-card hover:bg-muted/60"
                        )}
                      >
                        <p className="font-medium">{account.name}</p>
                        <p
                          className={cn(
                            "text-sm",
                            currentAccount.id === account.id
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {account.branch}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock</CardTitle>
                  <CardDescription>What this pharmacy can offer or needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentAccount.inventory.map((item) => {
                    const canRequestFromPartner =
                      item.status === "low-stock" &&
                      requestOptions.some(
                        (option) => option.medication === item.medication
                      )

                    return (
                      <div
                        key={item.medication}
                        className="rounded-xl border bg-muted/30 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.medication}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatInventoryQuantity(item)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className={getInventoryBadgeClass(item.status)}
                            >
                              {item.status === "surplus" ? "Surplus" : "Low stock"}
                            </Badge>
                            {canRequestFromPartner ? (
                              <Badge variant="outline">Partner can fulfil</Badge>
                            ) : null}
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {item.note}
                        </p>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Request stock</CardTitle>
                  <CardDescription>Request matched stock from {partnerAccount.name}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  {requestOptions.length > 0 ? (
                    requestOptions.map((option) => (
                      <div
                        key={option.medication}
                        className="rounded-xl border bg-muted/30 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{option.medication}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {partnerAccount.name} can send up to{" "}
                              {option.availableQuantity} {option.unit}
                            </p>
                          </div>
                          <Badge variant="outline">Available to request</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                      There are no medicines where this account has a shortage and
                      the partner has surplus stock.
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between gap-2">
                  <p className="text-sm text-muted-foreground">Uses the modal form.</p>
                  <Button
                    onClick={() => setIsRequestModalOpen(true)}
                    disabled={requestOptions.length === 0}
                  >
                    Open request form
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock overview</CardTitle>
                  <CardDescription>
                    Live stock levels for {currentAccount.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={stockChartConfig} className="h-[320px] w-full">
                    <BarChart accessibilityLayer data={stockChartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="medication"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="quantity" radius={8}>
                        {stockChartData.map((entry) => (
                          <Cell key={entry.medication} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 px-4 lg:grid-cols-[1fr_1fr] lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>Incoming queue</CardTitle>
                  <CardDescription>Requests this account can process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {actionableIncomingRequests.length > 0 ? (
                    actionableIncomingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-xl border bg-muted/30 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{request.medication}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {request.fromAccountName} requested {request.quantity}{" "}
                              {request.unit}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className={getPriorityBadgeClass(request.priority)}
                            >
                              {request.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getStatusBadgeClass(request.status)}
                            >
                              {formatRequestStatus(request.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm text-muted-foreground">
                            Requested at {formatTime(request.createdAt)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDetailRequestId(request.id)}
                          >
                            View details
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                      No actionable incoming requests. Switch to the other account
                      and send one to see it land here instantly.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sent requests</CardTitle>
                  <CardDescription>Requests created by this account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {outgoingRequests.length > 0 ? (
                    outgoingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="rounded-xl border bg-muted/30 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{request.medication}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Sent to {request.toAccountName} for {request.quantity}{" "}
                              {request.unit}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="outline"
                              className={getPriorityBadgeClass(request.priority)}
                            >
                              {request.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getStatusBadgeClass(request.status)}
                            >
                              {formatRequestStatus(request.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm text-muted-foreground">
                            Updated at {formatTime(request.updatedAt)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDetailRequestId(request.id)}
                          >
                            View details
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                      No sent requests yet. Use the request form modal to create one
                      from this account.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>

        <Sheet open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
          <SheetContent className="w-full sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Create transfer request</SheetTitle>
              <SheetDescription>
                Acting as {currentAccount.name}, request stock from{" "}
                {partnerAccount.name}.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
              <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                {selectedOption ? (
                  <>
                    {partnerAccount.name} currently has up to{" "}
                    <span className="font-medium text-foreground">
                      {selectedOption.availableQuantity} {selectedOption.unit}
                    </span>{" "}
                    of {selectedOption.medication} available to send.
                  </>
                ) : (
                  <>There is no matched partner surplus for this account right now.</>
                )}
              </div>

              <div className="space-y-2">
                <Label>Medication</Label>
                <Select
                  value={selectedOption?.medication ?? ""}
                  onValueChange={(value) => {
                    const option = requestOptions.find(
                      (requestOption) => requestOption.medication === value
                    )

                    setRequestForm((previousForm) => ({
                      ...previousForm,
                      medication: value,
                      quantity: option
                        ? String(Math.min(option.availableQuantity, 10))
                        : previousForm.quantity,
                    }))
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="No matched medicines available" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestOptions.map((option) => (
                      <SelectItem key={option.medication} value={option.medication}>
                        {option.medication}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="request-quantity">Quantity</Label>
                  <Input
                    id="request-quantity"
                    type="number"
                    min={1}
                    max={selectedOption?.availableQuantity}
                    value={requestForm.quantity}
                    onChange={(event) =>
                      setRequestForm((previousForm) => ({
                        ...previousForm,
                        quantity: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={requestForm.priority}
                    onValueChange={(value) =>
                      setRequestForm((previousForm) => ({
                        ...previousForm,
                        priority: value as Priority,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Routine">Routine</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="request-note">Reason for request</Label>
                <Input
                  id="request-note"
                  placeholder="Optional context for the receiving pharmacy"
                  value={requestForm.note}
                  onChange={(event) =>
                    setRequestForm((previousForm) => ({
                      ...previousForm,
                      note: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <SheetFooter className="border-t">
              <Button
                variant="outline"
                onClick={() => setIsRequestModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRequest} disabled={!selectedOption}>
                Send request
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Sheet
          open={detailRequestId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDetailRequestId(null)
            }
          }}
        >
          <SheetContent className="w-full sm:max-w-xl">
            {selectedDetailRequest ? (
              <>
                <SheetHeader>
                  <SheetTitle>{selectedDetailRequest.medication}</SheetTitle>
                  <SheetDescription>
                    {selectedRequestIsIncoming
                      ? `Review this request as ${currentAccount.name}.`
                      : `Track this request as ${currentAccount.name}.`}
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={getPriorityBadgeClass(selectedDetailRequest.priority)}
                    >
                      {selectedDetailRequest.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(selectedDetailRequest.status)}
                    >
                      {formatRequestStatus(selectedDetailRequest.status)}
                    </Badge>
                    <Badge variant="outline">{selectedDetailRequest.id}</Badge>
                  </div>

                  <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                    <p className="font-medium">
                      {selectedRequestIsIncoming
                        ? "You are the receiving supplier for this request."
                        : "You are the requesting pharmacy for this transfer."}
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      {selectedRequestIsIncoming
                        ? "Review the request details below before approving, declining, or marking it as dispatched."
                        : "Track the supplier response here and confirm receipt after dispatch."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="mt-2 font-medium">
                        {selectedDetailRequest.fromAccountName}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">To</p>
                      <p className="mt-2 font-medium">
                        {selectedDetailRequest.toAccountName}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="mt-2 font-medium">
                        {selectedDetailRequest.quantity} {selectedDetailRequest.unit}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-background/80 p-4">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="mt-2 font-medium">
                        {formatTime(selectedDetailRequest.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-background/80 p-4 sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Reason supplied</p>
                      <p className="mt-2 font-medium">
                        {selectedDetailRequest.note || "No additional note provided."}
                      </p>
                    </div>
                    <div className="rounded-xl border bg-background/80 p-4 sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Last update</p>
                      <p className="mt-2 font-medium">
                        {formatTime(selectedDetailRequest.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <SheetFooter className="border-t">
                  <Button
                    variant="outline"
                    onClick={() => setDetailRequestId(null)}
                  >
                    Close
                  </Button>

                  {selectedRequestIsIncoming &&
                  selectedDetailRequest.status === "pending" ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          updateRequestStatus(
                            selectedDetailRequest.id,
                            "declined",
                            `${currentAccount.name} declined the request from ${selectedDetailRequest.fromAccountName}.`
                          )
                        }
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() =>
                          updateRequestStatus(
                            selectedDetailRequest.id,
                            "approved",
                            `${currentAccount.name} approved ${selectedDetailRequest.medication} for ${selectedDetailRequest.fromAccountName}.`
                          )
                        }
                      >
                        Approve request
                      </Button>
                    </>
                  ) : null}

                  {selectedRequestIsIncoming &&
                  selectedDetailRequest.status === "approved" ? (
                    <Button
                      onClick={() =>
                        updateRequestStatus(
                          selectedDetailRequest.id,
                          "dispatched",
                          `${currentAccount.name} marked ${selectedDetailRequest.medication} as dispatched.`
                        )
                      }
                    >
                      Mark dispatched
                    </Button>
                  ) : null}

                  {!selectedRequestIsIncoming &&
                  selectedDetailRequest.status === "dispatched" ? (
                    <Button
                      onClick={() =>
                        updateRequestStatus(
                          selectedDetailRequest.id,
                          "completed",
                          `${currentAccount.name} confirmed receipt of ${selectedDetailRequest.medication}.`
                        )
                      }
                    >
                      Confirm receipt
                    </Button>
                  ) : null}
                </SheetFooter>
              </>
            ) : null}
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  )
}
