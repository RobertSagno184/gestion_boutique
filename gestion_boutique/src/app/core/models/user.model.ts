export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  role?: 'admin' | 'user';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
