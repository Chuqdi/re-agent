import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address)
    return NextResponse.json({ error: "Address required" }, { status: 400 });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const response = await fetch(url);

  const data = await response.json();
//   return data["results"][0]?.geometry?.location;

  if (data.status !== "OK") {
    return NextResponse.json({ error: data.status }, { status: 400 });
  }

  const { lat, lng } = data.results[0]?.geometry?.location;
  return NextResponse.json({ lat, lng });
}
