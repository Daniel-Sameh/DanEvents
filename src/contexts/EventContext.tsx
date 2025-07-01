import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Booking } from '@/types';
import { AuthProvider, useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/services/api';

interface EventFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
  booked?: 'true' | 'false' | 'all';
  sort?: 'asc' | 'desc';
}

interface EventContextType {
  events: Event[];
  bookings: Booking[];
  isLoading: boolean;
  filters: EventFilters;
  setFilters: (filters: EventFilters) => void;
  pagination: {
    currentPage: number;
    limit: number;
    totalPages: number;
    totalEvents?: number;
    total?: number;
    hasMore?: boolean;
  };
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  getEvent: (id: string) => Promise<Event | undefined>;
  getBookedEvents: () => Promise<Event[]>;
  addEvent: (event: FormData) => Promise<void>;
  updateEvent: (id: string, event: FormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  bookEvent: (eventId: string) => Promise<void>;
  isEventBooked: (eventId: string) => boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Sample event data
// const sampleEvents: Event[] = [
//   {
//     id: '1',
//     name: 'Annual Tech Conference',
//     description: 'Join us for three days of inspiring talks, workshops, and networking opportunities with tech industry leaders.',
//     category: 'Technology',
//     date: '2025-06-15T09:00:00',
//     venue: 'Downtown Convention Center',
//     price: 299,
//     imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
//     createdAt: '2025-01-15T12:00:00',
//     updatedAt: '2025-01-15T12:00:00'
//   },
//   {
//     id: '2',
//     name: 'Summer Music Festival',
//     description: 'Experience an unforgettable weekend of live performances from top artists across multiple stages in a beautiful outdoor setting.',
//     category: 'Music',
//     date: '2025-07-25T16:00:00',
//     venue: 'Riverside Park',
//     price: 150,
//     imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
//     createdAt: '2025-02-10T14:30:00',
//     updatedAt: '2025-02-10T14:30:00'
//   },
//   {
//     id: '3',
//     name: 'Culinary Masterclass',
//     description: 'Learn cooking techniques from renowned chefs and discover how to create exquisite dishes using fresh, seasonal ingredients.',
//     category: 'Food & Drink',
//     date: '2025-05-05T18:00:00',
//     venue: 'Gourmet Cooking School',
//     price: 75,
//     imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
//     createdAt: '2025-03-01T09:15:00',
//     updatedAt: '2025-03-01T09:15:00'
//   },
//   {
//     id: '4',
//     name: 'Business Leadership Summit',
//     description: 'Connect with industry leaders, gain insights on emerging business trends, and develop strategies for success in today\'s competitive market.',
//     category: 'Business',
//     date: '2025-09-10T08:30:00',
//     venue: 'Grand Hotel Conference Center',
//     price: 350,
//     imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
//     createdAt: '2025-04-20T11:45:00',
//     updatedAt: '2025-04-20T11:45:00'
//   },
//   {
//     id: '5',
//     name: 'Wellness Retreat Weekend',
//     description: 'Rejuvenate your mind, body, and spirit with yoga sessions, meditation workshops, nutritional guidance, and relaxation activities.',
//     category: 'Wellness',
//     date: '2025-08-20T15:00:00',
//     venue: 'Mountain View Resort',
//     price: 225,
//     imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1220&q=80',
//     createdAt: '2025-05-05T16:20:00',
//     updatedAt: '2025-05-05T16:20:00'
//   },
//   {
//     id: '6',
//     name: 'Digital Marketing Workshop',
//     description: 'Master the latest digital marketing strategies, from social media campaigns to SEO optimization and content marketing techniques.',
//     category: 'Marketing',
//     date: '2025-06-30T09:00:00',
//     venue: 'Innovation Hub',
//     price: 120,
//     imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
//     createdAt: '2025-05-15T10:10:00',
//     updatedAt: '2025-05-15T10:10:00'
//   }
// ];

const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]); // Initialize with sample events
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventCache, setEventCache] = useState<Record<string, {data: Event, timestamp: number}>>({});
  const CACHE_TTL = 60000; // 60 seconds in milliseconds
  const [filters, setFilters] = useState<EventFilters>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 6,
    totalPages: 1,
    totalEvents: 0,
    hasMore: false
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage:page }));
  };

  const setLimit = (limit: number) => {
    setPagination(prev => ({ ...prev, limit }));
  };

  // Load events and bookings
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await api.getEvents(pagination.currentPage, pagination.limit, filters);
        setEvents(response.events);
        setPagination(prev=>({
          ...prev,
          currentPage: response.pagination.currentPage,
          // limit: pagination.limit,
          total: response.pagination.totalEvents,
          totalPages: response.pagination.totalPages,
          totalEvents: response.pagination.totalEvents,
          hasMore: response.pagination.hasMore
        }));

        if (user) {
          const fetchedBookings = await api.getUserBookings();
          setBookings(fetchedBookings);
        }
      } catch (error) {
        console.error('Failed to load data', error);
        toast({
          title: "Error loading data",
          description: error instanceof Error ? error.message : "Failed to load events and bookings.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [pagination.currentPage, pagination.limit, filters, user, toast]);


  // Get event by ID
  const getEvent = async (id: string): Promise<Event | undefined> => {
    const now = Date.now();
    
    // Check cache first and verify it's not stale
    if (eventCache[id] && (now - eventCache[id].timestamp < CACHE_TTL)) {
      return eventCache[id].data;
    }

    // Check if the event is in the current list
    const existingEvent = events.find(e => e._id === id);
    if (existingEvent) {
      // Update cache with timestamp
      setEventCache(prev => ({ 
        ...prev, 
        [id]: {
          data: existingEvent,
          timestamp: now
        } 
      }));
      return existingEvent;
    }

    try {
      // Fetch from API with cache-busting query param
      const event = await api.getEvent(id);
      // Update cache with timestamp
      setEventCache(prev => ({ 
        ...prev, 
        [id]: {
          data: event,
          timestamp: now
        } 
      }));
      return event;
    } catch (error) {
      console.error('Failed to fetch event:', error);
      return undefined;
    }
  };

  const getBookedEvents = async (): Promise<Event[]> => {
    if (!user) {
      throw new Error('You must be logged in to view booked events.');
    }
    try{
      const bookings = await api.getBookedEvents();
      const events = await Promise.all(bookings.map(async (bookedEvent) => {
        const event = await getEvent(bookedEvent.eventId);
        return event;
      }));
      return events;
    }catch(err){
      throw new Error(err instanceof Error? err.message : String(err));
    }
  }
    

  // Clear specific event from cache when updated
  const clearEventCache = (id: string) => {
    setEventCache(prev => {
      const newCache = { ...prev };
      delete newCache[id];
      return newCache;
    });
  };

  // Add a new event
  const addEvent = async (eventData: FormData) => {
    setIsLoading(true);
    try {
      eventData.append('createdBy', user._id);
      // Call API to create event with FormData directly
      const newEvent = await api.createEvent(eventData);
      
      // Update local state
      setEvents(prev => [newEvent, ...prev]);
      
      toast({
      title: "Event created",
      description: "Your event has been created successfully.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to add event', error);
      toast({
      title: "Failed to create event",
      description: "There was an error creating the event.",
      variant: "destructive"
      });
      return Promise.reject(error);
    }
    };

  // Update an existing event
    const updateEvent = async (id: string, eventData: FormData) => {
      setIsLoading(true);
      try {
        eventData.append('createdBy', user._id);
        // Call API to update event
        const updatedEvent = await api.updateEvent(id, eventData);
        
        // Update local state
        setEvents(prev => prev.map(event => 
          event._id === id ? updatedEvent : event
        ));
        clearEventCache(id); // Clear cache for this event
        
        toast({
          title: "Event updated",
          description: "The event has been updated successfully.",
        });
        
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to update event', error);
      toast({
        title: "Failed to update event",
        description: "There was an error updating the event.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    setIsLoading(true);
    try {
      // Call API to delete event
      await api.deleteEvent(id);
      
      // Update local state
      setEvents(prev => prev.filter(event => event._id !== id));
      clearEventCache(id); // Clear cache for this event
      
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to delete event', error);
      toast({
        title: "Failed to delete event",
        description: "There was an error deleting the event.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  // Book an event
  const bookEvent = async (eventId: string) => {
    if (!user) {
      throw new Error('You must be logged in to book an event.');
    }

    // Check if the event exists
    const event = events.find(e => e._id === eventId);
    if (!event) {
      toast({
        title: "Booking failed",
        description: "No such event was found to book.",
        variant: "destructive"
      });
      throw new Error('Event not found.');
    }

    try {
      // Call API to book event
      const newBooking = await api.bookEvent(eventId);
      // Update local state
      setBookings(prev => [...prev, newBooking]);

      // const updatedBookings = [...bookings, newBooking];
      // setBookings(updatedBookings);
      
      toast({
        title: "Booking confirmed!",
        description: `You have successfully booked a ticket for "${event.name}".`,
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to book event', error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking.",
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  // Check if an event is booked by the current user
  const isEventBooked = (eventId: string) => {
    if (!user) return false;
    return bookings.some(booking => booking.eventId === eventId && booking.userId === user._id);
  };

  return (
    <EventContext.Provider value={{
      events,
      bookings,
      isLoading,
      filters,
      setFilters,
      pagination,
      setPage,
      setLimit,
      getEvent,
      getBookedEvents,
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

function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}

export { useEvents, EventProvider };
