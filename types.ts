// Firestore Collection Types

import { Timestamp } from "firebase/firestore";
import { number } from "yup";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  fullName?: string;
  photoURL?: string;
  googleAccessToken?: string;
  googleDriveFolderId?: string;
  googleDriveFolderLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  agentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  googleDriveFolderId?: string;
  googleDriveFolderLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  id: string;
  agentId: string;
  clientId?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  status: "active" | "pending" | "sold" | "off-market";
  createdAt: Date;
  updatedAt: Date;
}

export interface Showing {
  id: string;
  agentId: string;
  address: string;
  listingId?: string;
  clientId?: string;
  calendarEventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  checkInTime?: Date;
  checkOutTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  agentId: string;
  clientId?: string;
  listingId?: string;
  showingId?: string;
  name: string;
  type: "contract" | "disclosure" | "inspection" | "other";
  status: "draft" | "sent" | "signed";
  googleDriveFileId?: string;
  googleDriveFileLink?: string;
  signedPdfDriveFileId?: string;
  signedPdfDriveFileLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Realtime Database Types
export interface ActiveShowingLocation {
  agentId: string;
  showingId: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface IRequest {
  id: string;
  property: string;
  city: string;
  coordinates: { lat: number; lng: number };
  state: string;
  type: string;
  amount: number;
  status: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface IShowing {
  id: string;
  showingID: string;
  address: string;
  city: string;
  state: string;
  showingTime: string;
  invitee: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContact {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface IInvoiceItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
  tax: string;
  amount: string;
}
export interface IInvoice {
  createdAt:string;
  updatedAt:string;
  invoiceID:string;
  companyName: string;
  address: string;
  phoneNumber: string;
  items: IInvoiceItem[];
}
