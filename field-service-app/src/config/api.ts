// API Configuration for Spring Boot Backend Integration
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com' 
  : 'http://localhost:8081';

export const API_ENDPOINTS = {
  WORK_ORDERS: `${API_BASE_URL}/api/work-orders`,
  TECHNICIANS: 'http://localhost:8082/api/technicians',
  SCHEDULES: 'http://localhost:8083/api/schedules',
  WS_ENDPOINT: `http://localhost:8081/ws`
};

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// WebSocket connection for real-time updates
export const connectWebSocket = () => {
  if (typeof window !== 'undefined') {
    // Create STOMP client with SockJS
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(API_ENDPOINTS.WS_ENDPOINT),
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: (frame) => {
        console.log('Connected to WebSocket:', frame);
        
        // Subscribe to work order updates
        stompClient.subscribe('/topic/workorders', (message) => {
          const workOrder = JSON.parse(message.body);
          // Handle work order update
          window.dispatchEvent(new CustomEvent('workOrderUpdate', { detail: workOrder }));
        });
        
        stompClient.subscribe('/topic/workorders/assigned', (message) => {
          const assignment = JSON.parse(message.body);
          // Handle assignment update
          window.dispatchEvent(new CustomEvent('workOrderAssigned', { detail: assignment }));
        });
      },
      onDisconnect: (frame) => {
        console.log('Disconnected from WebSocket:', frame);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    });
    
    // Activate the connection
    stompClient.activate();
    
    return stompClient;
  }
  return null;
};