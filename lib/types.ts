export interface User {
  id: string
  username: string
  display_name: string
  email?: string
  bio?: string
  avatar_url?: string
  location?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface Band {
  id: string
  name: string
  username: string
  description?: string
  avatar_url?: string
  cover_image_url?: string
  website_url?: string
  spotify_url?: string
  youtube_url?: string
  instagram_url?: string
  location?: string
  genres?: string[]
  founded_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// The new unified Profile type
export type Profile = (User & { type: 'user' }) | (Band & { type: 'band' });

export interface UserBand {
  id: string
  user_id: string
  band_id: string
  role: 'owner' | 'member' | 'admin'
  joined_date: string
  is_active: boolean
  // Relational data
  user?: User
  band?: Band
}

export interface Release {
  id: string
  title: string
  description: string | null
  artist_id: string // This will always be a band
  cover_image_url: string | null
  youtube_url: string | null
  spotify_url: string | null
  apple_music_url: string | null
  soundcloud_url: string | null
  release_date: string | null
  genres: string[] | null
  tags: string[] | null
  vote_count: number
  created_at: string
  updated_at: string
  // Relational data
  artist?: Band // Changed from artist_band
  user_vote?: { id: string } | null
}

export interface Vote {
  id: string
  user_id: string
  release_id: string
  created_at: string
}

export interface Donation {
  id: string
  donor_id: string | null
  amount: number
  message: string | null
  is_anonymous: boolean
  payment_status: "pending" | "completed" | "failed"
  payment_id: string | null
  created_at: string
  // New recipient fields
  recipient_user_id?: string | null
  recipient_band_id?: string | null
  // Relational data
  donor?: User | null
  recipient_user?: User
  recipient_band?: Band
}

export interface ForumCategory {
  id: string
  name: string
  description: string | null
  color: string
  created_at: string
}

export interface ForumPost {
  id: string
  title: string
  content: string
  author_id: string // This will always be a user
  category_id: string
  is_pinned: boolean
  reply_count: number
  last_reply_at: string
  created_at: string
  updated_at: string
  // Relational data
  author?: User
  category?: {
    name: string
    color: string
  }
}

export interface ForumReply {
  id: string
  content: string
  author_id: string // This will always be a user
  post_id: string
  created_at: string
  updated_at: string
  // Relational data
  author?: User
}

export interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  end_date: string | null
  location: string | null
  city: string | null
  country: string | null
  venue_name: string | null
  ticket_url: string | null
  cover_image_url: string | null
  genres: string[] | null
  is_online: boolean
  max_attendees: number | null
  attendee_count: number
  created_at: string
  updated_at: string
  // New organizer fields
  organizer_user_id?: string | null
  organizer_band_id?: string | null
  // Relational data
  organizer_user?: User
  organizer_band?: Band
  user_attending?: { id: string } | null
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  created_at: string
}