export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'mentor' | 'junior';
  profile_pic: string;
  age: number;
  college: string;
  stream: string;
  available_for_mentorship?: boolean;
  joined_communities: string[];
  joined_clubs: string[];
  connected_mentors: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  member_count: number;
  clubs: Club[];
  mentors: User[];
  chat_rooms: ChatRoom[];
  created_at?: string;
  updated_at?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  community_id: string;
  club_head: string;
  member_count: number;
  chat_rooms: ChatRoom[];
  created_at?: string;
  updated_at?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  community_id?: string;
  club_id?: string;
  created_by: string;
  member_count: number;
  last_message?: string;
  last_message_time?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  timestamp: string;
  room_id: string;
  created_at?: string;
}
