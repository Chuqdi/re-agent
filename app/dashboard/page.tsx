"use client";

import { AppShell } from "@/components/layout/AppShell";
import { ArrowUpRight, FileText, Users, CalendarDays,GitPullRequest } from "lucide-react";
import { getAllRequests, getShowings,updateShowingInvitees } from "@/lib/firebase/firestore";
import { IRequest, Showing } from "@/types";
import { useEffect, useState } from "react";



const showingsSummary = {
  today: 3,
  week: 9,
  upcoming: [
    {
      time: "10:30 AM",
      address: "2418 Maple St, San Francisco",
      client: "Sarah Lin",
    },
    {
      time: "1:00 PM",
      address: "884 Cedar Ave, Oakland",
      client: "Acme Relocation",
    },
  ],
};

const clientsSummary = {
  active: 12,
  hot: 4,
  stageBreakdown: [
    { label: "New Lead", value: 6 },
    { label: "Touring", value: 4 },
    { label: "Offer Out", value: 2 },
  ],
};

const recentFiles = [
  {
    name: "2418 Maple St - Listing Agreement.pdf",
    status: "Signed",
    updated: "2h ago",
  },
  {
    name: "Lin Family - Buyer Rep Agreement.pdf",
    status: "Awaiting Signature",
    updated: "Yesterday",
  },
  {
    name: "Oakland Relocation Packet.pdf",
    status: "In Review",
    updated: "2 days ago",
  },
];

const requestsContents = [
  {
    name: "3 Bedroom Terrace. Ikoyi. N40M",
    status: "Rent",
    updated: "2h ago",
  },
  {
    name: "2 Bedroom Apartment. Victoria Island. N450M",
    status: "Purchase",
    updated: "16 days ago",
  },
  {
    name: "3 Bedroom House. Lekki. N300M",
    status: "Purchase",
    updated: "1 month ago",
  },
];

const pipeline = [
  { label: "Prospecting", value: 68 },
  { label: "Active Buyers", value: 54 },
  { label: "Under Contract", value: 32 },
  { label: "Closed (30d)", value: 18 },
];

export default function DashboardPage() {

  const [requests, setRequests] = useState<IRequest[]>();

const [allShowings, setAllShowings] = useState<Showing[]>([]);


  useEffect(() => {
    getAllRequests().then((r) => {
    setRequests(r);
    });
    }, []);
    
    
    
    
    useEffect(() => {
    const loadShowings = async () => {
    try {
    const showings = await getShowings();
    setAllShowings(showings);
    } catch (error) {
    console.error("Error loading showings:", error);
    }
    };
    loadShowings();
    }, []);


  return (
    <AppShell>
      {(user) => (
        <div className="space-y-6 text-black">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Morning, {user.displayName || user.email?.split("@")[0]}
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                High-level overview of your showings, clients, and deal flow.
              </p>
            </div>
            {/*
              <div className="hidden items-center gap-3 text-xs text-gray-500 sm:flex">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live location tracking enabled
              </span>
            </div>
            */}
          </header>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-rows-2">
            {/* Showings Card */}
            <div className="card-elevated flex flex-col justify-between p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    Showings
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-black">
                      {allShowings && allShowings.length}
                    </span>
                    <span className="text-xs text-gray-500">today</span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {/*{showingsSummary.week} scheduled this week*/}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                  <CalendarDays className="h-4 w-4 text-gray-700" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {allShowings && allShowings.slice(0,3).map((item) => (
                  <div
                    key={item.showingTime + item.address}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-xs text-gray-600">{item.showingTime}</p>
                      <p className="text-xs font-medium text-black">
                        {item.address}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Client • {item.client}
                      </p>
                    </div>
                    <button className="inline-flex h-7 items-center gap-1 rounded-full border border-gray-300 bg-black px-2 text-[11px] text-white hover:bg-black/90">
                      Open
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Clients Card */}
            <div className="card-elevated flex flex-col justify-between p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    Requests
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-black">
                      {requests && requests.length/*clientsSummary.active*/}
                    </span>
                    <span className="text-xs text-gray-500">active</span>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {/*{clientsSummary.hot} in hot pipeline*/}
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                  <GitPullRequest className="h-4 w-4 text-gray-700" />
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs mt-4">
                {requests && requests.slice(0,3).map((file) => (
                  <div
                    key={file.property}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] text-black">
                        {file.property}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                       {file.type} · Updated{" "}
                       {new Date(file.updatedAt.seconds * 1000).toLocaleString()}
                      </p>
                    </div>
                    <button className="inline-flex h-7 items-center gap-1 rounded-full border border-gray-300 bg-black px-2 text-[11px] text-white hover:bg-black/90">
                      Open
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Files Card */}
            <div className="card-elevated flex flex-col p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    {/*Recent Files*/}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    From your Vault workspace
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                  <FileText className="h-4 w-4 text-gray-700" />
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                {recentFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] text-black">
                        {file.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-500">
                        {file.status} · Updated {file.updated}
                      </p>
                    </div>
                    <button className="inline-flex h-7 items-center gap-1 rounded-full border border-gray-300 bg-black px-2 text-[11px] text-white hover:bg-black/90">
                      Open
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Pipeline Card */}
            <div className="card-elevated flex flex-col p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    {/*Active Pipeline*/}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Conversion by stage (last 30 days)
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-100">
                  <ArrowUpRight className="h-4 w-4 text-emerald-700" />
                </div>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3 text-xs">
                {pipeline.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-[11px] text-gray-500">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-black">
                        {item.value}%
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
