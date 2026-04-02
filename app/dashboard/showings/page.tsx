"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllShowings } from "@/lib/firebase/firestore";
import { IShowing } from "@/types";
import ShowingsCalendarSection from "@/components/sections/ShowingsCalendarSection";

export default function ShowingsPage() {
  const [showings, setShowings] = useState<IShowing[]>();

  useEffect(() => {
    getAllShowings().then((data) => setShowings(data));
  }, []);

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Showings
              </h1>
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

          {showings && <ShowingsCalendarSection showings={showings} />}
        </div>
      )}
    </AppShell>
  );
}
