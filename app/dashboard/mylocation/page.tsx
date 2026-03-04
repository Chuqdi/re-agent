"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSearchParams } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  Polyline,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { getShowing } from "@/lib/firebase/firestore";
import { IRequest, Showing } from "@/types";
import { useGeoLocation } from "@/lib/contexts/GeoLocationContext";
import { mapContainerStyle, mapLineStyleOptions } from "@/lib/utils";

// --- Types & Demo Data ---
type LocationAgent = {
  id: string;
  name: string;
  initials: string;
  lat: number;
  lng: number;
  showingId: string;
};

const demoAgents: LocationAgent[] = [
  {
    id: "a1",
    name: "You",
    initials: "YU",
    lat: 6.4281,
    lng: 3.4219,
    showingId: "s1",
  },
  {
    id: "a2",
    name: "Sarah Lin",
    initials: "SL",
    lat: 6.446,
    lng: 3.4756,
    showingId: "s2",
  },
];

function MyLocationContent() {
  const searchParams = useSearchParams();
  const search = useSearchParams();
  const { location, error: locationError } = useGeoLocation();

  const selectedRequests = useMemo(() => {
    if (search.get("data")) {
      return JSON.parse(search.get("data")!) as IRequest;
    }
  }, [search]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

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
          <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                My Location
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                View your shared location for the showing.
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {selectedRequests ? (
                <span>
                  Showing:{" "}
                  <span className="font-mono text-[11px] text-black">
                    {selectedRequests &&
                      `${selectedRequests.city},${selectedRequests.state}`}
                  </span>
                </span>
              ) : (
                <span className="text-black-500 font-medium text-[11px]">
                  Loading...{/*No showing specified in the URL*/}
                </span>
              )}
            </div>
          </header>

          <section className="card-elevated flex-1 overflow-hidden relative min-h-[400px]">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location!}
              zoom={14}
            >
              {location && selectedRequests?.coordinates && (
                <Polyline
                  key={selectedRequests?.coordinates?.lat}
                  path={[location, selectedRequests?.coordinates]}
                  options={mapLineStyleOptions}
                />
              )}

              {location && <Marker position={location} title="Your location" />}

              {selectedRequests?.coordinates && (
                <Marker
                  position={selectedRequests?.coordinates}
                  title="Request Location"
                />
              )}
            </GoogleMap>
          </section>
        </div>
      )}
    </AppShell>
  );
}

export default function MyLocationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-sm text-gray-500 animate-pulse">
            Initializing live view...
          </div>
        </div>
      }
    >
      <MyLocationContent />
    </Suspense>
  );
}
