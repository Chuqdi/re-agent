import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  linkWithPopup,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from './config';


// Google OAuth Provider with additional scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');
googleProvider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

const upsertUserProfile = async (data: {
  uid: string;
  email: string;
  displayName?: string | null;
  fullName?: string | null;
  photoURL?: string | null;
  googleAccessToken?: string | null;
}) => {
  const { createUser, updateUser, getUser } = await import('./firestore');
  const existingUser = await getUser(data.uid);

  const baseDisplayName =
    data.displayName || data.fullName || existingUser?.displayName || '';

  const payload: any = {
    uid: data.uid,
    email: data.email,
    displayName: baseDisplayName,
  };

  const fullName = data.fullName ?? existingUser?.fullName;
  if (fullName != null) {
    payload.fullName = fullName;
  }

  const photoURL = data.photoURL ?? existingUser?.photoURL;
  if (photoURL != null) {
    payload.photoURL = photoURL;
  }

  const googleAccessToken = data.googleAccessToken ?? existingUser?.googleAccessToken;
  if (googleAccessToken != null) {
    payload.googleAccessToken = googleAccessToken;
  }

  if (existingUser) {
    await updateUser(data.uid, payload);
  } else {
    await createUser(payload as any);
  }
};

export const signInWithGoogle = async (): Promise<{ user: FirebaseUser; accessToken: string | null }> => {
  try {
    let result;
    if (auth.currentUser) {
      try {
        result = await linkWithPopup(auth.currentUser, googleProvider);
      } catch (error: any) {
        // If already linked, fall back to a regular sign-in to refresh token
        if (error?.code === 'auth/credential-already-in-use' || error?.code === 'auth/provider-already-linked') {
          result = await signInWithPopup(auth, googleProvider);
        } else {
          throw error;
        }
      }
    } else {
      result = await signInWithPopup(auth, googleProvider);
    }

    // Get the OAuth credential to extract access token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken || null;
    
    // Store access token in Firestore (via API route or directly)
    if (result.user) {
      await upsertUserProfile({
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName,
        fullName: result.user.displayName,
        photoURL: result.user.photoURL,
        googleAccessToken: accessToken,
      });
    }
    
    return { user: result.user, accessToken };
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getGoogleAccessToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    // Get the OAuth credential from the sign-in result
    // Note: In a real app, you'd store this token securely (e.g., in Firestore via Cloud Function)
    // For now, we'll need to get it from the credential
    const credential = GoogleAuthProvider.credentialFromResult(
      await signInWithPopup(auth, googleProvider)
    );
    return credential?.accessToken || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName: string
): Promise<FirebaseUser> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) {
      await updateProfile(result.user, { displayName: fullName });
    }

    await upsertUserProfile({
      uid: result.user.uid,
      email,
      displayName: fullName,
      fullName,
      photoURL: result.user.photoURL,
    });

    return result.user;
  } catch (error: any) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    await upsertUserProfile({
      uid: result.user.uid,
      email: result.user.email || email,
      displayName: result.user.displayName,
      fullName: result.user.displayName,
      photoURL: result.user.photoURL,
    });

    return result.user;
  } catch (error: any) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

export const isGoogleLinked = (): boolean => {
  const user = auth.currentUser;
  if (!user) return false;
  return user.providerData.some((provider) => provider.providerId === 'google.com');
};




export async function changePassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) {
  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("User not authenticated");
  }

  const credential = EmailAuthProvider.credential(
    user.email,
    oldPassword
  );

  await reauthenticateWithCredential(user, credential);

  await updatePassword(user, newPassword);
}