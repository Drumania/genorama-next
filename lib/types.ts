export interface User {
  id: string
  username: string
  display_name: string
  email: string
  bio: string | null
  avatar_url: string | null
  website_url: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Band {
  id: string
  name: string
  username: string
  description: string | null
  cover_image_url: string | null
  logo_url: string | null
  website_url: string | null
  spotify_url: string | null
  youtube_url: string | null
  instagram_url: string | null
  location: string | null
  city: string | null
  country: string | null
  genres: string[] | null
  founded_year: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserBand {
  id: string
  user_id: string
  band_id: string
  role: 'owner' | 'member' | 'admin' | 'collaborator'
  joined_at: string
  is_active: boolean
  // Joined data
  user?: User
  band?: Band
}

export interface Release {
  id: string
  title: string
  description: string | null
  artist_id: string // Keep for backward compatibility
  band_id: string | null // New field
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
  // Joined data
  profiles?: {
    username: string
    display_name: string
    avatar_url: string | null
  }
  band?: {
    id: string
    name: string
    username: string
    logo_url: string | null
  }
  user_vote?: {
    id: string
  } | null
}

export interface Vote {
  id: string
  user_id: string // Keep for backward compatibility
  user_id_new: string | null // New field
  release_id: string
  created_at: string
}

export interface Profile {
  id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  website_url: string | null
  spotify_url: string | null
  youtube_url: string | null
  instagram_url: string | null
  is_band: boolean
  location: string | null
  genres: string[] | null
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_id: string | null // Keep for backward compatibility
  donor_user_id: string | null // New field
  recipient_id: string // Keep for backward compatibility
  recipient_user_id: string | null // New field
  amount: number
  message: string | null
  is_anonymous: boolean
  payment_status: "pending" | "completed" | "failed"
  payment_id: string | null
  created_at: string
  // Joined data
  donor_profile?: {
    username: string
    display_name: string
    avatar_url: string | null
  } | null
  recipient_profile?: {
    username: string
    display_name: string
    avatar_url: string | null
  }
  donor_user?: User | null
  recipient_user?: User | null
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
  author_id: string // Keep for backward compatibility
  author_user_id: string | null // New field
  category_id: string
  is_pinned: boolean
  reply_count: number
  last_reply_at: string
  created_at: string
  updated_at: string
  // Joined data
  author?: {
    username: string
    display_name: string
    avatar_url: string | null
  }
  author_user?: User
  category?: {
    name: string
    color: string
  }
}

export interface ForumReply {
  id: string
  content: string
  author_id: string
  post_id: string
  created_at: string
  updated_at: string
  // Joined data
  author?: {
    username: string
    display_name: string
    avatar_url: string | null
  }
}

export interface Event {
  id: string
  title: string
  description: string | null
  organizer_id: string // Keep for backward compatibility
  organizer_user_id: string | null // New field
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
  // Joined data
  organizer?: {
    username: string
    display_name: string
    avatar_url: string | null
  }
  organizer_user?: User
  user_attending?: {
    id: string
  } | null
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  created_at: string
}
