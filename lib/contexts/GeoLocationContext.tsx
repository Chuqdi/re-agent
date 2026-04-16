"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase/config";

type LatLng = { lat: number; lng: number };

type IPLocationState = {
  location: LatLng | null;
  city: string | null;
  country: string | null;
  loading: boolean;
  error: string | null;
};

type LocationMethod = "ip" | "gps";

const DEFAULT_CENTER: LatLng = { lat: 6.5244, lng: 3.3792 };
const POLL_INTERVAL_MS = 30_000;

const GeoLocationContext = createContext<IPLocationState | null>(null);

export function IPLocationProvider({
  children,
  fallback = DEFAULT_CENTER,
  method = "ip", // 👈 default to IP
}: {
  children: ReactNode;
  fallback?: LatLng;
  method?: LocationMethod;
}) {
  const [state, setState] = useState<IPLocationState>({
    location: null,
    city: null,
    country: null,
    loading: true,
    error: null,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });
    return () => unsubscribe();
  }, []);

  const syncToFirestore = async (location: LatLng) => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, "users", userId), {
        address_coordinates: location,
        location_updated_at: new Date(),
      });
    } catch (err) {
      console.error("Failed to update location in Firestore:", err);
    }
  };

  useEffect(() => {
    if (method !== "gps") return;
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by this browser.",
      }));
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const location: LatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setState((prev) => ({
          ...prev,
          location,
          loading: false,
          error: null,
        }));

        await syncToFirestore(location);
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          location: fallback,
          loading: false,
          error: err.message,
        }));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [method, userId]);

  useEffect(() => {
    if (method !== "ip") return;

    let cancelled = false;

    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        if (!data.latitude || !data.longitude) {
          throw new Error("No coordinates in response");
        }


        const location: LatLng = { lat: data.latitude, lng: data.longitude };

        setState({
          location,
          city: data.city ?? null,
          country: data.country_name ?? null,
          loading: false,
          error: null,
        });

        await syncToFirestore(location);
      } catch (err) {
        if (cancelled) return;
        setState({
          location: fallback,
          city: null,
          country: null,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch location",
        });
      }
    };

    fetchLocation();
    intervalRef.current = setInterval(fetchLocation, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [method, userId]);

  return (
    <GeoLocationContext.Provider value={state}>
      {children}
    </GeoLocationContext.Provider>
  );
}

export function useGeoLocationContext() {
  const ctx = useContext(GeoLocationContext);
  if (!ctx) throw new Error("useIPLocation must be used within IPLocationProvider");
  return ctx;
}