
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token?: string;
}

// Extended user interface for authentication that includes password field
export interface UserWithPassword extends User {
  password: string;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  bookedAt: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
