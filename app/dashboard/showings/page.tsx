"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

type ViewMode = "month" | "week" | "day";

type ShowingEvent = {
  id: string;
  title: string;
  time: string;
  address: string;
};

const demoEvents: ShowingEvent[] = [
  {
    id: "1",
    title: "Showing • 2418 Maple St",
    time: "10:30 – 11:15",
    address: "San Francisco, CA",
  },
  {
    id: "2",
    title: "Showing • 884 Cedar Ave",
    time: "13:00 – 13:45",
    address: "Oakland, CA",
  },
  {
    id: "3",
    title: "Final Walkthrough • Lin Family",
    time: "16:00 – 17:00",
    address: "San Mateo, CA",
  },
];

export default function ShowingsPage() {
  const [view, setView] = useState<ViewMode>("week");

  const openNewShowingModal = (slotLabel: string) => {
    // Placeholder for modal trigger
    console.log("Open New Showing modal for slot:", slotLabel);
  };

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Showings
              </h1>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60">
                <button
                  className={clsx(
                    "rounded-full px-2 py-1.5 text-xs border transition-colors",
                    {
                      "bg-black text-white": view === "month",
                      "bg-white text-black hover:bg-black hover:text-white":
                        view !== "month",
                    },
                  )}
                  onClick={() => setView("month")}
                >
                  Month
                </button>
                <button
                  className={clsx(
                    "rounded-full px-2 py-1.5 text-xs border transition-colors",
                    {
                      "bg-black text-white": view === "week",
                      "bg-white text-black hover:bg-black hover:text-white":
                        view !== "week",
                    },
                  )}
                  onClick={() => setView("week")}
                >
                  Week
                </button>
                <button
                  className={clsx(
                    "rounded-full px-2 py-1.5 text-xs border transition-colors",
                    {
                      "bg-black text-white": view === "day",
                      "bg-white text-black hover:bg-black hover:text-white":
                        view !== "day",
                    },
                  )}
                  onClick={() => setView("day")}
                >
                  Day
                </button>
              </div>
            </div>

            <Link
              href="/dashboard/showings/add-new-showing"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-black text-xs font-medium text-white px-3 py-1.5 hover:bg-black/90"
            >
              <Plus className="h-3.5 w-3.5" color="white" />
              New
            </Link>
            {/* <div className="flex items-center gap-2 text-xs text-gray-600">
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-black hover:text-white">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div> */}
          </header>

          <section className="card-elevated flex-1 overflow-hidden">
            {/* Calendar header row (hours) */}
            <div className="flex border-b border-gray-200 text-[11px] text-gray-500">
              <div className="w-16 border-r border-gray-200 px-2 py-2">
                Time
              </div>
              <div className="flex-1 px-2 py-2">Today</div>
            </div>

            {/* Time slots */}
            <div className="max-h-[600px] overflow-auto text-xs">
              {Array.from({ length: 10 }).map((_, idx) => {
                const hour = 9 + idx;
                const label = `${hour}:00`;
                const hasEvent = demoEvents.find((e) =>
                  e.time.startsWith(hour.toString()),
                );
                return (
                  <div
                    key={label}
                    className="flex border-b border-gray-200"
                    onClick={() => openNewShowingModal(label)}
                  >
                    <div className="w-16 border-r border-gray-200 px-2 py-3 text-[11px] text-gray-500">
                      {label}
                    </div>
                    <div className="relative flex-1 px-2 py-2">
                      {hasEvent && (
                        <div className="rounded-lg border border-sky-500/30 bg-sky-50 px-2 py-1.5 text-[11px] text-sky-800">
                          <p className="text-[11px] font-medium text-sky-900">
                            {hasEvent.title}
                          </p>
                          <p className="text-[10px] text-sky-800">
                            {hasEvent.time} • {hasEvent.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
