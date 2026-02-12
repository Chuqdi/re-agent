"use client";

import { AppShell } from "@/components/layout/AppShell";
import { getAllContacts, getAllRequests } from "@/lib/firebase/firestore";
import { IContact } from "@/lib/firebase/types";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

const demoClients: ClientRow[] = [
  {
    id: "1",
    name: "Emeka Adaku",
    phone: "+2349035568126",
    email: "emeka.adaku@example.com",
  },
  {
    id: "2",
    name: "Timi Egbuson",
    phone: "+2348063779239",
    email: "timiegbuson@acmerelocation.com",
  },
  {
    id: "3",
    name: "Ikem Anyaoku",
    phone: "+2348183763331",
    email: "ikem.anyaoku@example.com",
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<IContact[]>();
  useEffect(() => {
    getAllContacts().then((r) => {
      setContacts(r);
    });
  }, []);

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Contacts
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Agent List of your active buyers, sellers, and relocation
                partners.
              </p>
            </div>
            <Link
              href="/contacts/add-new-contacts"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-black text-xs font-medium text-white px-3 py-1.5 hover:bg-black/90"
            >
              <Plus className="h-3.5 w-3.5" color="white" />
              New
            </Link>
          </header>

          <section className="card-elevated flex-1 overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-2 text-[11px] text-gray-500">
              <div className="grid grid-cols-[minmax(0,2fr)_140px_minmax(0,2fr)_80px] gap-3">
                <span>Contact Name</span>
                <span>Phone</span>
                <span>Email</span>
                <span className="text-right">Actions</span>
              </div>
            </div>
            <div className="max-h-[540px] overflow-auto text-xs">
              {contacts?.map((client) => (
                <div
                  key={client.id}
                  className="border-b border-gray-200 px-4 py-2.5 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="grid grid-cols-[minmax(0,2fr)_140px_minmax(0,2fr)_80px] items-center gap-3">
                    <span className="text-[12px] text-black">
                      {client?.firstName} {client?.lastName}
                    </span>
                    <span className="text-[11px] text-gray-600">
                      {client?.phoneNumber}
                    </span>
                    <span className="truncate text-[11px] text-gray-600">
                      {client.email}
                    </span>
                    <div className="flex justify-end">
                      <button className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-black px-2 py-1 text-[11px] text-white hover:bg-black/90">
                        View
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
