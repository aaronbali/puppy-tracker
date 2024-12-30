import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { TrashIcon } from './components/ui/TrashIcon';
import { ScrollArea } from './components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger } from './components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/ui/alert-dialog';
import { api } from './lib/axios';

interface PuppyEvent {
  type: 'pee' | 'poop' | 'water' | 'food';
  timestamp: string;
  id: number;
}

export const PuppyTracker = () => {
  const [events, setEvents] = useState<PuppyEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'pee' | 'poop' | 'water' | 'food'>('all');
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Prevent scrollbar jump when confetti shows
  useEffect(() => {
    if (showConfetti) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [showConfetti]);

  const fetchEvents = async () => {
    try {
      const response = await api.get<PuppyEvent[]>('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      await api.delete(`/api/events/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id));
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const addEvent = async (type: PuppyEvent['type']) => {
    const newEvent: PuppyEvent = {
      type,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    if (type === 'poop') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000); // Hide confetti after 1 second
    }

    try {
      await api.post('/api/events', newEvent);
      setEvents(prev => [newEvent, ...prev]);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const getLastTime = (type: PuppyEvent['type']) => {
    const typeEvents = events.filter(e => e.type === type);
    if (typeEvents.length === 0) return null;
    return typeEvents[0].timestamp;
  };

  const getLastInterval = (type: PuppyEvent['type']) => {
    const typeEvents = events.filter(e => e.type === type);
    if (typeEvents.length < 2) return null;
    
    const latest = new Date(typeEvents[0].timestamp);
    const previous = new Date(typeEvents[1].timestamp);
    const diff = latest.getTime() - previous.getTime();
    
    // Convert to hours and minutes
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastTime = (date: string | null) => {
    if (!date) return 'No events yet';
    return formatTime(date);
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  return (
    <div className="relative">
      {showConfetti && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 9999,
          pointerEvents: 'none'
        }}>
          <ReactConfetti 
            width={document.documentElement.clientWidth}
            height={document.documentElement.clientHeight * 2} 
            numberOfPieces={400}
            recycle={false}
          />
        </div>
      )}
      <div className="w-full max-w-md mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Winnie Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button size="xl" className="w-full" onClick={() => addEvent('pee')}>
                🚽 Pee
              </Button>
              <Button size="xl" className="w-full" onClick={() => addEvent('poop')}>
                💩 Poop
              </Button>
              <Button size="xl" className="w-full" onClick={() => addEvent('water')}>
                💧 Water
              </Button>
              <Button size="xl" className="w-full" onClick={() => addEvent('food')}>
                🍖 Food
              </Button>
            </div>

            <div className="mb-4 space-y-2">
              <h3 className="text-lg font-semibold">Last Activity Times:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <div>🚽 Last Pee: {formatLastTime(getLastTime('pee'))}</div>
                  <div className="text-gray-600">Interval: {getLastInterval('pee') || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <div>💩 Last Poop: {formatLastTime(getLastTime('poop'))}</div>
                  <div className="text-gray-600">Interval: {getLastInterval('poop') || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <div>💧 Last Water: {formatLastTime(getLastTime('water'))}</div>
                  <div className="text-gray-600">Interval: {getLastInterval('water') || 'N/A'}</div>
                </div>
                <div className="space-y-1">
                  <div>🍖 Last Food: {formatLastTime(getLastTime('food'))}</div>
                  <div className="text-gray-600">Interval: {getLastInterval('food') || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  {filter === 'all' && '🔍 All Events'}
                  {filter === 'pee' && '🚽 Pee'}
                  {filter === 'poop' && '💩 Poop'}
                  {filter === 'water' && '💧 Water'}
                  {filter === 'food' && '🍖 Food'}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🔍 All Events</SelectItem>
                  <SelectItem value="pee">🚽 Pee</SelectItem>
                  <SelectItem value="poop">💩 Poop</SelectItem>
                  <SelectItem value="water">💧 Water</SelectItem>
                  <SelectItem value="food">🍖 Food</SelectItem>
                </SelectContent>
              </Select>

              <ScrollArea className="h-[40vh] rounded-md border p-4">
                {filteredEvents.map(event => (
                  <div 
                    key={event.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <span>
                      {event.type === 'pee' && '🚽'}
                      {event.type === 'poop' && '💩'}
                      {event.type === 'water' && '💧'}
                      {event.type === 'food' && '🍖'}
                      {' '}
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {formatTime(event.timestamp)}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-500"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this {event.type} entry from {formatTime(event.timestamp)}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteEvent(event.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
