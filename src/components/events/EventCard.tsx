
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { useEvents } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { isEventBooked } = useEvents();
  const isBooked = isEventBooked(event.id);
  
  return (
    <Card className="event-card flex flex-col h-full overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{event.name}</h3>
          <span className="text-eventide-500 font-medium">${event.price}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
          <span>{formatDate(event.date)}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        {isBooked ? (
          <Button variant="secondary" className="w-full" disabled>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Booked
            </span>
          </Button>
        ) : (
          <Link to={`/events/${event.id}`} className="w-full">
            <Button className="w-full">View Details</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
