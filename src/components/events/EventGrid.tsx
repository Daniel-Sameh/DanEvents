
import React from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';

interface EventGridProps {
  events: Event[];
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;
