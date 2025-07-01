
import React from 'react';
import Layout from '@/components/layout/Layout';
import EventGrid from '@/components/events/EventGrid';
import FilterBox, { FilterValues } from '@/components/events/FilterBox';
import { EventProvider, useEvents } from '@/contexts/EventContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ShinyText from '@/components/ui/shinytext';
import GradientText from '@/components/ui/gradientText';
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Search, Ticket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Aurora from '@/components/ui/Aurora';
import { toast } from "sonner";

const HomePage = () => {
  const { events, isLoading, pagination, setPage, setFilters } = useEvents();
  const { user } = useAuth();
  const defaultEventsNum = 6;
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleFilterChange = (filters: FilterValues) => {
    setPage(1); // Reset to first page when filters change
    setFilters(filters);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get the email from the form
    const form = e.target as HTMLFormElement;
    const email = new FormData(form).get('email') as string;
    
    // Show toast notification
    toast.info(
      "Newsletter Coming Soon", 
      { 
        description: `Thanks for your interest! Our newsletter is coming soon.`,
        duration: 5000,
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismissed")
        },
      }
    );
    
    // Reset the form
    form.reset();
  };

  return (
    <Layout>
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins bg-gradient-to-r from-danevents-400 to-danevents-700 text-transparent bg-clip-text pb-2">
            <GradientText colors={['#ffaa40', '#9c40ff', '#ffaa40']} className='text-transparent bg-clip-text pb-2' animationSpeed={8} showBorder={false}>
                DanEvents - Find Amazing Events
            </GradientText>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find and book tickets for the best events in your area. From concerts to workshops, we've got you covered.
          </p>
          {!user && (
            <div className="pt-2">
              <Link to="/register">
                <Button size="lg" className="animate-fade-in"><ShinyText text='Get Started' disabled={false} speed={3}/></Button>
              </Link>
            </div>
          )}
        </section>



        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold font-poppins">Upcoming Events</h2>
          </div>

          <FilterBox onFilterChange={handleFilterChange} />

          {isLoading ? (
            <EventGrid events={Array(defaultEventsNum).fill({
                  id: '',
                  title: '',
                  description: '',
                  date: '',
                  time: '',
                  location: '',
                  price: 0,
                  category: '',
                  image: '',
                  organizerId: ''
                })}    pagination={{currentPage:0, totalPages:0}}
                       onPageChange={handlePageChange} 
                       loading={true}/>
            
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          ) : (
            <EventGrid events={events} 
                        pagination={{
                          currentPage: pagination.currentPage,
                          totalPages: pagination.totalPages
                        }}
                        onPageChange={handlePageChange} loading={false} />
          )}
        </section>


        <section className="py-10 space-y-6">
          <h2 className="text-2xl font-semibold font-poppins text-center">How DanEvents Works</h2>
          <p className="text-center text-muted-foreground max-w-lg mx-auto">
            Booking your next event is simple and straightforward with our easy-to-use platform
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-danevents-100 dark:bg-danevents-900/20 h-14 w-14 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-danevents-500" />
              </div>
              <h3 className="font-semibold mb-2">Find Events</h3>
              <p className="text-muted-foreground">Discover events that match your interests using our advanced filters</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-danevents-100 dark:bg-danevents-900/20 h-14 w-14 rounded-full flex items-center justify-center mb-4">
                <Ticket className="h-6 w-6 text-danevents-500" />
              </div>
              <h3 className="font-semibold mb-2">Book Tickets</h3>
              <p className="text-muted-foreground">Secure your spot with our simple booking process</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-danevents-100 dark:bg-danevents-900/20 h-14 w-14 rounded-full flex items-center justify-center mb-4">
                <CalendarCheck className="h-6 w-6 text-danevents-500" />
              </div>
              <h3 className="font-semibold mb-2">Attend & Enjoy</h3>
              <p className="text-muted-foreground">Get reminders and access your tickets from your account</p>
            </div>
          </div>
        </section>


        <section className="py-12 relative overflow-hidden rounded-lg">
          {/* Aurora Background */}
          <div className="absolute inset-0 -z-10">
            <Aurora 
              colorStops={[
                "#9333EA", 
                "#7C3AED",
                "#A855F7",
                "#8B5CF6"
              ]}
              amplitude={1.2}
              blend={0.6}
              speed={0.5}
            />
          </div>
          
          {/* Semi-transparent overlay for better text readability */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm -z-5"></div>
          
          {/* Newsletter Content */}
          <div className="max-w-xl mx-auto text-center px-4 relative z-10">
            <h2 className="text-2xl font-semibold mb-3">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to receive updates on new events and special offers
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubscribe}>
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-background/70 backdrop-blur-sm border-background" 
                required
              />
              <Button type="submit" className="bg-primary/90 backdrop-blur-sm hover:bg-primary">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
