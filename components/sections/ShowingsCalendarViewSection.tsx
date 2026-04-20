import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventContentArg } from "@fullcalendar/core";
import { useRef, useState } from "react";
import clsx from "clsx";

export interface IShowing {
  id: string;
  showingID: string;
  address: string;
  city: string;
  state: string;
  coordinates: { lat: number; lng: number };
  showingTime: string;
  invitee: string;
  createdAt: string;
  updatedAt: string;
}

type CalendarView = "timeGridDay" | "timeGridWeek" | "dayGridMonth";

const VIEW_OPTIONS: { label: string; value: CalendarView }[] = [
  { label: "Day", value: "timeGridDay" },
  { label: "Week", value: "timeGridWeek" },
  { label: "Month", value: "dayGridMonth" },
];

function parseShowingDateTime(showing: IShowing): Date | null {
  const timeStr = showing.showingTime;
  if (!timeStr) return null;

  const direct = new Date(timeStr);
  if (!isNaN(direct.getTime()) && timeStr.includes("T")) {
    return direct;
  }

  const baseDate = showing.createdAt ? new Date(showing.createdAt) : new Date();

  const normalized = timeStr
    .replace(/([ap]m)/i, " $1")
    .trim()
    .toUpperCase();

  const dateStr = `${baseDate.toDateString()} ${normalized}`;
  const parsed = new Date(dateStr);

  if (isNaN(parsed.getTime())) {
    console.warn(
      `Could not parse showingTime: "${timeStr}" for showing ${showing.id}`,
    );
    return null;
  }

  return parsed;
}

function mapShowingToEvent(showing: IShowing) {
  const start = parseShowingDateTime(showing);

  if (!start) return null;

  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1hr

  return {
    id: showing.id,
    title: showing.address,
    start: start.toISOString(),
    end: end.toISOString(),
    extendedProps: {
      showingID: showing.showingID,
      address: `${showing.address}, ${showing.city}, ${showing.state}`,
      invitee: showing.invitee,
    },
  };
}

type CalendarEvent = NonNullable<ReturnType<typeof mapShowingToEvent>>;

function renderEventContent(arg: EventContentArg) {
  const { invitee } = arg.event.extendedProps as {
    address: string;
    invitee: string;
  };
  const time = arg.event.start?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <div className="rounded-lg border-none border-sky-500/30 bg-sky-50 px-2 py-1.5 text-[11px] text-sky-800 mx-2 overflow-hidden">
      <p className="text-[11px] font-medium text-sky-900 break-words whitespace-normal">
        {arg.event.title}
      </p>
      <p className="text-[10px] text-sky-800 break-words whitespace-normal">
        {time} · {invitee}
      </p>
    </div>
  );
}

interface Props {
  showings: IShowing[];
}

function ShowingsCalendarViewSection({ showings }: Props) {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState<CalendarView>("timeGridDay");
  const [title, setTitle] = useState("");

  const getApi = () => calendarRef.current?.getApi();

  // ✅ Using calendarEvents (filtered) not showings.map(...)
  const calendarEvents = showings
    .map(mapShowingToEvent)
    .filter((e): e is CalendarEvent => e !== null);

  const switchView = (view: CalendarView) => {
    getApi()?.changeView(view);
    setCurrentView(view);
    setTitle(getApi()?.view.title ?? "");
  };

  const navigate = (dir: "prev" | "next" | "today") => {
    const api = getApi();
    if (dir === "prev") api?.prev();
    else if (dir === "next") api?.next();
    else api?.today();
    setTitle(api?.view.title ?? "");
  };

  return (
    <section className="card-elevated flex-1 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("today")}
            className="rounded-md border border-gray-200 px-3 py-1 text-[11px] font-medium text-gray-600 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => navigate("prev")}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            ‹
          </button>
          <button
            onClick={() => navigate("next")}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            ›
          </button>
          <span className="text-[13px] font-semibold text-gray-800">
            {title}
          </span>
        </div>
""
        <div className="flex gap-1 rounded-lg  p-1">
          {VIEW_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => switchView(value)}
              className={clsx(
                "rounded-full px-2 py-1.5 text-xs border transition-colors",
                {
                  "bg-black text-white": currentView === value,
                  "bg-white text-black hover:bg-black hover:text-white":
                    currentView !== value,
                },
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto text-[13px]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridDay"
          headerToolbar={false}
          weekends
          allDaySlot={false}
          height={580}
          events={calendarEvents}
          eventContent={renderEventContent}
          datesSet={() => setTitle(getApi()?.view.title ?? "")}
          views={{
            dayGridMonth: {
              dayCellContent: (arg) => {
                const day = arg.date.getDate();
                const month = arg.date.toLocaleString("default", {
                  month: "short",
                });
                return day === 1 ? `${month} ${day}` : `${day}`;
              },
            },
            timeGridWeek: {
              dayHeaderFormat: { weekday: "short", day: "numeric" }, 
            },
            timeGridDay: {
              dayHeaderFormat: { weekday: "long", day: "numeric" },
            },
          }}
        />
      </div>
    </section>
  );
}

export default ShowingsCalendarViewSection;
