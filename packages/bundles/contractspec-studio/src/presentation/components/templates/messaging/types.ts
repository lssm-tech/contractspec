export interface Participant {
  id: string;
  userId: string;
  displayName?: string | null;
  role?: string | null;
  lastReadAt?: string | null;
}

export interface Conversation {
  id: string;
  name?: string | null;
  isGroup: boolean;
  avatarUrl?: string | null;
  updatedAt: string;
  participants: Participant[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName?: string | null;
  createdAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}










