// API service for simulating backend calls

import { apiClient } from '@/lib/axios';
import { Event, Booking, User, UserWithPassword } from '@/types';

interface PaginatedResponse<T> {
  events: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasMore: boolean;
  };
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
interface RegisterResponse {
  message: string;
  status?: number;
}
interface ProfileImageResponse {
  url: string;
  message: string;
}
interface UpdateUserResponse {
  message: string;
  user: User;
}
export const api = {
    // Auth endpoints
    login: async (email: string, password: string): Promise<AuthResponse> => {
      console.log('Logging in with:', email);
      const response = await apiClient.post('/login', { email, password });
      console.log('Login response:', response.data);
      return response.data;
    },

    register: async (userData: { name: string; email: string; password: string }): Promise<RegisterResponse> => {
      const response = await apiClient.post('/register', userData);
      return response.data;
    },

    uploadProfileImage: async (file: File): Promise<ProfileImageResponse> => {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('profileImage', file);
        
        const response = await apiClient.post('/upload/profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    },

    getUserData: async (): Promise<User> => {
      const response = await apiClient.get('/account');
      console.log('User data fetched:', response.data);
      return response.data;
    },
    
    updateUserProfile: async (userData: Partial<User> & { password?: string; profileImage?: File }): Promise<UpdateUserResponse> => {
      // Create FormData if there's a file
      const formData = new FormData();
      
      // Add all user data fields to FormData
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'profileImage' && value instanceof Blob) {
            formData.append('file', value);
            console.log('Appending file to formData:', value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await apiClient.put('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update response:', response.data);
      console.log('response status:', response.status);
      
      return response.data;
    },

    getBookedEvents: async (): Promise<Booking[]> => {
      const response = await apiClient.get('/events/bookings');
      return response.data;
    },
    
    deleteUserAccount: async (): Promise<void> => {
      await apiClient.delete('/account');
    },
    
    // Events endpoints
    getEvents: async (
    page = 1, 
    limit = 6, 
    filters?: {
      category?: string;
      startDate?: string;
      endDate?: string;
      booked?: 'true' | 'false' | 'all';
      sort?: 'asc' | 'desc';
    }
  ): Promise<PaginatedResponse<Event>> => {
    console.log('Fetching events with page:', page, 'and limit:', limit, 'filters:', filters);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    // Add filters to params if they exist
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.booked) params.append('booked', filters.booked);
      if (filters.sort) params.append('sort', filters.sort);
    }

    const response = await apiClient.get(`/events?${params.toString()}`);
    return response.data;
  },
    
    getEvent: async (id: string): Promise<Event> => {
      const response = await apiClient.get(`/events/${id}`);
      return response.data;
    },
    
    createEvent: async (eventData: FormData): Promise<Event> => {
      // FormData already contains the file if it was appended
      console.log('Creating event with data:', Object.fromEntries(eventData));
      const response = await apiClient.post('/events', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    
    updateEvent: async (id: string, eventData: FormData): Promise<Event> => {  
      // console.log("eventData in api.ts: ");
      //   for (let pair of eventData.entries()) {
        //    console.log(pair[0],": ", pair[1]);
        //   }
        
        const response = await apiClient.put(`/events/${id}`, eventData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        console.log('Update response:', response.data);
        console.log('response status:', response.status);
        return response.data;
      },
      
      deleteEvent: async (id: string): Promise<void> => {
        await apiClient.delete(`/events/${id}`);
      },
      
      // Bookings endpoints
      getUserBookings: async (): Promise<Booking[]> => {
        const response = await apiClient.get(`/events/bookings`);
        return response.data;
      },
      
      bookEvent: async (eventId: string): Promise<Booking> => {
        const response = await apiClient.post(`/events/book/${eventId}`);
        return response.data;
      },

      getUsers: async (): Promise<User[]> => {
        const response = await apiClient.get('/');
        return response.data;
      },
  
      toggleUserRole: async (userId: string): Promise<User> => {
        const response = await apiClient.patch(`/${userId}/role`);
        return response.data;
      },

    };