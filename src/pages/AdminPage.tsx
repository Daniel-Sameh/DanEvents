
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import EventsTable from '@/components/admin/EventsTable';
import EventForm from '@/components/admin/EventForm';
import { useEvents } from '@/contexts/EventContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Event } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from 'lucide-react';

const AdminPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const { events, isLoading, deleteEvent } = useEvents();
  const { toast } = useToast();

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingEvent(null);
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsCreating(false);
  };

  const handleDeleteClick = (eventId: string) => {
    setDeleteEventId(eventId);
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setEditingEvent(null);
  };

  const handleFormSuccess = () => {
    setIsCreating(false);
    setEditingEvent(null);
  };

  const confirmDelete = async () => {
    if (!deleteEventId) return;
    
    try {
      await deleteEvent(deleteEventId);
      toast({
        title: "Event deleted",
        description: "The event has been deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete event', error);
      toast({
        title: "Failed to delete event",
        description: "There was an error deleting the event.",
        variant: "destructive",
      });
    } finally {
      setDeleteEventId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-poppins">Admin Dashboard</h1>
          {!isCreating && !editingEvent && (
            <Button onClick={handleCreateClick}>
              <Plus className="h-4 w-4 mr-1.5" />
              Create Event
            </Button>
          )}
        </div>

        {(isCreating || editingEvent) ? (
          <EventForm 
            event={editingEvent || undefined}
            onCancel={handleCancelForm}
            onSuccess={handleFormSuccess}
          />
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
              {isLoading ? (
                <div className="py-10 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-eventide-500"></div>
                </div>
              ) : (
                <EventsTable
                  events={events}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              )}
            </div>
          </div>
        )}

        <AlertDialog open={!!deleteEventId} onOpenChange={() => setDeleteEventId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event and remove all associated bookings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default AdminPage;
