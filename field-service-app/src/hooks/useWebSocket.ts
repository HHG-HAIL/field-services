import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { connectWebSocket } from '../config/api';

export const useWebSocket = () => {
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    stompClientRef.current = connectWebSocket();

    // Cleanup function to disconnect when component unmounts
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, []);

  const sendMessage = (destination: string, body: any) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify(body)
      });
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return {
    isConnected: stompClientRef.current?.connected || false,
    sendMessage
  };
};