import { Timestamp } from 'firebase/firestore';


export const mapContainerStyle = {
  width: "100%",
  height: "80%",
};
export const mapLineStyleOptions = {
  strokeColor: "#0000FF",
  strokeOpacity: 1.0,
  strokeWeight: 3,
};


export const formatFirestoreDate = (date: Timestamp | string | Date): string => {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDistanceInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const EARTH_RADIUS_KM = 6371;

  const toRad = (value: number): number => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};



type TimeBreakdown = {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  years: number;
};

type DistanceMatrixResult = {
  distanceKm: number;
  distanceMiles: number;
  duration: TimeBreakdown;
  raw: {
    totalSeconds: number;
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
  };
};

const AVERAGE_SPEED_KMH = 60; // average driving speed

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function secondsToBreakdown(totalSeconds: number): TimeBreakdown {
  const seconds = Math.floor(totalSeconds % 60);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const days = totalDays % 7;
  const weeks = Math.floor(totalDays / 7) % 4;
  const months = Math.floor(totalDays / 30) % 12;
  const years = Math.floor(totalDays / 365);

  return { seconds, minutes, hours, days, weeks, months, years };
}

export function calculateMatrixDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  speedKmh: number = AVERAGE_SPEED_KMH
): DistanceMatrixResult {
  const distanceKm = getDistanceKm(lat1, lng1, lat2, lng2);
  const distanceMiles = distanceKm * 0.621371;

  const totalHours = distanceKm / speedKmh;
  const totalSeconds = totalHours * 3600;
  const totalMinutes = totalHours * 60;
  const totalDays = totalHours / 24;

  return {
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    distanceMiles: parseFloat(distanceMiles.toFixed(2)),
    duration: secondsToBreakdown(totalSeconds),
    raw: {
      totalSeconds: parseFloat(totalSeconds.toFixed(2)),
      totalMinutes: parseFloat(totalMinutes.toFixed(2)),
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalDays: parseFloat(totalDays.toFixed(2)),
    },
  };
}

export function formatDuration(duration: TimeBreakdown): string {
  if (duration.years > 0)
    return `${duration.years}y ${duration.months}mo`;
  if (duration.months > 0)
    return `${duration.months}mo ${duration.weeks}w`;
  if (duration.weeks > 0)
    return `${duration.weeks}w ${duration.days}d`;
  if (duration.days > 0)
    return `${duration.days}d ${duration.hours}h`;
  if (duration.hours > 0)
    return `${duration.hours}h ${duration.minutes}m`;
  if (duration.minutes > 0)
    return `${duration.minutes}m ${duration.seconds}s`;
  return `${duration.seconds}s`;
}