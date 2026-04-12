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
  arrayUnion,
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
  IProperty,
  Property,
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
  } as unknown as User;
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
        } as unknown as  User;
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

// Showings Collection
export const propertiesCollection = collection(db, "properties");

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


export async function getUsersByEmails(
  emails: string[]
): Promise<User[]> {
  if (!emails.length) return [];

  try {
    // Firestore "in" query supports max 10 values at once
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("email", "in", emails));

    const snapshot = await getDocs(q);

    const users: User[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<User, "id">),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}


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


export const createNewProperty = async (
  propertyData: any, //maybe this shouldnt be any - apr 12 2026 dagogo 
  userId: string, //we will use it later
) => {
  try {
    const docRef = doc(collection(db, COLLECTIONS.PROPERTIES));

    await setDoc(docRef, {
      ...propertyData,
      
      propertyID: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export const updateCurrentRequest = async (
  requestID: string,
  propertyData: Omit<IRequest, "id" | "userId" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  try {
    const docRef = doc(db, COLLECTIONS.REQUESTS, requestID);

    await updateDoc(docRef, {
      ...propertyData,
      userId,
      updatedAt: new Date().toISOString(), // ✅ only update this
    });

    return requestID;
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};



export const updateCurrentProperty = async (
  requestID: string,
  propertyData:any, //apr 12 - maybe this shouldnt be any "Dagogo"
  userId: string,
) => {
  try {
    const docRef = doc(db, COLLECTIONS.PROPERTIES, propertyData.propertyID);

    await updateDoc(docRef, {
      ...propertyData,
      
      updatedAt: new Date().toISOString(), // ✅ only update this
    });

    return requestID;
  } catch (error) {
    console.error("Error updating request:", error);
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

export const updateContact = async (
  id: string,
  contactData: Partial<
    Omit<IContact, "id" | "userId" | "createdAt" | "updatedAt">
  >,
) => {
  try {
    const ref = doc(db, COLLECTIONS.CONTACTS, id);

    await updateDoc(ref, {
      ...contactData,
      updatedAt: Timestamp.now(),
    });

    return id;
  } catch (error) {
    throw error;
  }
};

export const getContactWithID = async (
  id: string,
): Promise<IContact | null> => {
  try {
    const ref = doc(db, COLLECTIONS.CONTACTS, id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<IContact, "id">),
    };
  } catch (error) {
    console.error("Error fetching contact:", error);
    throw error;
  }
};

export const getAllContacts: (userId: string) => Promise<IContact[]> = async (
  userId: string,
) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONTACTS),
      where("userId", "==", userId),
    );

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
    const propertyDocRef = doc(db, COLLECTIONS.PROPERTIES, propertyData.propertyID);
    
    console.log("SHOWING IS STILL WORKING AT THIS POINT 1");


    await setDoc(docRef, {
      ...propertyData,
      showingID: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });


//update the property with a showind id

await updateDoc(propertyDocRef, {
  showings: arrayUnion(docRef.id),
});




    console.log("SHOWING IS STILL WORKING AT THIS POINT 2");

    return docRef.id;
  } catch (error) {
    console.error("Error creating showing:", error);
    throw error;
  }
};

export const getAllShowings: (
) => Promise<IShowing[]> = async () => {
  try {
    // const q = query(collection(db, COLLECTIONS.SHOWINGS));
    const q = query(
      collection(db, COLLECTIONS.SHOWINGS),
      orderBy("createdAt"),
    );

    const querySnapshot = await getDocs(q);
    const showings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))as IShowing[];

     

    return showings;
  } catch (error) {
    console.error("Error fetching showings:", error);
    throw error;
  }
};

//export const getAllProperties: (
//) => Promise<IProperty[]> = async () => {
//  try {
//    // const q = query(collection(db, COLLECTIONS.SHOWINGS));
//    const q = query(
//      collection(db, COLLECTIONS.PROPERTIES),
//      orderBy("createdAt"),
//    );
//
//    const querySnapshot = await getDocs(q);
//    const properties = querySnapshot.docs.map((doc) => ({
//      id: doc.id,
//      ...doc.data(),
//    }))as unknown as IProperty[];
//
//     
//
//    return properties;
//  } catch (error) {
//    console.error("Error fetching showings:", error);
//    throw error;
//  }
//};



export const getAllProperties = async (): Promise<Property[]> => {
  const snapshot = await getDocs(propertiesCollection);

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
    } as unknown as Property;
  });
};




export const getShowingByID = async (showingID: string) => {
  const ref = doc(db, COLLECTIONS.SHOWINGS, showingID);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return snapshot.data();
};

export const getRequestByID = async (requestID: string) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestID);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return snapshot.data();
};


export const getPropertyByID = async (propertyID: string) => {
  const ref = doc(db, COLLECTIONS.PROPERTIES, propertyID);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return snapshot.data();
};

export const updateShowingInvitees = async (
  showingID: string,
  newEmail: string,
) => {
  try {
    const showingRef = doc(db, COLLECTIONS.SHOWINGS, showingID);

    await updateDoc(showingRef, {
      invitees: arrayUnion(newEmail),
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("Error updating showing invitees:", error);
    throw error;
  }
};

//INVOICES

export const createNewInvoice = async (
  userId: string,
  propertyData: Omit<
    IInvoice,
    "id" | "userId" | "invoiceID" | "createdAt" | "updatedAt"
  >,
) => {
  try {
    const docRef = doc(collection(db, COLLECTIONS.INVOICES));

    await setDoc(docRef, {
      ...propertyData,
      userId,
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

export const getAllInvoices: (userId: string) => Promise<IInvoice[]> = async (
  userId: string,
) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.INVOICES),
      where("userId", "==", userId),
      // orderBy("createdAt"),
    );

    const querySnapshot = await getDocs(q);
    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IInvoice[];

    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceWithID = async (
  id: string,
): Promise<IInvoice | null> => {
  try {
    const ref = doc(db, COLLECTIONS.INVOICES, id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...(snapshot.data() as Omit<IInvoice, "id">),
    };
  } catch (error) {
    console.error("Error fetching Invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (
  id: string,
  contactData: Partial<
    Omit<IInvoice, "id" | "userId" | "createdAt" | "updatedAt">
  >,
) => {
  try {
    const ref = doc(db, COLLECTIONS.INVOICES, id);

    await updateDoc(ref, {
      ...contactData,
      updatedAt: Timestamp.now(),
    });

    return id;
  } catch (error) {
    throw error;
  }
};
