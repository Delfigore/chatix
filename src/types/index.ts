export interface Tweet {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  likes: number;
  retweets: number;
  image_url?: string;
  youtube_url?: string;
  twitch_url?: string;
  link_url?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
  };
}

export interface TweetState {
  tweets: Tweet[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export class TwitterCloneError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'TwitterCloneError';
  }
}

export type SupabaseResponse<T> = {
  data: T | null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null;
}