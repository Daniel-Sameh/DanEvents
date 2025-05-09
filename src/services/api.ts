
// API service for simulating backend calls

import { Event, Booking, User, UserWithPassword } from '@/types';

// Simulate API call delay
const simulateAPICall = async <T>(data: T): Promise<T> => {
  return new Promise<T>(resolve => {
    setTimeout(() => resolve(data), 500);
  });
};

export const api = {
  // User authentication
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const storedUsers = localStorage.getItem('daneventsUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const user = users.find((u: UserWithPassword) => u.email === email);
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }
    
    // Create a mock JWT token
    const token = `mock-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    
    return simulateAPICall({ user: userWithoutPassword, token });
  },
  
  register: async (userData: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> => {
    const storedUsers = localStorage.getItem('daneventsUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const existingUser = users.find((u: UserWithPassword) => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    const newUser: UserWithPassword = {
      ...userData,
      id: `user-${Date.now()}`,
      role: 'user' as const
    };
    
    users.push(newUser);
    localStorage.setItem('daneventsUsers', JSON.stringify(users));
    
    // Create a mock JWT token
    const token = `mock-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;
    
    return simulateAPICall({ user: userWithoutPassword, token });
  },
  
  // Events
  getEvents: async (): Promise<Event[]> => {
    const storedEvents = localStorage.getItem('daneventsEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    
    console.log(`Retrieved ${events.length} events from localStorage`);
    return simulateAPICall(events);
  },
  
  getEvent: async (id: string): Promise<Event | undefined> => {
    const storedEvents = localStorage.getItem('daneventsEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    
    const event = events.find((e: Event) => e.id === id);
    
    return simulateAPICall(event);
  },
  
  createEvent: async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>, token: string): Promise<Event> => {
    // In a real app, validate the token here
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    const storedEvents = localStorage.getItem('daneventsEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    events.push(newEvent);
    localStorage.setItem('daneventsEvents', JSON.stringify(events));
    
    return simulateAPICall(newEvent);
  },
  
  updateEvent: async (id: string, eventData: Partial<Event>, token: string): Promise<Event> => {
    // In a real app, validate the token here
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    const storedEvents = localStorage.getItem('daneventsEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    
    const eventIndex = events.findIndex((e: Event) => e.id === id);
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = {
      ...events[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    events[eventIndex] = updatedEvent;
    localStorage.setItem('daneventsEvents', JSON.stringify(events));
    
    return simulateAPICall(updatedEvent);
  },
  
  deleteEvent: async (id: string, token: string): Promise<void> => {
    // In a real app, validate the token here
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    const storedEvents = localStorage.getItem('daneventsEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    
    const updatedEvents = events.filter((e: Event) => e.id !== id);
    localStorage.setItem('daneventsEvents', JSON.stringify(updatedEvents));
    
    // Remove associated bookings
    const storedBookings = localStorage.getItem('daneventsBookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    
    const updatedBookings = bookings.filter((b: Booking) => b.eventId !== id);
    localStorage.setItem('daneventsBookings', JSON.stringify(updatedBookings));
    
    return simulateAPICall(undefined);
  },
  
  // Bookings
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const storedBookings = localStorage.getItem('daneventsBookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    
    const userBookings = bookings.filter((b: Booking) => b.userId === userId);
    
    return simulateAPICall(userBookings);
  },
  
  bookEvent: async (eventId: string, userId: string, token: string): Promise<Booking> => {
    // In a real app, validate the token here
    if (!token) {
      throw new Error('Unauthorized');
    }
    
    const storedBookings = localStorage.getItem('daneventsBookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    
    // Check if the user has already booked this event
    const existingBooking = bookings.find(
      (b: Booking) => b.eventId === eventId && b.userId === userId
    );
    
    if (existingBooking) {
      throw new Error('You have already booked this event');
    }
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      eventId,
      userId,
      bookedAt: new Date().toISOString()
    };
    
    bookings.push(newBooking);
    localStorage.setItem('daneventsBookings', JSON.stringify(bookings));
    
    return simulateAPICall(newBooking);
  }
};
