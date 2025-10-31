export interface LiveEvent {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  hostId: number;
  channelName: string;
  token: string;
  maxParticipants: number;
  isRecording: boolean;
  recordingUrl?: string;
  status: 'scheduled' | 'live' | 'ended';
  createdAt: Date;
  updatedAt: Date;
}

export interface EventParticipant {
  id: number;
  eventId: number;
  userId: number;
  joinedAt: Date;
  leftAt?: Date;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  raisedHand: boolean;
}

export interface EventChatMessage {
  id: number;
  eventId: number;
  userId: number;
  message: string;
  timestamp: Date;
  isSystemMessage: boolean;
}