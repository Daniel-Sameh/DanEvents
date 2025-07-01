
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '@/types';
import { EventProvider, useEvents } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { isEventBooked } = useEvents();
  const isBooked = isEventBooked(event._id);
  
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
          <span className="text-danevents-500 font-medium">${event.price}</span>
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
        <div className="w-full flex items-center gap-2 flex-wrap">
          <Link to={`/events/${event._id}`} className={isBooked ? "flex-1" : "w-full"}>
            <Button className="w-full">View Details</Button>
          </Link>
          {isBooked && (
            <div className="flex items-center justify-center text-sm text-muted-foreground border border-border rounded-md px-3 py-2 shrink-0">
              <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Booked</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
