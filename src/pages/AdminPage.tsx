
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import EventsTable from '@/components/admin/EventsTable';
import UsersTable from '@/components/admin/UsersTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventForm from '@/components/admin/EventForm';
import { EventProvider, useEvents } from '@/contexts/EventContext';
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
import { api } from '@/services/api';
import { User } from '@/types';

const AdminPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const { events, isLoading, deleteEvent, pagination, setPage  } = useEvents();
  const { toast } = useToast();


  const handlePageChange = (page: number) => {
    setPage(page);
  };

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

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const fetchedUsers = await api.getUsers();
        for(const user of fetchedUsers) {
          user.role = user.isAdmin ? 'admin' : 'user';
        }
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to load users', error);
        toast({
          title: "Error loading users",
          description: "Failed to load user list.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    try {
      const updatedUser = await api.toggleUserRole(userId);
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isAdmin: !user.isAdmin, role: user.isAdmin ? 'user' : 'admin' }
          : user
      ));
      toast({
        title: "Role updated",
        description: `User is now a ${updatedUser.role}`,
      });
    } catch (error) {
      console.error('Failed to update user role', error);
      toast({
        title: "Failed to update role",
        description: "There was an error updating the user's role.",
        variant: "destructive"
      });
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
          <Tabs defaultValue="events" className="w-full">
            <TabsList>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="bg-card rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
                  {isLoading ? (
                    <div className="py-10 flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-danevents-500"></div>
                    </div>
                  ) : (
                    <EventsTable
                      events={events}
                      pagination={{
                        currentPage: pagination.currentPage,
                        totalPages: pagination.totalPages
                      }}
                      onPageChange={handlePageChange}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteClick}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="bg-card rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
                  {isLoadingUsers ? (
                    <div className="py-10 flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-danevents-500"></div>
                    </div>
                  ) : (
                    <UsersTable
                      users={users}
                      onToggleAdmin={handleToggleAdmin}
                    />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
