import { IPLocationProvider } from "@/lib/contexts/GeoLocationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //  We could use gps/ip. gps has abit of restrictions like browser compatibilty and hardware device permissions. Personally, will recommend ip
  return <IPLocationProvider method="gps">{children}</IPLocationProvider>;
}
