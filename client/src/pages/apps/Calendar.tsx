import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppState } from '@/hooks/use-app-state';
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, parseISO, addMonths, addWeeks } from 'date-fns';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Event } from '@/types';
import { apiRequest } from '@/lib/queryClient';

export default function CalendarApp() {
  const { setCurrentApp } = useAppState();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    allDay: false,
    location: '',
    color: 'blue'
  });
  
  // Set the current app when component mounts
  useEffect(() => {
    setCurrentApp('calendar');
  }, [setCurrentApp]);
  
  // Fetch calendar events
  const { data: events = [], isLoading, refetch } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
  
  const handleCreateEvent = async () => {
    try {
      await apiRequest('POST', '/api/events', {
        ...newEvent,
        allDay: newEvent.allDay === 'true'
      });
      
      // Reset form and close dialog
      setNewEvent({
        title: '',
        description: '',
        startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
        allDay: false,
        location: '',
        color: 'blue'
      });
      setCreateEventOpen(false);
      
      // Refetch events
      refetch();
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };
  
  const navigatePrevious = () => {
    if (view === 'day') {
      setDate(prevDate => addDays(prevDate, -1));
    } else if (view === 'week') {
      setDate(prevDate => addWeeks(prevDate, -1));
    } else {
      setDate(prevDate => addMonths(prevDate, -1));
    }
  };
  
  const navigateNext = () => {
    if (view === 'day') {
      setDate(prevDate => addDays(prevDate, 1));
    } else if (view === 'week') {
      setDate(prevDate => addWeeks(prevDate, 1));
    } else {
      setDate(prevDate => addMonths(prevDate, 1));
    }
  };
  
  const navigateToday = () => {
    setDate(new Date());
  };
  
  const renderWeekView = () => {
    const startDate = startOfWeek(date);
    const days = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, 6)
    });
    
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    
    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-8 border-b border-neutral-light">
          <div className="p-2 text-center text-neutral-medium border-r border-neutral-light">
            Time
          </div>
          {days.map((day, i) => (
            <div
              key={i}
              className={`p-2 text-center border-r border-neutral-light ${
                isSameDay(day, new Date()) ? 'bg-primary-light/10 font-bold' : ''
              }`}
            >
              <div>{format(day, 'EEE')}</div>
              <div className="text-sm">{format(day, 'd')}</div>
            </div>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto grid grid-cols-8">
          <div className="col-span-1 border-r border-neutral-light">
            {hours.map(hour => (
              <div key={hour} className="h-20 border-b border-neutral-light px-2 text-xs text-neutral-medium">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="col-span-1 border-r border-neutral-light relative">
              {hours.map(hour => (
                <div key={hour} className="h-20 border-b border-neutral-light relative"></div>
              ))}
              
              {/* Render events for this day */}
              {events
                .filter(event => {
                  const eventDate = parseISO(event.startTime);
                  return isSameDay(eventDate, day);
                })
                .map(event => {
                  const eventStart = parseISO(event.startTime);
                  const eventEnd = parseISO(event.endTime);
                  
                  const startHour = eventStart.getHours() + (eventStart.getMinutes() / 60);
                  const endHour = eventEnd.getHours() + (eventEnd.getMinutes() / 60);
                  const duration = endHour - startHour;
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute left-0 right-0 mx-1 p-1 rounded bg-primary text-white text-xs overflow-hidden`}
                      style={{
                        top: `${startHour * 20}px`,
                        height: `${duration * 20}px`,
                      }}
                    >
                      <div className="font-bold truncate">{event.title}</div>
                      {event.location && (
                        <div className="flex items-center truncate">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-light p-4 flex flex-col">
        <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4" size="lg">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input 
                  id="title" 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="startTime" className="text-sm font-medium">Start Time</label>
                  <Input 
                    id="startTime" 
                    type="datetime-local" 
                    value={newEvent.startTime} 
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="endTime" className="text-sm font-medium">End Time</label>
                  <Input 
                    id="endTime" 
                    type="datetime-local" 
                    value={newEvent.endTime} 
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="allDay" className="text-sm font-medium">All Day</label>
                <Select 
                  value={String(newEvent.allDay)} 
                  onValueChange={(value) => setNewEvent({ ...newEvent, allDay: value === 'true' })}
                >
                  <SelectTrigger id="allDay">
                    <SelectValue placeholder="Is this an all day event?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input 
                  id="location" 
                  value={newEvent.location} 
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} 
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="color" className="text-sm font-medium">Color</label>
                <Select 
                  value={newEvent.color} 
                  onValueChange={(value) => setNewEvent({ ...newEvent, color: value })}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea 
                  id="description" 
                  rows={4} 
                  value={newEvent.description} 
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateEventOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateEvent}>Create Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal mb-4">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <div className="space-y-1 mb-4">
          <Button 
            variant={view === 'day' ? 'default' : 'outline'} 
            className="w-full justify-start" 
            onClick={() => setView('day')}
          >
            Day View
          </Button>
          <Button 
            variant={view === 'week' ? 'default' : 'outline'} 
            className="w-full justify-start" 
            onClick={() => setView('week')}
          >
            Week View
          </Button>
          <Button 
            variant={view === 'month' ? 'default' : 'outline'} 
            className="w-full justify-start" 
            onClick={() => setView('month')}
          >
            Month View
          </Button>
        </div>
        
        <div className="border-t border-neutral-light pt-4 mt-4">
          <h3 className="font-medium mb-2">Upcoming Events</h3>
          {isLoading ? (
            <div className="text-sm text-neutral-medium">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-sm text-neutral-medium">No upcoming events</div>
          ) : (
            <div className="space-y-2">
              {events.slice(0, 4).map(event => (
                <div 
                  key={event.id} 
                  className="p-2 text-sm rounded-md border-l-4 border-primary bg-neutral-light"
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="flex items-center text-xs text-neutral-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(parseISO(event.startTime), 'PPp')}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-xs text-neutral-medium">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-light flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={navigateToday}>Today</Button>
            <h2 className="text-xl font-semibold ml-4">
              {view === 'day' && format(date, 'EEEE, MMMM d, yyyy')}
              {view === 'week' && `Week of ${format(startOfWeek(date), 'MMMM d, yyyy')}`}
              {view === 'month' && format(date, 'MMMM yyyy')}
            </h2>
          </div>
          <Select
            value={view}
            onValueChange={(value: 'day' | 'week' | 'month') => setView(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center text-neutral-medium">Loading calendar...</div>
          ) : (
            <>
              {view === 'week' && renderWeekView()}
              {view === 'day' && (
                <div className="p-4 text-center">
                  <p>Day view implementation would go here</p>
                </div>
              )}
              {view === 'month' && (
                <div className="p-4 text-center">
                  <p>Month view implementation would go here</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
