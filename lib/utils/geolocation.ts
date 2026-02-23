export interface GeocodeResult {
  lat: number;
  lng: number;
}

export async function getAddressGeoCoordinates(
  address: string,
): Promise<GeocodeResult> {
  if (!address) throw new Error("Address is required");

  const response = await fetch(
    `/api/geocode?address=${encodeURIComponent(address)}`,
  );
  if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

  const data = await response.json();
  if (data.error) throw new Error(`Geocoding failed: ${data.error}`);

  return { lat: data.lat, lng: data.lng };
}
