"use client";

import { AppShell } from "@/components/layout/AppShell";
import { getAllInvoices } from "@/lib/firebase/firestore";
import { IInvoice } from "@/types";
import { ArrowRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import moment from "moment";
import { getAuth } from "firebase/auth";

const tableCellClassname =
  "px-4 py-2.5 border-b border-gray-200 group-last:border-b-0";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  const auth = getAuth();
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      getAllInvoices(userId).then((r) => {
        setInvoices(r);
      });
    }
  }, [auth]);
  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Invoices
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Centralized storage for listings, contracts, and disclosure
                invoices.
              </p>
            </div>
            <Link
              href="/dashboard/invoices/add-new-invoice"
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
                {[
                  "Company Name",
                  "Address",
                  "Phone Number",
                  "Date added",
                  "Number of Items",
                ].map((header) => (
                  <th
                    key={header}
                    className="border-b border-gray-200 px-4 py-2.5 text-left font-medium text-gray-600"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {invoices?.map((item, index) => (
                <tr
                  key={`${item?.companyName}_${index}`}
                  className="group hover:bg-gray-50"
                >
                  <td className={tableCellClassname}>
                    <span className="truncate text-[12px] text-black">
                      {item?.companyName}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <div className="flex min-w-0 items-center gap-2">
                      {item.address}
                    </div>
                  </td>

                  <td className={tableCellClassname}>{item.phoneNumber}</td>

                  <td className={tableCellClassname}>
                    <span className="text-[11px] text-gray-500">
                      {moment(item.createdAt).format("ddd M YYYY")}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium 
                           "border border-emerald-500/30 bg-emerald-50 text-emerald-700"
                          
                      `}
                    >
                      {item?.items?.length}
                    </span>
                  </td>

                  <td>
                    <Link
                      href={`/dashboard/invoices/edit-invoice/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-black px-2 py-1 text-[11px] text-white hover:bg-black/90"
                    >
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Link>
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
