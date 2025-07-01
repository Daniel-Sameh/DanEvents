import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export interface FilterValues {
  category?: string;
  startDate?: string;
  endDate?: string;
  booked?: 'true' | 'false' | 'all';
  sort?: 'asc' | 'desc';
}

interface FilterBoxProps {
  onFilterChange: (filters: FilterValues) => void;
}


const categories = [
  "All Categories",
  "Technology",
  "Music",
  "Food & Drink",
  "Business",
  "Wellness",
  "Marketing",
  "Education",
  "Art & Culture",
  "Sports",
  "Networking"
];

const FilterBox: React.FC<FilterBoxProps> = ({ onFilterChange }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    category: undefined,
    startDate: undefined,
    endDate: undefined,
    booked: undefined,
    sort: 'asc'
  });
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Apply filters
  const applyFilters = () => {
    const appliedFilters: FilterValues = {};
    
    if (filters.category && filters.category !== "All Categories") {
      appliedFilters.category = filters.category;
    }
    
    if (startDate) {
      appliedFilters.startDate = startDate.toISOString();
    }
    
    if (endDate) {
      appliedFilters.endDate = endDate.toISOString();
    }
    
    if (user && filters.booked) {
      appliedFilters.booked = filters.booked;
    }
    
    if (filters.sort) {
      appliedFilters.sort = filters.sort;
    }
    
    onFilterChange(appliedFilters);
    setIsOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: undefined,
      startDate: undefined,
      endDate: undefined,
      booked: undefined,
      sort: 'asc'
    });
    setStartDate(undefined);
    setEndDate(undefined);
    onFilterChange({});
    setIsOpen(false);
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  // Update date fields when dates change
  useEffect(() => {
    const newFilters = { ...filters };
    if (startDate) {
      newFilters.startDate = startDate.toISOString();
    } else {
      delete newFilters.startDate;
    }
    
    if (endDate) {
      newFilters.endDate = endDate.toISOString();
    } else {
      delete newFilters.endDate;
    }
    
    setFilters(newFilters);
  }, [startDate, endDate]);

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilter}
          className="flex items-center gap-2"
        >
          <FilterIcon size={16} />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        {isOpen && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-muted-foreground"
          >
            Reset
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="bg-card rounded-lg p-4 shadow-md border animate-in fade-in-50 slide-in-from-top-5 duration-300 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category || "All Categories"}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => 
                      startDate ? date < startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Booking Status Filter (for logged in users only) */}
            {user && (
              <div className="space-y-2">
                <Label htmlFor="booked">Booking Status</Label>
                <Select
                  value={filters.booked || "all"}
                  onValueChange={(value) => 
                    setFilters({ 
                      ...filters, 
                      booked: value as 'true' | 'false' | 'all' 
                    })
                  }
                >
                  <SelectTrigger id="booked">
                    <SelectValue placeholder="Booking Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="true">Booked Events</SelectItem>
                    <SelectItem value="false">Not Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sort">Sort By Date</Label>
              <Select
                value={filters.sort || "asc"}
                onValueChange={(value) => 
                  setFilters({ 
                    ...filters, 
                    sort: value as 'asc' | 'desc' 
                  })
                }
              >
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Earliest First</SelectItem>
                  <SelectItem value="desc">Latest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-24"
            >
              Cancel
            </Button>
            <Button 
              onClick={applyFilters}
              className="w-24"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBox;
