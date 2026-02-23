// hooks/useGeolocation.ts
import { useEffect, useRef, useState } from "react";

type LatLng = { lat: number; lng: number };

type GeolocationState = {
  location: LatLng | null;
  error: GeolocationPositionError | null;
  loading: boolean;
};

export function useGeolocation(fallback?: LatLng) {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: true,
  });
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ location: fallback ?? null, error: null, loading: false });
      return;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState({
          location: fallback ?? null,
          error,
          loading: false,
        });
      },
      {
        enableHighAccuracy: isMobile,
        maximumAge: 30_000,
        timeout: 30_000,
      },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return state;
}