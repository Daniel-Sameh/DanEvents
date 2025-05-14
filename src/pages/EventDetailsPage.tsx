
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { EventProvider, useEvents } from '@/contexts/EventContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, bookEvent, isEventBooked } = useEvents();
  const { user } = useAuth();
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const event = id ? getEvent(id) : undefined;
  const isBooked = id ? isEventBooked(id) : false;

  if (!event) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Back to Events</Button>
        </div>
      </Layout>
    );
  }

  const handleBookEvent = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isBooked || isBooking) return;

    setIsBooking(true);
    try {
      await bookEvent(event._id);
      setBookingSuccess(true);
    } catch (error) {
      console.error('Failed to book event:', error);
    } finally {
      setIsBooking(false);
    }
  };

  if (bookingSuccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <div className="bg-green-50 rounded-full p-6 mb-6">
            <svg className="h-16 w-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-center text-muted-foreground mb-8 max-w-md">
            Your ticket for "{event.name}" has been booked successfully.
          </p>
          <Button onClick={() => navigate('/')}>Back to Events</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-slide-up">
        <div className="bg-card rounded-lg overflow-hidden shadow-md">
          <div className="h-64 sm:h-80 md:h-96 overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold font-poppins">{event.name}</h1>
                <span className="text-xl font-semibold text-danevents-500">${event.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-1.5" />
                <span>{formatDate(event.date)}</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">About this event</h2>
              <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">Category</h3>
                <p className="text-muted-foreground">{event.category}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Venue</h3>
                <p className="text-muted-foreground">{event.venue}</p>
              </div>
            </div>
            
            <div className="pt-4">
              {isBooked ? (
                <Button disabled variant="secondary" className="w-full sm:w-auto">
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Already Booked
                </Button>
              ) : (
                <Button 
                  onClick={handleBookEvent} 
                  disabled={isBooking || !user} 
                  className="w-full sm:w-auto"
                >
                  {isBooking ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </Button>
              )}
              {!user && (
                <p className="text-sm text-muted-foreground mt-2">
                  Please <Button variant="link" className="p-0" onClick={() => navigate('/login')}>log in</Button> to book this event.
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Events
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailsPage;
