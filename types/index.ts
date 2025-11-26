
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  neighbourhood: string;
  tags: string[];
  verified: boolean;
  joinedDate: string;
  bio?: string;
}

export interface Incident {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  category: 'theft' | 'vandalism' | 'suspicious' | 'accident' | 'fire' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  media?: string[];
  confirmations: number;
  confirmed: boolean;
  status: 'active' | 'resolved' | 'investigating';
}

export interface SafetyTracking {
  id: string;
  userId: string;
  userName: string;
  startTime: string;
  estimatedArrival: string;
  destination: string;
  status: 'active' | 'delayed' | 'arrived' | 'emergency';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  watchers: string[];
}

export interface CommunityChannel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastActivity: string;
  icon: string;
  category: 'general' | 'safety' | 'events' | 'marketplace' | 'help';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: string;
  organizerId: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees?: number;
  category: 'social' | 'safety' | 'cleanup' | 'meeting' | 'workshop';
  image?: string;
  rsvpStatus?: 'going' | 'interested' | 'not-going';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}
