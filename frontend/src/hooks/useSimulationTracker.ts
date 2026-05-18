import { useState, useCallback, useRef } from 'react';

export interface Pin {
  id: string;
  x: number; // percentage relative to image width
  y: number; // percentage relative to image height
}

export interface SimulationEvent {
  type: 'PLACE_PIN' | 'REMOVE_PIN';
  id: string;
  x?: number;
  y?: number;
  timestamp: number;
}

export const useSimulationTracker = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const eventsRef = useRef<SimulationEvent[]>([]);

  const addPin = useCallback((x: number, y: number) => {
    const newId = `pin-${Date.now()}`;
    const newPin = { id: newId, x, y };
    
    setPins(prev => [...prev, newPin]);
    eventsRef.current.push({
      type: 'PLACE_PIN',
      id: newId,
      x,
      y,
      timestamp: Date.now()
    });
    
    return newId;
  }, []);

  const removePin = useCallback((id: string) => {
    setPins(prev => prev.filter(p => p.id !== id));
    eventsRef.current.push({
      type: 'REMOVE_PIN',
      id,
      timestamp: Date.now()
    });
  }, []);

  const getEvents = useCallback(() => {
    return [...eventsRef.current];
  }, []);

  const clearTracker = useCallback(() => {
    setPins([]);
    eventsRef.current = [];
  }, []);

  return {
    pins,
    addPin,
    removePin,
    getEvents,
    clearTracker
  };
};
