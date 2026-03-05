import { ref, set, onValue, off, remove } from 'firebase/database';
import { auth, realtimeDb } from './config';
import { ActiveShowingLocation } from '../../types';

// Realtime Database paths
const ACTIVE_SHOWINGS_PATH = 'active_showings';

const requireAuthUid = (): string => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('User not authenticated');
  }
  return uid;
};

export const startShowingMode = async (
  showingId: string,
  latitude: number,
  longitude: number
): Promise<void> => {
  const agentId = requireAuthUid();
  const locationRef = ref(realtimeDb, `${ACTIVE_SHOWINGS_PATH}/${agentId}`);
  await set(locationRef, {
    agentId,
    showingId,
    latitude,
    longitude,
    timestamp: Date.now(),
  });
};

export const updateShowingLocation = async (
  showingId: string,
  latitude: number,
  longitude: number
): Promise<void> => {
  const agentId = requireAuthUid();
  const locationRef = ref(realtimeDb, `${ACTIVE_SHOWINGS_PATH}/${agentId}`);
  await set(locationRef, {
    agentId,
    showingId,
    latitude,
    longitude,
    timestamp: Date.now(),
  });
};

export const stopShowingMode = async (): Promise<void> => {
  const agentId = requireAuthUid();
  const locationRef = ref(realtimeDb, `${ACTIVE_SHOWINGS_PATH}/${agentId}`);
  await remove(locationRef);
};

export const subscribeToActiveShowings = (
  callback: (showings: Record<string, ActiveShowingLocation>) => void
): () => void => {
  const showingsRef = ref(realtimeDb, ACTIVE_SHOWINGS_PATH);
  
  onValue(showingsRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || {});
  });

  // Return unsubscribe function
  return () => {
    off(showingsRef);
  };
};

export const subscribeToAgentLocation = (
  agentId: string,
  callback: (location: ActiveShowingLocation | null) => void
): () => void => {
  const locationRef = ref(realtimeDb, `${ACTIVE_SHOWINGS_PATH}/${agentId}`);
  
  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();
    callback(data || null);
  });

  // Return unsubscribe function
  return () => {
    off(locationRef);
  };
};

