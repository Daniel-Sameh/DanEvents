
import { Event, Booking } from '@/types';

// Mock API base URL - replace with actual API URL in production
const API_BASE_URL = '/api';

// Helper for simulating API requests with delays
const simulateApiRequest = async <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Function to get auth headers for authenticated requests
const getAuthHeaders = () => {
  // In a real app, this would get the token from localStorage or auth context
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const eventApi = {
  // Fetch all events
  getAllEvents: async (): Promise<Event[]> => {
    console.log('Fetching events from API...');
    
    // Check if we have sample data in localStorage (for demo)
    const storedEvents = localStorage.getItem('danEventsEvents');
    if (storedEvents) {
      return simulateApiRequest(JSON.parse(storedEvents));
    }
    
    // If this was a real API, we'd do something like:
    // const response = await fetch(`${API_BASE_URL}/events`, {
    //   headers: getAuthHeaders()
    // });
    // return response.json();
    
    // For now, return empty array if no stored events
    return simulateApiRequest([]);
  },
  
  // Fetch a single event by ID
  getEvent: async (id: string): Promise<Event | undefined> => {
    console.log(`Fetching event ${id} from API...`);
    
    // Check localStorage for demo
    const storedEvents = localStorage.getItem('danEventsEvents');
    if (storedEvents) {
      const events = JSON.parse(storedEvents) as Event[];
      const event = events.find(e => e.id === id);
      return simulateApiRequest(event);
    }
    
    // If this was a real API:
    // const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    //   headers: getAuthHeaders()
    // });
    // return response.json();
    
    return simulateApiRequest(undefined);
  },
  
  // Create a new event
  createEvent: async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    console.log('Creating new event via API...', eventData);
    
    // Generate a new event with ID and timestamps
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real API:
    // const response = await fetch(`${API_BASE_URL}/events`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(eventData)
    // });
    // return response.json();
    
    // For demo, save to localStorage
    const storedEvents = localStorage.getItem('danEventsEvents');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    const updatedEvents = [...events, newEvent];
    localStorage.setItem('danEventsEvents', JSON.stringify(updatedEvents));
    
    return simulateApiRequest(newEvent);
  },
  
  // Update an existing event
  updateEvent: async (id: string, eventData: Partial<Event>): Promise<Event> => {
    console.log(`Updating event ${id} via API...`, eventData);
    
    // In a real API:
    // const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    //   method: 'PUT',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify(eventData)
    // });
    // return response.json();
    
    // For demo, update in localStorage
    const storedEvents = localStorage.getItem('danEventsEvents');
    if (!storedEvents) {
      throw new Error('Event not found');
    }
    
    const events = JSON.parse(storedEvents) as Event[];
    const eventIndex = events.findIndex(e => e.id === id);
    
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }
    
    const updatedEvent = {
      ...events[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    events[eventIndex] = updatedEvent;
    localStorage.setItem('danEventsEvents', JSON.stringify(events));
    
    return simulateApiRequest(updatedEvent);
  },
  
  // Delete an event
  deleteEvent: async (id: string): Promise<void> => {
    console.log(`Deleting event ${id} via API...`);
    
    // In a real API:
    // await fetch(`${API_BASE_URL}/events/${id}`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders()
    // });
    
    // For demo, delete from localStorage
    const storedEvents = localStorage.getItem('danEventsEvents');
    if (storedEvents) {
      const events = JSON.parse(storedEvents) as Event[];
      const updatedEvents = events.filter(e => e.id !== id);
      localStorage.setItem('danEventsEvents', JSON.stringify(updatedEvents));
    }
    
    return simulateApiRequest(undefined);
  }
};

export const bookingApi = {
  // Fetch user's bookings
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    console.log(`Fetching bookings for user ${userId} from API...`);
    
    // Check localStorage for demo
    const storedBookings = localStorage.getItem('danEventsBookings');
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings) as Booking[];
      const userBookings = bookings.filter(b => b.userId === userId);
      return simulateApiRequest(userBookings);
    }
    
    // In a real API:
    // const response = await fetch(`${API_BASE_URL}/users/${userId}/bookings`, {
    //   headers: getAuthHeaders()
    // });
    // return response.json();
    
    return simulateApiRequest([]);
  },
  
  // Book an event
  bookEvent: async (userId: string, eventId: string, authToken: string): Promise<Booking> => {
    console.log(`Booking event ${eventId} for user ${userId} via API...`);
    console.log(`Using auth token: ${authToken ? 'Provided' : 'Missing'}`);
    
    // Create a new booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      eventId,
      userId,
      bookedAt: new Date().toISOString()
    };
    
    // In a real API:
    // const response = await fetch(`${API_BASE_URL}/bookings`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${authToken}`
    //   },
    //   body: JSON.stringify({ eventId, userId })
    // });
    // return response.json();
    
    // For demo, save to localStorage
    const storedBookings = localStorage.getItem('danEventsBookings');
    const bookings = storedBookings ? JSON.parse(storedBookings) : [];
    const updatedBookings = [...bookings, newBooking];
    localStorage.setItem('danEventsBookings', JSON.stringify(updatedBookings));
    
    return simulateApiRequest(newBooking);
  },
  
  // Check if a user has booked an event
  isEventBooked: async (userId: string, eventId: string): Promise<boolean> => {
    console.log(`Checking if user ${userId} has booked event ${eventId}...`);
    
    // Check localStorage for demo
    const storedBookings = localStorage.getItem('danEventsBookings');
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings) as Booking[];
      const isBooked = bookings.some(b => b.eventId === eventId && b.userId === userId);
      return simulateApiRequest(isBooked);
    }
    
    // In a real API:
    // const response = await fetch(`${API_BASE_URL}/users/${userId}/bookings/${eventId}/check`, {
    //   headers: getAuthHeaders()
    // });
    // return response.json();
    
    return simulateApiRequest(false);
  }
};
