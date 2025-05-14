
import React, { useState } from 'react';
import { EventProvider, useEvents } from '@/contexts/EventContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from '@/types';
import { ImageUpload } from '@/components/ui/image-upload';

interface EventFormProps {
  event?: Event;
  onCancel: () => void;
  onSuccess: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: event?.name || '',
    description: event?.description || '',
    category: event?.category || '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    venue: event?.venue || '',
    price: event?.price || 0,
    imageUrl: event?.imageUrl || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addEvent, updateEvent } = useEvents();
  const { toast } = useToast();
  const isEditMode = !!event;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleImageSelected = (data: { file?: File; imageUrl?: string }) => {
    if (data.file) {
      setImageFile(data.file);
      setFormData(prev => ({ ...prev, imageUrl: URL.createObjectURL(data.file) }));
    } else if (data.imageUrl) {
      setImageFile(null);
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
    }
  };

  const handleImageError = (error: string) => {
    toast({
      title: "Image upload failed",
      description: error,
      variant: "destructive"
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData if we have a file
      const submitData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'imageUrl') { // Don't append imageUrl if we have a file
          submitData.append(key, value.toString());
          console.log(`Appending ${key}: ${value}`);
        }
      });

      // Append file if exists
      if (imageFile) {
        submitData.append('file', imageFile);
      } else if (formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl);
        console.log('Appending imageUrl:', formData.imageUrl);
      }
      // console.log('FormData contents:');
      // for (let pair of submitData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      if (isEditMode && event) {
        await updateEvent(event._id, submitData);
        toast({
          title: "Event updated",
          description: "The event has been updated successfully",
        });
      } else {
        await addEvent(submitData);
        toast({
          title: "Event created",
          description: "The new event has been created successfully",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: `Failed to ${isEditMode ? 'update' : 'create'} event`,
        description: "Please check the form and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Enter event name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Enter event description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Enter category"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Enter venue"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Event Image</Label>
            <ImageUpload
                onImageSelected={handleImageSelected}
                onError={handleImageError}
              />
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Event preview"
              className="max-w-xs rounded-md"
            />
          </div>
        )}
          </div>
          
          <div className="pt-2 flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Saving...' : 'Creating...'}
                </span>
              ) : (
                isEditMode ? 'Save Changes' : 'Create Event'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
