import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Booking } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from "@/hooks/use-toast";
import { eventApi, bookingApi } from '@/services/api';

interface EventContextType {
  events: Event[];
  bookings: Booking[];
  isLoading: boolean;
  getEvent: (id: string) => Event | undefined;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  bookEvent: (eventId: string) => Promise<void>;
  isEventBooked: (eventId: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Sample event data
const sampleEvents: Event[] = [
  {
    id: '1',
    name: 'Annual Tech Conference',
    description: 'Join us for three days of inspiring talks, workshops, and networking opportunities with tech industry leaders.',
    category: 'Technology',
    date: '2025-06-15T09:00:00',
    venue: 'Downtown Convention Center',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    createdAt: '2025-01-15T12:00:00',
    updatedAt: '2025-01-15T12:00:00'
  },
  {
    id: '2',
    name: 'Summer Music Festival',
    description: 'Experience an unforgettable weekend of live performances from top artists across multiple stages in a beautiful outdoor setting.',
    category: 'Music',
    date: '2025-07-25T16:00:00',
    venue: 'Riverside Park',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    createdAt: '2025-02-10T14:30:00',
    updatedAt: '2025-02-10T14:30:00'
  },
  {
    id: '3',
    name: 'Culinary Masterclass',
    description: 'Learn cooking techniques from renowned chefs and discover how to create exquisite dishes using fresh, seasonal ingredients.',
    category: 'Food & Drink',
    date: '2025-05-05T18:00:00',
    venue: 'Gourmet Cooking School',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    createdAt: '2025-03-01T09:15:00',
    updatedAt: '2025-03-01T09:15:00'
  },
  {
    id: '4',
    name: 'Business Leadership Summit',
    description: 'Connect with industry leaders, gain insights on emerging business trends, and develop strategies for success in today\'s competitive market.',
    category: 'Business',
    date: '2025-09-10T08:30:00',
    venue: 'Grand Hotel Conference Center',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    createdAt: '2025-04-20T11:45:00',
    updatedAt: '2025-04-20T11:45:00'
  },
  {
    id: '5',
    name: 'Wellness Retreat Weekend',
    description: 'Rejuvenate your mind, body, and spirit with yoga sessions, meditation workshops, nutritional guidance, and relaxation activities.',
    category: 'Wellness',
    date: '2025-08-20T15:00:00',
    venue: 'Mountain View Resort',
    price: 225,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1220&q=80',
    createdAt: '2025-05-05T16:20:00',
    updatedAt: '2025-05-05T16:20:00'
  },
  {
    id: '6',
    name: 'Digital Marketing Workshop',
    description: 'Master the latest digital marketing strategies, from social media campaigns to SEO optimization and content marketing techniques.',
    category: 'Marketing',
    date: '2025-06-30T09:00:00',
    venue: 'Innovation Hub',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    createdAt: '2025-05-15T10:10:00',
    updatedAt: '2025-05-15T10:10:00'
  }
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load events and bookings
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to get events
        const storedEvents = localStorage.getItem('danEventsEvents');
        if (storedEvents) {
          // Use existing stored events
          const fetchedEvents = await eventApi.getAllEvents();
          setEvents(fetchedEvents);
        } else {
          // First load: use sample data and store it
          localStorage.setItem('danEventsEvents', JSON.stringify(sampleEvents));
          setEvents(sampleEvents);
        }
        
        // Fetch user bookings if user is logged in
        if (user) {
          const userBookings = await bookingApi.getUserBookings(user.id);
          setBookings(userBookings);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error('Failed to load data', error);
        toast({
          title: "Error loading data",
          description: "Failed to load events and bookings.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  // Get event by ID
  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  // Add a new event
  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized. Only admins can create events.');
    }

    try {
      // Call the API to create the event
      const newEvent = await eventApi.createEvent(eventData);
      
      // Update local state
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to add event', error);
      toast({
        title: "Failed to create event",
        description: "There was an error creating the event.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Update an existing event
  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized. Only admins can update events.');
    }

    try {
      // Call API to update the event
      const updatedEvent = await eventApi.updateEvent(id, eventData);
      
      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => event.id === id ? updatedEvent : event)
      );
      
      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      });
    } catch (error) {
      console.error('Failed to update event', error);
      toast({
        title: "Failed to update event",
        description: "There was an error updating the event.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized. Only admins can delete events.');
    }

    try {
      // Call API to delete the event
      await eventApi.deleteEvent(id);
      
      // Update local state
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      
      // Remove associated bookings
      setBookings(prevBookings => prevBookings.filter(booking => booking.eventId !== id));
      
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete event', error);
      toast({
        title: "Failed to delete event",
        description: "There was an error deleting the event.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Book an event
  const bookEvent = async (eventId: string) => {
    if (!user) {
      throw new Error('You must be logged in to book an event.');
    }

    // Check if the event exists
    const event = events.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found.');
    }

    try {
      // Get the auth token (in a real app, this would be from your auth system)
      const authToken = user.token || 'simulated-token';
      
      // Call API to book the event
      const newBooking = await bookingApi.bookEvent(user.id, eventId, authToken);
      
      // Update local state
      setBookings(prevBookings => [...prevBookings, newBooking]);
      
      toast({
        title: "Booking confirmed!",
        description: `You have successfully booked a ticket for "${event.name}".`,
      });
    } catch (error) {
      console.error('Failed to book event', error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Check if an event is booked by the current user
  const isEventBooked = (eventId: string) => {
    if (!user) return false;
    return bookings.some(booking => booking.eventId === eventId && booking.userId === user.id);
  };

  return (
    <EventContext.Provider value={{
      events,
      bookings,
      isLoading,
      getEvent,
      addEvent,
      updateEvent,
      deleteEvent,
      bookEvent,
      isEventBooked
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
