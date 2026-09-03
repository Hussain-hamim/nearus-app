"use client";

import { useCallback, useEffect, useState } from "react";
import { getDeviceLocation, reverseGeocode, type LatLng } from "@/lib/maps";

export type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "ready";
      coords: LatLng;
      area: string;
      city: string;
      locality: string;
      formatted_address: string;
      preview?: boolean;
    }
  | { status: "denied"; message: string }
  | { status: "error"; message: string };

const KABUL: LatLng = { lat: 34.532, lng: 69.1715 };

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: "idle" });

  const request = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const coords = await getDeviceLocation();
      const place = await reverseGeocode(coords);
      setState({ status: "ready", coords, ...place });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not read your location.";
      if (message.toLowerCase().includes("denied")) {
        setState({ status: "denied", message });
      } else {
        setState({ status: "error", message });
      }
    }
  }, []);

  const previewKabul = useCallback(async () => {
    setState({ status: "loading" });
    const place = await reverseGeocode(KABUL);
    setState({
      status: "ready",
      coords: KABUL,
      ...place,
      area: "Shar-e-Naw",
      city: "Kabul",
      locality: "Shar-e-Naw",
      preview: true,
    });
  }, []);

  useEffect(() => {
    // Request GPS once on mount — Home location permission, not derived UI state.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- geolocation API
    void request();
  }, [request]);

  return { state, request, previewKabul };
}
