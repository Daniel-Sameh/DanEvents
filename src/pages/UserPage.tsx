import React, { useState, useRef, useEffect } from 'react';
import { User, Event } from '@/types';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import EventCard from '@/components/events/EventCard';
import { Pencil, Trash2, Crown, Eye, EyeOff, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const UserPage = () => {
  const { user, updateProfile, isAdmin, deleteAccount, isLoading: authLoading, uploadProfileImage } = useAuth();
  const { events, bookings, getBookedEvents, isLoading: eventsLoading } = useEvents();
  const [editImgOpen, setEditImgOpen] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [profileImg, setProfileImg] = useState('');
  const [bookedEvents, setBookedEvents] = useState<Event[]>([]);

  // Update form and profile image when user data changes
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
      setProfileImg(user.profileImageUrl || '');
    }
  }, [user]);

  // Get booked events
  useEffect(() => {
    const fetchBookedEvents = async () => {
      const userBookedEvents = await getBookedEvents();
      setBookedEvents(userBookedEvents);
    };

    fetchBookedEvents();

  }, [bookings, events]);

  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const fileInputRef = useRef(null);

  if (authLoading || eventsLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You must be logged in to view this page.</p>
          <Button onClick={() => window.location.href = '/login'}>Login</Button>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {

        const newImageUrl = await uploadProfileImage(file);
        console.log("frontend got the url of image= ", newImageUrl);
        setProfileImg(String(newImageUrl.url));

      } finally {
        setLoading(false);
        setEditImgOpen(false);
      }
    }
  };

  const handleRemoveProfileImg = async () => {
    const confirmed = window.confirm("Are you sure you want to remove your profile image? You will need to log out and log back in to see the changes.");
    if (!confirmed) return;

    setLoading(true);
    try {
      await updateProfile({ profileImageUrl: '' });
      setProfileImg('');
      // Redirect to logout after confirming
      window.location.href = '/logout';
    } finally {
      setLoading(false);
      setEditImgOpen(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        ...(form.password ? { password: form.password } : {})
      });
      setEditProfile(false);
      // Clear password field after successful update
      setForm(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
    } finally {
      setLoading(false);
      setDeleteDialog(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Section */}
          <div className="lg:w-1/3 space-y-6">
            <Card className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    {profileImg ? (
                      <AvatarImage src={profileImg} alt={user.name} />
                    ) : (
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    )}
                  </Avatar>
                  <button
                    className="absolute bottom-2 right-2 bg-background rounded-full p-2 shadow group-hover:opacity-100 opacity-0 transition-opacity"
                    onClick={() => setEditImgOpen(true)}
                    title="Edit profile image"
                  >
                    <Pencil className="w-5 h-5 text-primary" />
                  </button>
                  {isAdmin && (
                    <span title="Admin">
                      <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 drop-shadow" />
                    </span>
                  )}
                </div>
                <Dialog open={editImgOpen} onOpenChange={setEditImgOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile Image</DialogTitle>
                      <DialogDescription>
                        Choose a new profile image or remove the current one.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <label className="block">
                        <span className="block text-sm font-medium mb-1">Choose profile image</span>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleProfileImgChange}
                          className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-violet-700
                            hover:file:bg-violet-100"
                          aria-label="Choose profile image"
                        />
                      </label>
                      <div className="flex justify-end gap-4">
                        <Button variant="destructive" onClick={handleRemoveProfileImg} disabled={loading}>
                          <Trash2 className="mr-2" /> Remove Image
                        </Button>
                        <Button variant="outline" onClick={() => setEditImgOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                  <form className="w-full space-y-4 mt-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                    <div>
                      <label className="block mb-1 font-medium">Name</label>
                      <Input name="name" value={form.name} onChange={handleInputChange} disabled={loading} />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Email</label>
                      <Input name="email" value={form.email} onChange={handleInputChange} disabled={loading} />
                    </div>
                    <div className="relative">
                      <label className="block mb-1 font-medium">Password</label>
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleInputChange}
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-9 text-muted-foreground hover:text-primary"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
        
                    <div className="flex justify-center gap-4">
                      <Button type="submit" disabled={loading} className='w-full'>Save Changes</Button>
                    </div>
                  </form>
                  
                  <div className="pt-4 border-t w-full">
                    <Button 
                      variant="destructive" 
                      onClick={() => setDeleteDialog(true)}
                      className="w-full"
                    >
                      <Trash2 className="mr-2" /> Delete Account
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          
            {/* Bookings Section */}
            <div className="lg:w-2/3">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
                {bookedEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-2">No Bookings Yet</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      You haven't booked any events yet. Explore our events and book something exciting!
                    </p>
                    <Button onClick={() => window.location.href = '/'}>
                      Explore Events
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Tabs defaultValue="grid">
                      <div className="flex justify-between items-center mb-6">
                        <p className="text-muted-foreground">
                          Showing {bookedEvents.length} booked event{bookedEvents.length !== 1 ? 's' : ''}
                        </p>
                        <TabsList>
                          <TabsTrigger value="grid">Grid</TabsTrigger>
                          <TabsTrigger value="list">List</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="grid" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {bookedEvents.map(event => (
                            <EventCard key={event._id} event={event} loading={false} />
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="list" className="mt-0">
                        <div className="space-y-4">
                          {bookedEvents.map(event => (
                            <div key={event._id} className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                              <div className="sm:w-1/4 h-32 rounded-md overflow-hidden">
                                <img 
                                  src={event.imageUrl} 
                                  alt={event.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="sm:w-3/4 flex flex-col">
                                <h3 className="font-semibold text-lg">{event.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground my-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  <span>{formatDate(event.date)}</span>
                                  <span className="mx-2">•</span>
                                  <span>{event.venue}</span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{event.description}</p>
                                <div className="mt-auto flex justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.location.href = `/events/${event._id}`}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </Card>
            </div>
          </div>
  
          <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete your account? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline" disabled={loading}>Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                    Delete Account
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Layout>
  );
};

export default UserPage;