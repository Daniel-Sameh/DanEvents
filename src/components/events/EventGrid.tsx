
import React from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
  console.log(`EventGrid rendering with ${events.length} events`);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length > 0 ? (
        events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <p className="col-span-3 text-center py-10 text-muted-foreground">No events found</p>
      )}
    </div>
  );
};

export default EventGrid;
