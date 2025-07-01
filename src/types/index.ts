
export type UserRole = 'admin' | 'user';

export interface User {
  _id?: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
  isAdmin?: boolean;
  profileImageUrl?: string;
}

// Extended user interface for authentication that includes password field
export interface UserWithPassword extends User {
  password: string;
}

export interface Event {
  _id?: string;
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  imageUrl: string;
  createdBy?: string;
}

export interface Booking {
  _id?: string;
  eventId: string;
  userId: string;
  status: string;
  bookedDate: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
