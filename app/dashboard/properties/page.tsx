"use client";

import { AppShell } from "@/components/layout/AppShell";
import { getAllRequests,getAllProperties } from "@/lib/firebase/firestore";
import { IProperty, IRequest } from "@/types";
import { Plus, Search, Folder, FileText,Edit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



const tableCellClassname =
  "border-b border-gray-200 px-3 py-2 group-last:border-b-0 sm:px-4 sm:py-2.5";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<IProperty[]>();
  const router = useRouter();

  useEffect(() => {
    getAllProperties().then((r) => {
      console.log(r)
      setProperties(r);
    });
  }, []);
  return (
    <AppShell>
      {() => (
        <div className="flex h-full w-full min-w-0 max-w-full flex-col overflow-x-hidden text-black">
          <header className="mb-4 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Properties
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Centralized storage for  property listings
              </p>
            </div>
            <Link
              href="/dashboard/properties/add-new-property"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-300 bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-black/90"
            >
              <Plus className="h-3.5 w-3.5" color="white" />
              New
            </Link>
          </header>

          <div className="card-elevated mb-4 flex min-w-0 items-center gap-2 px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search files and folders"
              className="h-7 min-w-0 flex-1 bg-transparent text-xs text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <div className="w-full min-w-0 max-w-full overflow-x-auto">
            <table className="card-elevated min-w-[560px] w-full table-fixed border-separate border-spacing-0 text-[10px] text-gray-500 sm:min-w-[680px] sm:table-auto sm:text-[11px]">
              <thead>
                <tr>
                  {["Name", "Address", "City", "State", "Type","Status","Photos"].map(
                    (header) => (
                      <th
                        key={header}
                        className="border-b border-gray-200 px-3 py-2 text-left font-medium text-gray-600 sm:px-4 sm:py-2.5"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {properties?.map((item) => (
                  <tr key={`${item?.name}_${item?.propertyID}`} className="group hover:bg-gray-50">
                    <td className={tableCellClassname}>
                      <span className="block truncate text-[11px] text-black sm:text-[12px]">
                        {item?.name}
                      </span>
                    </td>

                    
                    {/*
                    <td className={tableCellClassname}>
                      <span className="block truncate text-[11px] text-black sm:text-[12px]">
                        {item?.amount}
                      </span>
                    </td>

                    <td className={tableCellClassname}>
                      <span className="text-[11px] text-gray-500">
                        {item?.createdAt?.toDate()?.toDateString()}
                      </span>
                    </td>
                */}

                   <td className={tableCellClassname}>
                      <span className="block truncate text-[11px] text-black sm:text-[12px]">
                        {item?.address}
                      </span>
                    </td>


                    <td className={tableCellClassname}>
                      <span className="block truncate text-[11px] text-black sm:text-[12px]">
                        {item?.city}
                      </span>
                    </td>

                    <td className={tableCellClassname}>
                      <span className="block truncate text-[11px] text-black sm:text-[12px]">
                        {item?.state}
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
                        <span className="truncate text-[11px] text-black capitalize sm:text-[12px]">
                          {item?.type}
                        </span>
                      </div>
                    </td>

                    <td className={tableCellClassname}>
                    <div className="flex items-center gap-2">
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
                    
                      <span className="inline-flex items-center justify-center border border-gray-300 text-gray-600 rounded-full">
                       <Edit   onClick={() => router.push(`properties/edit-property/${item.propertyID}`)} className="w-3 h-3" />
                      </span>
                    </div>

                    </td>



                    <td className={tableCellClassname}>
                      <span className="block truncate text-[11px] text-black sm:text-[12px]">
                        {item?.photos}
                      </span>
                    </td>


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
