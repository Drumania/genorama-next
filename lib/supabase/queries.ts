import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Release, Profile, Donation, ForumCategory, ForumPost, ForumReply, Event } from "@/lib/types"

export async function getReleases(limit = 20, sortBy: "votes" | "recent" = "votes"): Promise<Release[]> {
  const supabase = await createClient()

  let query = supabase
    .from("releases")
    .select(`
      *,
      profiles:artist_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .limit(limit)

  // Add sorting
  if (sortBy === "votes") {
    query = query.order("vote_count", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching releases:", error)
    return []
  }

  return data || []
}

export async function getReleasesWithUserVotes(
  userId: string,
  limit = 20,
  sortBy: "votes" | "recent" = "votes",
): Promise<Release[]> {
  const supabase = await createClient()

  let query = supabase
    .from("releases")
    .select(`
      *,
      profiles:artist_id (
        username,
        display_name,
        avatar_url
      ),
      user_vote:votes!left (
        id
      )
    `)
    .eq("user_vote.user_id", userId)
    .limit(limit)

  // Add sorting
  if (sortBy === "votes") {
    query = query.order("vote_count", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching releases with user votes:", error)
    return []
  }

  return data || []
}

export async function getProfiles(limit = 20, search?: string): Promise<Profile[]> {
  const supabase = await createClient()

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("is_band", true)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`display_name.ilike.%${search}%,username.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching profiles:", error)
    return []
  }

  return data || []
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return null
  }

  return data
}

export async function getProfileReleases(artistId: string, limit = 10): Promise<Release[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("releases")
    .select(`
      *,
      profiles:artist_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("artist_id", artistId)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching profile releases:", error)
    return []
  }

  return data || []
}

export async function getProfileDonations(recipientId: string, limit = 10): Promise<Donation[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("recipient_id", recipientId)
    .eq("payment_status", "completed")
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching donations:", error?.message ?? error)
    return []
  }

  const donations = data || []

  // Enrich with donor profiles (workaround for FK via auth.users)
  const donorIds = Array.from(
    new Set(
      donations
        .filter((d) => !d.is_anonymous && d.donor_id)
        .map((d) => d.donor_id as string),
    ),
  )

  if (donorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", donorIds)

    if (!profilesError && profiles) {
      const map = new Map(profiles.map((p) => [p.id, p]))
      return donations.map((d) => ({
        ...d,
        donor_profile: d.donor_id ? (map.get(d.donor_id) as any) ?? null : null,
      })) as unknown as Donation[]
    }
  }

  return donations as Donation[]
}

export async function getDonationStats(recipientId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("donations")
    .select("amount")
    .eq("recipient_id", recipientId)
    .eq("payment_status", "completed")

  if (error) {
    console.error("Error fetching donation stats:", error)
    return { totalAmount: 0, donationCount: 0 }
  }

  const totalAmount = data.reduce((sum, donation) => sum + donation.amount, 0)
  const donationCount = data.length

  return { totalAmount, donationCount }
}

export async function getForumCategories(): Promise<ForumCategory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("forum_categories").select("*").order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching forum categories:", error)
    return []
  }

  return data || []
}

export async function getForumPosts(categoryId?: string, limit = 20): Promise<ForumPost[]> {
  const supabase = await createClient()

  let query = supabase
    .from("forum_posts")
    .select(`
      *,
      author:profiles!author_id (
        username,
        display_name,
        avatar_url
      ),
      category:forum_categories!category_id (
        name,
        color
      )
    `)
    .limit(limit)
    .order("is_pinned", { ascending: false })
    .order("last_reply_at", { ascending: false })

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching forum posts:", error)
    return []
  }

  return data || []
}

export async function getForumPost(postId: string): Promise<ForumPost | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("forum_posts")
    .select(`
      *,
      author:profiles!author_id (
        username,
        display_name,
        avatar_url
      ),
      category:forum_categories!category_id (
        name,
        color
      )
    `)
    .eq("id", postId)
    .single()

  if (error) {
    console.error("Error fetching forum post:", error)
    return null
  }

  return data
}

export async function getForumReplies(postId: string, limit = 50): Promise<ForumReply[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("forum_replies")
    .select(`
      *,
      author:profiles!author_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("post_id", postId)
    .limit(limit)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching forum replies:", error)
    return []
  }

  return data || []
}

export async function getCategoryById(categoryId: string): Promise<ForumCategory | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("forum_categories").select("*").eq("id", categoryId).single()

  if (error) {
    console.error("Error fetching category:", error)
    return null
  }

  return data
}

export async function getEvents(limit = 20, city?: string, upcoming = true): Promise<Event[]> {
  const supabase = await createClient()

  let query = supabase
    .from("events")
    .select(`
      *,
      organizer:profiles!organizer_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .limit(limit)

  if (upcoming) {
    query = query.gte("event_date", new Date().toISOString())
  }

  if (city) {
    query = query.ilike("city", `%${city}%`)
  }

  query = query.order("event_date", { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data || []
}

export async function getEventsWithUserAttendance(
  userId: string,
  limit = 20,
  city?: string,
  upcoming = true,
): Promise<Event[]> {
  const supabase = await createClient()

  let query = supabase
    .from("events")
    .select(`
      *,
      organizer:profiles!organizer_id (
        username,
        display_name,
        avatar_url
      ),
      user_attending:event_attendees!left (
        id
      )
    `)
    .eq("user_attending.user_id", userId)
    .limit(limit)

  if (upcoming) {
    query = query.gte("event_date", new Date().toISOString())
  }

  if (city) {
    query = query.ilike("city", `%${city}%`)
  }

  query = query.order("event_date", { ascending: true })

  const { data, error } = await query

  if (error) {
    console.error("Error fetching events with user attendance:", error)
    return []
  }

  return data || []
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizer:profiles!organizer_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("id", eventId)
    .single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function getEventAttendees(eventId: string, limit = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("event_attendees")
    .select(`
      *,
      user:profiles!user_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("event_id", eventId)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching event attendees:", error)
    return []
  }

  return data || []
}

export async function getUserEvents(userId: string, limit = 10): Promise<Event[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizer:profiles!organizer_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq("organizer_id", userId)
    .limit(limit)
    .order("event_date", { ascending: false })

  if (error) {
    console.error("Error fetching user events:", error)
    return []
  }

  return data || []
}
