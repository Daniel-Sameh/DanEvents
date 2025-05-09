
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  bookedAt: string;
}
