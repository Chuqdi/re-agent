"use client";

import { AppShell } from "@/components/layout/AppShell";
import { getAllRequests, getShowings } from "@/lib/firebase/firestore";
import { IRequest, Showing } from "@/types";
import { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import { useGeoLocation } from "@/lib/contexts/GeoLocationContext";
import { mapContainerStyle, mapLineStyleOptions } from "@/lib/utils";

type LocationAgent = {
  id: string;
  name: string;
  initials: string;
  lat: number;
  lng: number;
  showingId: string;
};

type ShowingFilter = {
  id: string;
  label: string;
};

const demoShowings: ShowingFilter[] = [
  { id: "all", label: "All Showings" },
  { id: "s1", label: "2418 Maple St • 10:30" },
  { id: "s2", label: "884 Cedar Ave • 13:00" },
];

const demoAgents: LocationAgent[] = [
  {
    id: "a1",
    name: "You",
    initials: "YU",
    lat: 37.7749,
    lng: -122.4194,
    showingId: "s1",
  },
  {
    id: "a2",
    name: "Sarah Lin",
    initials: "SL",
    lat: 37.7849,
    lng: -122.4094,
    showingId: "s2",
  },
];

export default function LocationPage() {
  const { location, error: locationError } = useGeoLocation();
  const [requests, setRequests] = useState<IRequest[]>();
  const [selectedRequestID, setSelectedRequestID] = useState<string>();
  const [filter, setFilter] = useState<string>("all");
  const [inviteEmail, setInviteEmail] = useState("");
  const [allShowings, setAllShowings] = useState<Showing[]>([]);
  const hasMapsKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  // ✅ Synchronous derivation — no useEffect or useState needed
  const selectedRequest = useMemo(
    () => requests?.find((r) => r?.id === selectedRequestID),
    [requests, selectedRequestID],
  );

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

  useEffect(() => {
    getAllRequests().then((r) => {
      setRequests(r);
    });
  }, []);

  const handleInvite = () => {
    if (!selectedRequest) {
      window.alert("Please select a showing first!");
      return;
    }
    if (selectedRequest?.coordinates) {
      const url = `/dashboard/mylocation?data=${encodeURIComponent(
        JSON.stringify(selectedRequest),
      )}`;

      window.open(url, "_blank");
    }
    setInviteEmail("");
  };

  const filteredAgents = useMemo(
    () =>
      filter === "all"
        ? demoAgents
        : demoAgents.filter((agent) => agent.showingId === filter),
    [filter],
  );

  if (!isLoaded) {
    return (
      <AppShell>
        {() => (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Loading map…
          </div>
        )}
      </AppShell>
    );
  }

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          {/* Header */}
          <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Live Location
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Track agents in the field and share secure location links.
              </p>
              {!!locationError && (
                <p className="mt-1 text-xs text-amber-600">⚠ {locationError}</p>
              )}
            </div>

            {/* Invite bar */}
            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Invite agent by email"
                className="h-7 flex-1 bg-transparent text-xs text-black placeholder:text-gray-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleInvite}
                className="inline-flex h-7 items-center rounded-full bg-black px-3 text-[11px] font-medium text-white hover:bg-black/90"
              >
                Send Invite
              </button>
            </div>
          </header>

          {/* Filters */}
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-600">
            {!!requests?.length && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-1">
                <span className="text-[11px] text-gray-500">Showing</span>
                <select
                  value={selectedRequestID}
                  onChange={(e) => setSelectedRequestID(e.target.value)}
                  className="bg-white text-xs text-black focus:outline-none"
                >
                  <option value="">— select —</option>
                  {requests?.map((request) => (
                    <option key={request?.id} value={request?.id}>
                      {request?.property}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <span className="text-[11px] text-gray-500">
              {filteredAgents.length} active agent
              {filteredAgents.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Map area */}
          <section className="card-elevated flex-1 overflow-hidden">
            {hasMapsKey ? (
              <div className="h-full w-full">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={location!}
                  zoom={14}
                >
                  {/* ✅ Only renders when both location and selected request coordinates exist */}
                  {location && selectedRequest?.coordinates && (
                    <Polyline
                      key={selectedRequestID} // 👈 forces remount on request change
                      path={[location, selectedRequest.coordinates]}
                      options={mapLineStyleOptions}
                    />
                  )}

                  {location && (
                    <Marker position={location} title="Your location" />
                  )}

                  {selectedRequest?.coordinates && (
                    <Marker
                      position={selectedRequest.coordinates}
                      title="Request Location"
                    />
                  )}

                  {filteredAgents
                    .filter((a) => a.id !== "a1")
                    .map((agent) => (
                      <Marker
                        key={agent.id}
                        position={{ lat: agent.lat, lng: agent.lng }}
                        title={agent.name}
                      />
                    ))}
                </GoogleMap>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-white">
                <div className="h-40 w-40 rounded-full border border-dashed border-gray-300 bg-gradient-to-br from-gray-100 to-transparent" />
                <div className="text-center text-xs text-gray-600">
                  <p className="font-medium text-black">Map not configured</p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Add{" "}
                    <span className="font-mono text-[10px] text-black">
                      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                    </span>{" "}
                    to your environment to render live agent locations.
                  </p>
                  <div className="mt-3 flex justify-center gap-2 text-[11px] text-gray-600">
                    {filteredAgents.map((agent) => (
                      <span
                        key={agent.id}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5"
                      >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-black">
                          {agent.initials}
                        </span>
                        <span>{agent.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}
