"use client";

import { AppShell } from "@/components/layout/AppShell";
import {
  getAllInvitedUsers,
  getShowings,
  getUsersByEmails,
  updateShowingInvitees,
} from "@/lib/firebase/firestore";
import moment from "moment";
import { IInvitedUser, Showing, User } from "@/types";
import { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useGeoLocation } from "@/lib/contexts/GeoLocationContext";
import {
  formatFirestoreDate,
  getDistanceInKm,
  mapContainerStyle,
  mapLineStyleOptions,
} from "@/lib/utils";
import Input from "@/components/ui/Input";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";

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

const ListShowingInvitees = ({
  showingCoords,
  invitees,
}: {
  showingCoords: { lat: number; lng: number };
  invitees: string[];
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<IInvitedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IInvitedUser[]>([]);
  const [searchValue] = useDebounce(searchText, 1000);

  useEffect(() => {
    getAllInvitedUsers(/*invitees*/)
      .then((data) => {
        setUsers(data);
        console.log("hERE");
        //console.log(data?.[0]?.address_coordinates);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredUsers(users);
      return;
    }

    const lowerCaseSearch = searchValue.toLowerCase();

    const filtered = users.filter(
      (user) =>
       // user?.fullName?.toLowerCase().includes(lowerCaseSearch) ||
        user?.email?.toLowerCase().includes(lowerCaseSearch),
    );

    setFilteredUsers(filtered);
  }, [searchValue, users]);
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold">Invited Users</h3>
        <p>Users invited to this location</p>
        <Input
          value={searchText}
          leftIcon={<Search color="#4646466f" />}
          className="!rounded-[1rem] h-[3.5rem]"
          placeholder="Search Users"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center animate-pulse text-gray-600">
          Loading...
        </div>
      )}

      <table className="w-full border-separate border-spacing-0 text-[11px] text-gray-500 card-elevated">
        <thead>
          <tr>
            {[
              /*"Name",
              "Display Name",*/
              "Email",
              "Date added",
              "Distance from showing",
            ].map((header) => (
              <th
                key={header}
                className="border-b border-gray-200 px-4 py-2.5 text-left font-medium text-gray-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredUsers?.map((user, index) => (
            <tr
              key={`${user?.email}_${index}`}
              className="group hover:bg-gray-50"
            >
              {/*<td className="px-4 py-2.5 border-b border-gray-200 group-last:border-b-0">
                <span className="truncate text-[12px] text-black">
                  {user?.fullName}
                </span>
          </td>*/}

              {/*<td className="px-4 py-2.5 border-b border-gray-200 group-last:border-b-0">
                <span className="truncate text-[12px] text-black">
                  {user?.displayName}
                </span>
              </td>*/}

              <td className="px-4 py-2.5 border-b border-gray-200 group-last:border-b-0">
                <span className="truncate text-[12px] text-black">
                  {user?.email}
                </span>
              </td>

              <td className="px-4 py-2.5 border-b border-gray-200 group-last:border-b-0">
                <span className="truncate text-[12px] text-black">
                  {user?.createdAt && formatFirestoreDate(user.createdAt)}
                </span>
              </td>

              <td className="px-4 py-2.5 border-b border-gray-200 group-last:border-b-0">
                <span className="truncate border border-blue-200 p-2 bg-blue-100 rounded-full text-[12px] text-black">
                  {/*user.address_coordinates &&*/
                    showingCoords &&
                    getDistanceInKm(
                      Number(6.34 /*user.address_coordinates.lat*/),
                      Number(4.08 /*user.address_coordinates.lng*/),
                      Number(showingCoords?.lat),
                      Number(showingCoords?.lng),
                    ).toFixed(2)+'KM'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default function LocationPage() {
  const { location, error: locationError } = useGeoLocation();
  const [requests, setRequests] = useState<Showing[]>(); //march 31st 2026  -will change variable later
  const [selectedRequestID, setSelectedRequestID] = useState<string>();

  const [filter, setFilter] = useState<string>("all");
  const [inviteEmail, setInviteEmail] = useState("");
  const [allShowings, setAllShowings] = useState<Showing[]>([]);
  const hasMapsKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  //OLD APPLICATION STYLE
  // ✅ Synchronous derivation — no useEffect or useState needed
  // const selectedRequest = useMemo(
  //   () => requests?.find((r) => r?.id === selectedRequestID),
  //   [requests, selectedRequestID],
  // );

  const [selectedRequest, setSelectedRequest] = useState<Showing | undefined>(); //could be IRequest or showing
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredUsers =
    inviteEmail.trim() === ""
      ? selectedRequest?.invitees || []
      : selectedRequest?.invitees?.filter((email: string) =>
          email.toLowerCase().includes(inviteEmail.toLowerCase()),
        ) || [];

  useEffect(() => {
    getShowings().then((r) => {
      setRequests(r);
    });
  }, []);

  useEffect(() => {
    if (!allShowings || !selectedRequestID) return;

    const found = allShowings.find((r) => r?.showingID === selectedRequestID);
    setSelectedRequest(found);
  }, [allShowings, selectedRequestID]);

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

  console.log(selectedRequest);

  const emailHTML = `
      <p> <strong>Hello, </strong>,</p>
    
      <p>You have been invited to view the property:
      
      ${selectedRequest && selectedRequest?.property}
      </p>
    
     

      <p >
        <a 
          href="https://re-agents-iota.vercel.app/dashboard/mylocation?data=${encodeURIComponent(JSON.stringify(selectedRequest))}" 
          target="_blank"
          style="color:black; text-decoration:none;"
        >
          Please Click Here to view
        </a>
    </p>


     
      <br/><br/>
      <p>Warm Regards,</p>
      <p>– John</p>




    <br/><br/>
    
    <p style="text-align:center; font-size:12px; color:#888; margin:20px 0;">
        <a 
          href="https://re-agents-iota.vercel.app/dashboard" 
          target="_blank"
          style="color:#888; text-decoration:none;"
        >
          Powered by RE-agents
        </a>
    </p>
    
    `;

  //const handleInvite = () => {
  //  if (!selectedRequest) {
  //    window.alert("Please select a showing first!");
  //    return;
  //  }
  //  if (selectedRequest?.coordinates) {
  //    const url = `/dashboard/mylocation?data=${encodeURIComponent(
  //      JSON.stringify(selectedRequest),
  //    )}`;
  //
  //    window.open(url, "_blank");
  //  }
  //  setInviteEmail("");
  //
  //
  //
  //};

  const handleInvite = async () => {
    if (!selectedRequest) {
      window.alert("Please select a showing first!");
      return;
    }

    try {
      // updateShowingInvitees()

      await updateShowingInvitees(
        selectedRequest && selectedRequest.showingID,
        inviteEmail,
      );

      const res = await fetch("https://nurturer-sendgrid-backend.vercel.app/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: inviteEmail && inviteEmail,
          subject: "Your Invitation to Our Showing",
          htmlMessage: emailHTML,
          name: "John Test",
          userEmail: "info@nurturer.ai", //change to re-agents later
        }),
      });

      const result = await res.json();

      if (result.success) {
        console.log("Email sent!");
        setInviteEmail("");

        if (selectedRequest?.coordinates) {
          const url = `/dashboard/mylocation?data=${encodeURIComponent(
            JSON.stringify(selectedRequest),
          )}`;

          window.open(url, "_blank");
        }
      } else {
        console.error("Email failed");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
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
              {/*!!locationError && (
                <p className="mt-1 text-xs text-amber-600">⚠ {locationError}</p>
              )*/}
            </div>

            <div className="relative w-full max-w-md">
              {/* Invite bar */}
              <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay so click works
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

              {/* Dropdown */}
              {showDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-md">
                  {filteredUsers.map((email: string, index: number) => (
                    <div
                      key={index}
                      onClick={() => {
                        setInviteEmail(email);
                        setShowDropdown(false);
                      }}
                      className="cursor-pointer px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      {email}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Filters */}
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-600">
            {!!allShowings?.length && (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-1">
                <span className="text-[11px] text-gray-500">Showing</span>
                <select
                  value={selectedRequestID}
                  onChange={(e) => {
                    console.log("WHAT IS E.TARGET.VALUE--->", e.target.value);
                    setSelectedRequestID(
                      e.target.value && e.target.value,
                    ); /*setSelectedRequest(e.target.value)*/
                  }}
                  className="bg-white text-xs text-black focus:outline-none"
                >
                  <option value="">— select —</option>
                  {allShowings?.map((showing) => (
                    <option key={showing?.showingID} value={showing?.showingID}>
                      {showing?.address}
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
          <section className="card-elevated flex-1 flex flex-col gap-8 overflow-hidden">
            {hasMapsKey ? (
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

            {selectedRequest?.invitees?.length && (
              <ListShowingInvitees
                showingCoords={selectedRequest.coordinates}
                invitees={selectedRequest?.invitees}
              />
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}
