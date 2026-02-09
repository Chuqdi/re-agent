"use client";

import { AppShell } from "@/components/layout/AppShell";
import { getAllRequests } from "@/lib/firebase/firestore";
import { IRequest } from "@/lib/firebase/types";
import { Plus, Search, Folder, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const tableCellClassname =
  "px-4 py-2.5 border-b border-gray-200 group-last:border-b-0";

export default function RequestsPage() {
  const [requests, setRequests] = useState<IRequest[]>();
  useEffect(() => {
    getAllRequests().then((r) => {
      setRequests(r);
    });
  }, []);
  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Requests
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Centralized storage for listings, contracts, and disclosure
                packets.
              </p>
            </div>
            <Link
              href="/requests/add-new-request"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-black text-xs font-medium text-white px-3 py-1.5 hover:bg-black/90"
            >
              <Plus className="h-3.5 w-3.5" color="white" />
              New
            </Link>
          </header>

          <div className="card-elevated mb-4 flex items-center gap-2 px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search files and folders"
              className="h-7 flex-1 bg-transparent text-xs text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <table className="w-full border-separate border-spacing-0 text-[11px] text-gray-500 card-elevated">
            <thead>
              <tr>
                {["Property", "Type", "Amount", "Date added", "Status"].map(
                  (header) => (
                    <th
                      key={header}
                      className="border-b border-gray-200 px-4 py-2.5 text-left font-medium text-gray-600"
                    >
                      {header}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {requests?.map((item) => (
                <tr key={item?.property} className="group hover:bg-gray-50">
                  <td className={tableCellClassname}>
                    <span className="truncate text-[12px] text-black">
                      {item?.property}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                        {item.type === "buy" ? (
                          <Folder className="h-3.5 w-3.5 text-gray-700" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-gray-700" />
                        )}
                      </div>
                      <span className="truncate text-[12px] text-black capitalize">
                        {item?.type}
                      </span>
                    </div>
                  </td>

                  <td className={tableCellClassname}>
                    <span className="truncate text-[12px] text-black">
                      {item?.amount}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <span className="text-[11px] text-gray-500">
                      {item?.createdAt?.toDate()?.toDateString()}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.status === "Active"
                          ? "border border-emerald-500/30 bg-emerald-50 text-emerald-700"
                          : item.status === "Closed"
                            ? "border border-gray-300 bg-gray-100 text-gray-700"
                            : "border border-sky-500/30 bg-sky-50 text-sky-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
