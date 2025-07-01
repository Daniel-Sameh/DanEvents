
import React from 'react';
import { Event } from '@/types';
import EventCard from './EventCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EventGridProps {
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  loading: boolean;
}

const EventGrid: React.FC<EventGridProps> = ({ 
    events, 
    pagination: { currentPage, totalPages }, 
    onPageChange,
    loading
  }) => {
  console.log(`EventGrid rendering with ${events.length} events`);
  console.log(`Loading is ${loading}`);
  
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading || events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event._id} event={event} loading={loading} />
          ))
        ) : (
          <p className="col-span-3 text-center py-10 text-muted-foreground">No events found</p>
        )}
      </div>
      {!loading && totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              {/* Previous button */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(currentPage - 1);
                    }} 
                  />
                </PaginationItem>
              )}
              
              {/* Page numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show first page, last page, and pages around current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange?.(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis for gaps
                if (
                  (pageNumber === 2 && currentPage > 3) ||
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                return null;
              })}
              
              {/* Next button */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange?.(currentPage + 1);
                    }} 
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default EventGrid;
