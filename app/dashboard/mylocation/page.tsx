"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSearchParams } from "next/navigation";
import { getDistance } from "geolib";

import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  Polyline,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { getShowing } from "@/lib/firebase/firestore";
import { getAllUsers,getAllRequests,getShowingByID } from "@/lib/firebase/firestore";
import { IRequest,IUser, Showing } from "@/types";
import { useGeoLocation } from "@/lib/contexts/GeoLocationContext";
import { mapContainerStyle, mapLineStyleOptions } from "@/lib/utils";
import { Link, Plus, Search } from "lucide-react";

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

const tableCellClassname =
  "px-4 py-2.5 border-b border-gray-200 group-last:border-b-0";

function MyLocationContent() {
  const searchParams = useSearchParams();
  const search = useSearchParams();
  const { location, error: locationError } = useGeoLocation();

  const [users, setUsers] = useState<IUser[]>();

  useEffect(() => {
    getAllUsers().then((r) => {
      console.log(r)
      setUsers(r);
    });
  }, []);


  //const selectedRequests = useMemo(() => {
  //  if (search.get("data")) {
  //    return JSON.parse(search.get("data")!) as IRequest;
  //  }
  //}, [search]);


//i have to update state of selectedUser and searching firebase, so I can filter out users who have been invited
  const [selectedRequests, setSelectedRequests] = useState<any | null>(null);

useEffect(() => {
  const data = search.get("data");

  if (!data) return;

  const parsed = JSON.parse(data) as any; //used to be as IRequest

  setSelectedRequests(parsed);

  // fetch latest version from firestore
  getShowingByID(parsed.showingID).then((updatedShowing) => {
    if (updatedShowing) {
      setSelectedRequests(updatedShowing);
    }
  });
}, [search]);




  console.log("PAH COOL SCULTPING--->",selectedRequests)

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
        <>
        <div className="flex h-full min-w-0 flex-col text-black">
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


          <div className="flex h-full min-w-0 flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Invited Users
              </h1>
              <p className="mt-1 text-xs text-gray-500">
               Users invited to this location.
              </p>
            </div>
           
          </header>

          <div className="card-elevated mb-4 flex min-w-0 items-center gap-2 px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users"
              className="h-7 min-w-0 flex-1 bg-transparent text-xs text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <div className="w-full min-w-0 max-w-full overflow-x-auto">
            <table className="card-elevated min-w-[760px] w-full border-separate border-spacing-0 text-[11px] text-gray-500">
              <thead>
                <tr>
                  {["Name", "Display Name", "Email", "Date added", "Distance From Showing"].map(
                    (header) => (
                      <th
                        key={header}
                        className="border-b border-gray-200 px-4 py-2.5 text-left font-medium text-gray-600"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
              {users
            ?.filter((item) => {
              if (!selectedRequests?.invitees) return true;
              return !selectedRequests.invitees.includes(item.email);
            })
            .map((item) => {

                   const myLocation = {
                     latitude: 6.5244,
                     longitude: 3.3792
                   };

                 const distance = getDistance(
                  
                   //{ latitude:selectedRequests?.coordinates?.lng , longitude: selectedRequests?.coordinates?.lng },
                   { latitude:selectedRequests && selectedRequests.coordinates?selectedRequests.coordinates.lat:myLocation.latitude , longitude:selectedRequests && selectedRequests.coordinates?selectedRequests.coordinates.lng:myLocation.longitude },
                   { latitude: item.address_coordinates ? item.address_coordinates.lat:myLocation.latitude, longitude: item.address_coordinates ? item.address_coordinates.lng:myLocation.longitude }
                 );
              return(
                <tr key={`${item?.uid}`} className="group hover:bg-gray-50">
                  <td className={tableCellClassname}>
                    <span className="truncate text-[12px] text-black">
                      {item?.fullName}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <div className="flex min-w-0 items-center gap-2">
                     
                      <span className="truncate text-[12px] text-black capitalize">
                        {item?.displayName}
                      </span>
                    </div>
                  </td>

                  <td className={tableCellClassname}>
                    <span className="truncate text-[12px] text-black">
                      {item?.email}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <span className="text-[11px] text-gray-500">
                      {item?.createdAt?.toDate()?.toDateString()}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      "border border-sky-500/30 bg-sky-50 text-sky-700"
                      }`}
                    >
                      {(distance/1000) /*item.address_coordinates? `${item.address_coordinates.lat} , ${item.address_coordinates.lng}`  :" "*/}km
                    </span>
                  </td>
                </tr>
              )

              })}
              </tbody>
            </table>
          </div>
        </div>


        </div>


        </>



      )}
    </AppShell>
  );
}


 function UsersContent() {
  const [users, setUsers] = useState<IUser[]>();
 
  useEffect(() => {
    getAllUsers().then((r) => {
      console.log(r)
      setUsers(r);
    });
  }, []);

  return (
    <>
      
        <div className="flex h-full min-w-0 flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Invited Users
              </h1>
              <p className="mt-1 text-xs text-gray-500">
               Users invited to this location.
              </p>
            </div>
           
          </header>

          <div className="card-elevated mb-4 flex min-w-0 items-center gap-2 px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search users"
              className="h-7 min-w-0 flex-1 bg-transparent text-xs text-black placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <div className="w-full min-w-0 max-w-full overflow-x-auto">
            <table className="card-elevated min-w-[760px] w-full border-separate border-spacing-0 text-[11px] text-gray-500">
              <thead>
                <tr>
                  {["Name", "Display Name", "Email", "Date added", "GPS Location"].map(
                    (header) => (
                      <th
                        key={header}
                        className="border-b border-gray-200 px-4 py-2.5 text-left font-medium text-gray-600"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {users?.map((item) => (
                  <tr key={`${item?.uid}`} className="group hover:bg-gray-50">
                    <td className={tableCellClassname}>
                      <span className="truncate text-[12px] text-black">
                        {item?.fullName}
                      </span>
                    </td>

                  <td className={tableCellClassname}>
                    <div className="flex min-w-0 items-center gap-2">
                     
                      <span className="truncate text-[12px] text-black capitalize">
                        {item?.displayName}
                      </span>
                    </div>
                  </td>

                  <td className={tableCellClassname}>
                    <span className="truncate text-[12px] text-black">
                      {item?.email}
                    </span>
                  </td>

                  <td className={tableCellClassname}>
                    <span className="text-[11px] text-gray-500">
                      {item?.createdAt?.toDate()?.toDateString()}
                    </span>
                  </td>

                    <td className={tableCellClassname}>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        "border border-sky-500/30 bg-sky-50 text-sky-700"
                        }`}
                      >
                        { item.address_coordinates? `${item.address_coordinates.lat} , ${item.address_coordinates.lng}`  :" "}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      
    </>
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
      <>
       <MyLocationContent />
       {/*<UsersContent/>*/}
      </>
    </Suspense>
  );
}
