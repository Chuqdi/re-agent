import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import {
  User,
  Client,
  Listing,
  Showing,
  Document,
  IRequest,
  IContact,
  IShowing,
  IInvoice,
  IUser,
} from "../../types";
import { COLLECTIONS } from ".";

// Helper to convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// Helper to convert Date to Firestore Timestamp
const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Users Collection
export const usersCollection = collection(db, "users");

export const createUser = async (
  userData: Omit<User, "createdAt" | "updatedAt">,
): Promise<void> => {
  const userRef = doc(usersCollection, userData.uid);
  // Strip out undefined fields so Firestore doesn't reject the write
  const sanitized: Record<string, any> = {};
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  });
  await setDoc(userRef, {
    ...sanitized,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(usersCollection, uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;

  const data = userSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as User;
};

export const getUsersByIds = async (
  uids: string[],
): Promise<Record<string, User>> => {
  const uniqueIds = Array.from(new Set(uids.filter(Boolean)));
  if (uniqueIds.length === 0) return {};

  const results: Record<string, User> = {};
  await Promise.all(
    uniqueIds.map(async (uid) => {
      const userRef = doc(usersCollection, uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        results[uid] = {
          ...data,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
        } as User;
      }
    }),
  );

  return results;
};

export const updateUser = async (
  uid: string,
  updates: Partial<User>,
): Promise<void> => {
  const userRef = doc(usersCollection, uid);
  const sanitized: Record<string, any> = {};
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  });
  await updateDoc(userRef, {
    ...sanitized,
    updatedAt: Timestamp.now(),
  });
};

// Clients Collection
export const clientsCollection = collection(db, "clients");

export const createClient = async (
  clientData: Omit<Client, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const clientRef = doc(clientsCollection);
  const clientId = clientRef.id;
  await setDoc(clientRef, {
    ...clientData,
    id: clientId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return clientId;
};

export const getClient = async (clientId: string): Promise<Client | null> => {
  const clientRef = doc(clientsCollection, clientId);
  const clientSnap = await getDoc(clientRef);
  if (!clientSnap.exists()) return null;

  const data = clientSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Client;
};

export const getClientsByAgent = async (agentId: string): Promise<Client[]> => {
  const q = query(
    clientsCollection,
    where("agentId", "==", agentId),
    orderBy("createdAt", "desc"),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Client;
  });
};

export const updateClient = async (
  clientId: string,
  updates: Partial<Client>,
): Promise<void> => {
  const clientRef = doc(clientsCollection, clientId);
  await updateDoc(clientRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Listings Collection
export const listingsCollection = collection(db, "listings");

export const createListing = async (
  listingData: Omit<Listing, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const listingRef = doc(listingsCollection);
  const listingId = listingRef.id;
  await setDoc(listingRef, {
    ...listingData,
    id: listingId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return listingId;
};

export const getListing = async (
  listingId: string,
): Promise<Listing | null> => {
  const listingRef = doc(listingsCollection, listingId);
  const listingSnap = await getDoc(listingRef);
  if (!listingSnap.exists()) return null;

  const data = listingSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Listing;
};

export const getListingsByAgent = async (
  agentId: string,
): Promise<Listing[]> => {
  const q = query(
    listingsCollection,
    where("agentId", "==", agentId),
    orderBy("createdAt", "desc"),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Listing;
  });
};

// Showings Collection
export const showingsCollection = collection(db, "showings");

export const createShowing = async (
  showingData: Omit<Showing, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const showingRef = doc(showingsCollection);
  const showingId = showingRef.id;
  await setDoc(showingRef, {
    ...showingData,
    id: showingId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return showingId;
};

export const getShowings = async (): Promise<Showing[]> => {
  const snapshot = await getDocs(showingsCollection);

  if (snapshot.empty) return [];

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id, // include id if your Showing type expects it
      ...data,

      // startTime: timestampToDate(data.startTime),
      // endTime: timestampToDate(data.endTime),
      // checkInTime: data.checkInTime
      //   ? timestampToDate(data.checkInTime)
      //   : undefined,
      // checkOutTime: data.checkOutTime
      //   ? timestampToDate(data.checkOutTime)
      //   : undefined,
      // createdAt: timestampToDate(data.createdAt),
      // updatedAt: timestampToDate(data.updatedAt),
    } as Showing;
  });
};

export const getShowing = async (
  showingId: string,
): Promise<Showing | null> => {
  const showingRef = doc(showingsCollection, showingId);
  const showingSnap = await getDoc(showingRef);
  if (!showingSnap.exists()) return null;

  const data = showingSnap.data();
  return {
    ...data,
    startTime: timestampToDate(data.startTime),
    endTime: timestampToDate(data.endTime),
    checkInTime: data.checkInTime
      ? timestampToDate(data.checkInTime)
      : undefined,
    checkOutTime: data.checkOutTime
      ? timestampToDate(data.checkOutTime)
      : undefined,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Showing;
};

export const getShowingsByAgent = async (
  agentId: string,
): Promise<Showing[]> => {
  const q = query(
    showingsCollection,
    where("agentId", "==", agentId),
    orderBy("startTime", "asc"),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      startTime: timestampToDate(data.startTime),
      endTime: timestampToDate(data.endTime),
      checkInTime: data.checkInTime
        ? timestampToDate(data.checkInTime)
        : undefined,
      checkOutTime: data.checkOutTime
        ? timestampToDate(data.checkOutTime)
        : undefined,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Showing;
  });
};

export const updateShowing = async (
  showingId: string,
  updates: Partial<Showing>,
): Promise<void> => {
  const showingRef = doc(showingsCollection, showingId);
  const updateData: any = {
    ...updates,
    updatedAt: Timestamp.now(),
  };

  // Convert Date objects to Timestamps
  if (updates.startTime)
    updateData.startTime = dateToTimestamp(updates.startTime);
  if (updates.endTime) updateData.endTime = dateToTimestamp(updates.endTime);
  if (updates.checkInTime)
    updateData.checkInTime = dateToTimestamp(updates.checkInTime);
  if (updates.checkOutTime)
    updateData.checkOutTime = dateToTimestamp(updates.checkOutTime);

  await updateDoc(showingRef, updateData);
};

// Documents Collection
export const documentsCollection = collection(db, "documents");

export const createDocument = async (
  documentData: Omit<Document, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  const documentRef = doc(documentsCollection);
  const documentId = documentRef.id;
  await setDoc(documentRef, {
    ...documentData,
    id: documentId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return documentId;
};

export const getDocument = async (
  documentId: string,
): Promise<Document | null> => {
  const documentRef = doc(documentsCollection, documentId);
  const documentSnap = await getDoc(documentRef);
  if (!documentSnap.exists()) return null;

  const data = documentSnap.data();
  return {
    ...data,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  } as Document;
};

export const getDocumentsByAgent = async (
  agentId: string,
): Promise<Document[]> => {
  const q = query(
    documentsCollection,
    where("agentId", "==", agentId),
    orderBy("createdAt", "desc"),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Document;
  });
};

export const updateDocument = async (
  documentId: string,
  updates: Partial<Document>,
): Promise<void> => {
  const documentRef = doc(documentsCollection, documentId);
  await updateDoc(documentRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

export const createNewRequest = async (
  propertyData: Omit<IRequest, "id" | "userId" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  try {
    const docRef = doc(collection(db, COLLECTIONS.REQUESTS));

    await setDoc(docRef, {
      ...propertyData,
      userId,
      requestID: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const getAllRequests: () => Promise<IRequest[]> = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.REQUESTS),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IRequest[];

    return requests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};


export const getAllUsers: () => Promise<IUser[]> = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as IUser[];

    return requests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const createNewContact = async (
  contactData: Omit<IContact, "id" | "userId" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), {
      ...contactData,
      userId: userId, // Store user ID as reference
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    console.log("Contact created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating Contact: ", error);
    throw error;
  }
};

export const getAllContacts: () => Promise<IContact[]> = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.CONTACTS), orderBy("createdAt"));

    const querySnapshot = await getDocs(q);
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IContact[];

    return contacts;
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};

//SHOWING

export const createNewShowing = async (
  propertyData: Omit<IShowing, "id" | "showingID" | "createdAt" | "updatedAt">,
) => {
  try {
    const docRef = doc(collection(db, COLLECTIONS.SHOWINGS));

    await setDoc(docRef, {
      ...propertyData,
      showingID: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating showing:", error);
    throw error;
  }
};

//INVOICES

export const createNewInvoice = async (
  propertyData: Omit<IInvoice, "id" | "invoiceID" | "createdAt" | "updatedAt">,
) => {
  try {
    const docRef = doc(collection(db, COLLECTIONS.INVOICES));

    await setDoc(docRef, {
      ...propertyData,
      invoiceID: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating showing:", error);
    throw error;
  }
};

export const getAllInvoices: () => Promise<IInvoice[]> = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.INVOICES), orderBy("createdAt"));

    const querySnapshot = await getDocs(q);
    const invoices = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as IInvoice[];

    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};
