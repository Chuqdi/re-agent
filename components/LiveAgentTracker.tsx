'use client';

import { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  startShowingMode,
  stopShowingMode,
  subscribeToActiveShowings,
  updateShowingLocation,
} from '@/lib/firebase/realtime';
import { getShowingsByAgent, getUsersByIds, updateShowing } from '@/lib/firebase/firestore';
import { Showing, ActiveShowingLocation } from '@/types';

interface LiveAgentTrackerProps {
  user: any;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function LiveAgentTracker({ user }: LiveAgentTrackerProps) {
  const [isShowingMode, setIsShowingMode] = useState(false);
  const [activeShowings, setActiveShowings] = useState<Record<string, ActiveShowingLocation>>({});
  const [userShowings, setUserShowings] = useState<Showing[]>([]);
  const [selectedShowing, setSelectedShowing] = useState<string>('');
  const [watchId, setWatchId] = useState<number | null>(null);
  const [agentNames, setAgentNames] = useState<Record<string, string>>({});
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Load user's showings
    const loadShowings = async () => {
      try {
        const showings = await getShowingsByAgent(user.uid);
        setUserShowings(showings);
      } catch (error) {
        console.error('Error loading showings:', error);
      }
    };

    loadShowings();

    // Subscribe to active showings
    const unsubscribe = subscribeToActiveShowings((showings) => {
      setActiveShowings(showings);
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  useEffect(() => {
    if (user?.uid) {
      setAgentNames((prev) => ({
        ...prev,
        [user.uid]: user.displayName || user.email,
      }));
    }
  }, [user.uid, user.displayName, user.email]);

  useEffect(() => {
    const loadAgentNames = async () => {
      const agentIds = Object.values(activeShowings || {}).map((showing) => showing.agentId);
      const missingIds = agentIds.filter((id) => id && !agentNames[id]);
      if (missingIds.length === 0) return;

      try {
        const profiles = await getUsersByIds(missingIds);
        const mapped: Record<string, string> = {};
        Object.entries(profiles).forEach(([uid, profile]) => {
          mapped[uid] = profile.fullName || profile.displayName || 'Agent';
        });
        setAgentNames((prev) => ({ ...prev, ...mapped }));
      } catch (error) {
        console.error('Error loading agent names:', error);
      }
    };

    loadAgentNames();
  }, [activeShowings, agentNames]);

  useEffect(() => {
    if (isShowingMode && selectedShowing) {
      // Start watching position
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateShowingLocation(selectedShowing, latitude, longitude);
          },
          (error) => {
            console.error('Geolocation error:', error);
            alert('Error getting location. Please enable location permissions.');
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
        setWatchId(id);
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    } else {
      // Stop watching position
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      if (!isShowingMode) {
        stopShowingMode();
      }
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isShowingMode, selectedShowing]);

  const handleToggleShowingMode = async () => {
    if (!selectedShowing && !isShowingMode) {
      alert('Please select a showing first');
      return;
    }

    if (isShowingMode) {
      // Stop showing mode
      setIsShowingMode(false);
      await stopShowingMode();
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    } else {
      // Start showing mode
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await startShowingMode(selectedShowing, latitude, longitude);
            setIsShowingMode(true);
          },
          (error) => {
            console.error('Geolocation error:', error);
            alert('Error getting location. Please enable location permissions.');
          }
        );
      }
    }
  };

  const handleCheckIn = async (showingId: string) => {
    try {
      await updateShowing(showingId, {
        status: 'in-progress',
        checkInTime: new Date(),
      });
      setSelectedShowing(showingId);
      // Reload showings
      const showings = await getShowingsByAgent(user.uid);
      setUserShowings(showings);
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in. Please try again.');
    }
  };

  const handleCheckOut = async (showingId: string) => {
    try {
      await updateShowing(showingId, {
        status: 'completed',
        checkOutTime: new Date(),
      });
      setIsShowingMode(false);
      await stopShowingMode();
      // Reload showings
      const showings = await getShowingsByAgent(user.uid);
      setUserShowings(showings);
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Failed to check out. Please try again.');
    }
  };

  // Convert active showings to markers
  const getLabelForAgent = (agentId: string) => {
    if (agentId === user.uid) {
      return agentNames[agentId] || 'You';
    }
    return agentNames[agentId] || 'Agent';
  };

  const markers = Object.values(activeShowings).map((showing) => ({
    id: showing.agentId,
    position: { lat: showing.latitude, lng: showing.longitude },
    label: getLabelForAgent(showing.agentId),
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Live Agent Tracker</h2>

        {/* Showing Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Showing
          </label>
          <select
            value={selectedShowing}
            onChange={(e) => setSelectedShowing(e.target.value)}
            disabled={isShowingMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select a showing --</option>
            {userShowings
              .filter((s) => s.status === 'scheduled' || s.status === 'in-progress')
              .map((showing) => (
                <option key={showing.id} value={showing.id}>
                  {showing.title} - {new Date(showing.startTime).toLocaleString()}
                </option>
              ))}
          </select>
        </div>

        {/* Showing Mode Toggle */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleToggleShowingMode}
            disabled={!selectedShowing}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isShowingMode
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
            }`}
          >
            {isShowingMode ? 'Stop Showing Mode' : 'Start Showing Mode'}
          </button>
          {isShowingMode && (
            <span className="text-green-600 font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
              Live tracking active
            </span>
          )}
        </div>

        {/* Upcoming Showings */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Upcoming Showings</h3>
          <div className="space-y-2">
            {userShowings
              .filter((s) => s.status === 'scheduled' || s.status === 'in-progress')
              .map((showing) => (
                <div
                  key={showing.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{showing.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(showing.startTime).toLocaleString()} -{' '}
                      {new Date(showing.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{showing.location}</p>
                  </div>
                  <div className="flex gap-2">
                    {showing.status === 'scheduled' && (
                      <button
                        onClick={() => handleCheckIn(showing.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Check In
                      </button>
                    )}
                    {showing.status === 'in-progress' && (
                      <button
                        onClick={() => handleCheckOut(showing.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                      >
                        Check Out
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Live Agent Locations</h3>
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={markers.length > 0 ? markers[0].position : defaultCenter}
              zoom={markers.length > 0 ? 13 : 10}
              onLoad={(map) => {
                mapRef.current = map;
              }}
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  label={marker.label}
                  title={marker.label}
                  icon={
                    marker.id === user.uid
                      ? {
                          path: window.google?.maps?.SymbolPath?.CIRCLE || '',
                          scale: 8,
                          fillColor: '#10B981',
                          fillOpacity: 1,
                          strokeColor: '#FFFFFF',
                          strokeWeight: 2,
                        }
                      : undefined
                  }
                />
              ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="h-[600px] flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">
              Google Maps API key not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to
              your environment variables.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

