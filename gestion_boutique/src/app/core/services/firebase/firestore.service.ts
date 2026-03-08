import { Injectable } from '@angular/core';
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
  limit,
  Timestamp,
  QueryConstraint,
  addDoc
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = getFirebaseFirestore();

  // Generic CRUD operations
  async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    const docRef = doc(this.firestore, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return this.convertFirestoreData<T>(docSnap.data(), docId);
    }
    return null;
  }

  async getCollection<T>(
    collectionName: string, 
    ...constraints: QueryConstraint[]
  ): Promise<T[]> {
    const collectionRef = collection(this.firestore, collectionName);
    const q = constraints.length > 0 
      ? query(collectionRef, ...constraints)
      : query(collectionRef);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => 
      this.convertFirestoreData<T>(doc.data(), doc.id)
    );
  }

  async createDocument<T extends { id?: string }>(
    collectionName: string, 
    data: Omit<T, 'id'>
  ): Promise<string> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = await addDoc(collectionRef, this.convertToFirestoreData(data));
    return docRef.id;
  }

  async updateDocument<T>(
    collectionName: string, 
    docId: string, 
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    await updateDoc(docRef, this.convertToFirestoreData(data));
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    await deleteDoc(docRef);
  }

  // Helper methods for date conversion
  private convertFirestoreData<T>(data: any, id: string): T {
    const converted: any = { ...data, id };
    
    // Convert Firestore Timestamps to Dates
    for (const key in converted) {
      if (converted[key] instanceof Timestamp) {
        converted[key] = converted[key].toDate();
      } else if (converted[key] && typeof converted[key] === 'object') {
        // Recursive conversion for nested objects
        converted[key] = this.convertNestedTimestamps(converted[key]);
      }
    }
    
    return converted as T;
  }

  private convertNestedTimestamps(obj: any): any {
    if (obj instanceof Timestamp) {
      return obj.toDate();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertNestedTimestamps(item));
    }
    
    if (obj && typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        converted[key] = this.convertNestedTimestamps(obj[key]);
      }
      return converted;
    }
    
    return obj;
  }

  private convertToFirestoreData(data: any): any {
    const converted: any = { ...data };
    
    // Convert Dates to Firestore Timestamps
    for (const key in converted) {
      if (converted[key] instanceof Date) {
        converted[key] = Timestamp.fromDate(converted[key]);
      } else if (converted[key] && typeof converted[key] === 'object' && !Array.isArray(converted[key])) {
        // Recursive conversion for nested objects
        converted[key] = this.convertNestedDates(converted[key]);
      }
    }
    
    return converted;
  }

  private convertNestedDates(obj: any): any {
    if (obj instanceof Date) {
      return Timestamp.fromDate(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertNestedDates(item));
    }
    
    if (obj && typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        converted[key] = this.convertNestedDates(obj[key]);
      }
      return converted;
    }
    
    return obj;
  }
}
