export type LatLng = { lat: number; lng: number };

export type ReverseGeocodeResult = {
  area: string;
  locality: string;
  city: string;
  formatted_address: string;
};

const CITIES: Array<LatLng & { name: string }> = [
  { name: "Kabul", lat: 34.5553, lng: 69.2075 },
  { name: "Herat", lat: 34.3529, lng: 62.204 },
  { name: "Mazar-i-Sharif", lat: 36.7069, lng: 67.1109 },
  { name: "Kandahar", lat: 31.6289, lng: 65.7372 },
  { name: "Jalalabad", lat: 34.4281, lng: 70.4558 },
];

function haversineKm(a: LatLng, b: LatLng) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function nearestCity(point: LatLng) {
  return CITIES.reduce((best, city) => {
    const d = haversineKm(point, city);
    return d < best.distance ? { city, distance: d } : best;
  }, { city: CITIES[0], distance: Infinity });
}

export function getDeviceLocation(): Promise<LatLng> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Location is not available on this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error("Location permission denied."));
        } else {
          reject(new Error("Could not read your location."));
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60_000 }
    );
  });
}

export async function reverseGeocode(point: LatLng): Promise<ReverseGeocodeResult> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (token) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${point.lng},${point.lat}.json?access_token=${token}&types=neighborhood,locality,place,district&limit=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = (await res.json()) as {
        features?: Array<{
          text?: string;
          place_name?: string;
          context?: Array<{ id: string; text: string }>;
        }>;
      };
      const feature = data.features?.[0];
      if (feature) {
        const place =
          feature.context?.find((c) => c.id.startsWith("place"))?.text ??
          nearestCity(point).city.name;
        const locality =
          feature.context?.find((c) => c.id.startsWith("district"))?.text ??
          feature.text ??
          "Locality";
        return {
          area: feature.text ?? locality,
          locality,
          city: place,
          formatted_address: feature.place_name ?? `${locality}, ${place}`,
        };
      }
    }
  }

  const nearest = nearestCity(point);
  return {
    area: nearest.city.name,
    locality: nearest.distance < 25 ? "City center" : "Nearby area",
    city: nearest.city.name,
    formatted_address: `${nearest.city.name}, Afghanistan`,
  };
}

export const maps = {
  provider: "mapbox" as const,
  getDeviceLocation,
  reverseGeocode,
  nearestCity,
};
