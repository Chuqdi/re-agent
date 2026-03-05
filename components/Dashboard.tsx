'use client';

import { useEffect, useState } from 'react';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import LiveAgentTracker from './LiveAgentTracker';
import DocumentManager from './DocumentManager';
import Scheduling from './Scheduling';
import { User } from '@/types';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'tracker' | 'documents' | 'scheduling'>('tracker');
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>(user.displayName || user.email);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        const { getUser } = await import('@/lib/firebase/firestore');
        const profile = await getUser(user.uid);
        if (mounted) {
          setDisplayName(profile?.fullName || profile?.displayName || user.displayName || user.email);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user.uid, user.displayName, user.email]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Real Estate Agents</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">{displayName}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('tracker')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tracker'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Live Tracker
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('scheduling')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scheduling'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Scheduling
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'tracker' && <LiveAgentTracker user={user} />}
        {activeTab === 'documents' && <DocumentManager user={user} />}
        {activeTab === 'scheduling' && <Scheduling user={user} />}
      </main>
    </div>
  );
}

