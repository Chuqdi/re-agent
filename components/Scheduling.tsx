'use client';

import { useState, useEffect } from 'react';
import {
  getShowingsByAgent,
  createShowing,
  updateShowing,
} from '@/lib/firebase/firestore';
import { Showing } from '@/types';
import { signInWithGoogle } from '@/lib/firebase/auth';

interface SchedulingProps {
  user: any;
}

export default function Scheduling({ user }: SchedulingProps) {
  const [showings, setShowings] = useState<Showing[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(
    user?.providerData?.some((provider: any) => provider.providerId === 'google.com') || false
  );

  useEffect(() => {
    loadShowings();
  }, [user.uid]);

  const loadShowings = async () => {
    try {
      const data = await getShowingsByAgent(user.uid);
      setShowings(data);
    } catch (error) {
      console.error('Error loading showings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCalendar = async () => {
    try {
      setSyncing(true);
      
      // Get auth token
      const user = await import('firebase/auth').then(m => m.getAuth().currentUser);
      if (!user) {
        alert('Please sign in first');
        return;
      }
      
      const token = await user.getIdToken();
      
      // Call API route to sync calendar
      const response = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync calendar');
      }

      const result = await response.json();
      alert(`Successfully synced ${result.synced} showing(s) from Google Calendar`);
      
      // Reload showings
      await loadShowings();
    } catch (error: any) {
      console.error('Error syncing calendar:', error);
      alert(error.message || 'Failed to sync calendar. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      setGoogleLinked(true);
    } catch (error: any) {
      console.error('Error connecting Google:', error);
      alert(error?.message || 'Failed to connect Google account.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCheckIn = async (showingId: string) => {
    try {
      await updateShowing(showingId, {
        status: 'in-progress',
        checkInTime: new Date(),
      });
      await loadShowings();
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
      await loadShowings();
    } catch (error) {
      console.error('Error checking out:', error);
      alert('Failed to check out. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading showings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Scheduling</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleConnectGoogle}
              disabled={googleLinked || googleLoading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {googleLinked ? 'Google Connected' : googleLoading ? 'Connecting...' : 'Connect Google'}
            </button>
            <button
              onClick={handleSyncCalendar}
              disabled={syncing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Google Calendar'}
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Showings are synced from Google Calendar events containing "SHOWING" in the title. Connect
          Google to enable calendar sync.
        </p>

        {/* Showings List */}
        <div className="space-y-4">
          {showings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No showings found</p>
              <p className="text-sm text-gray-400">
                Click "Sync Google Calendar" to import showings from your calendar
              </p>
            </div>
          ) : (
            showings.map((showing) => (
              <div
                key={showing.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{showing.title}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          showing.status
                        )}`}
                      >
                        {showing.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Time:</strong>{' '}
                      {new Date(showing.startTime).toLocaleString()} -{' '}
                      {new Date(showing.endTime).toLocaleString()}
                    </p>
                    {showing.location && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Location:</strong> {showing.location}
                      </p>
                    )}
                    {showing.description && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Description:</strong> {showing.description}
                      </p>
                    )}
                    {showing.checkInTime && (
                      <p className="text-sm text-green-600">
                        Checked in: {new Date(showing.checkInTime).toLocaleString()}
                      </p>
                    )}
                    {showing.checkOutTime && (
                      <p className="text-sm text-green-600">
                        Checked out: {new Date(showing.checkOutTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {showing.status === 'scheduled' && (
                      <button
                        onClick={() => handleCheckIn(showing.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm whitespace-nowrap"
                      >
                        Check In
                      </button>
                    )}
                    {showing.status === 'in-progress' && (
                      <button
                        onClick={() => handleCheckOut(showing.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm whitespace-nowrap"
                      >
                        Check Out
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

