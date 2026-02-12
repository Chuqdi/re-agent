// Firestore Collection Types

import { Timestamp } from "firebase/firestore";

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
  status: 'active' | 'pending' | 'sold' | 'off-market';
  createdAt: Date;
  updatedAt: Date;
}

export interface Showing {
  id: string;
  agentId: string;
  address:string;
  listingId?: string;
  clientId?: string;
  calendarEventId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
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
  type: 'contract' | 'disclosure' | 'inspection' | 'other';
  status: 'draft' | 'sent' | 'signed';
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
  id:string;
  property: string;
  city: string;
  state: string;
  type: string;
  amount: number;
  status: string;
  userId: string; 
  createdAt: Timestamp;
  updatedAt: Timestamp;
}


export interface IContact {
  id:string;
  userId: string; 
  createdAt: Timestamp;
  updatedAt: Timestamp;


  firstName:string;
  lastName:string;
  email:string;
  phoneNumber:string;
}