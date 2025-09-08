import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Release, Profile, Donation, ForumCategory, ForumPost, ForumReply, Event, User, Band } from "@/lib/types"

// Note: The old 'Profile' type is gone. We now use User, Band, or the unified Profile type.

export async function getReleases(limit = 20, sortBy: "votes" | "recent" = "votes"): Promise<Release[]> {
  const supabase = await createClient()
  const query = supabase
    .from("releases")
    .select(`
      *,
      artist:bands!artist_id (*)
    `)
    .limit(limit)
    .order(sortBy === "votes" ? "vote_count" : "created_at", { ascending: false })

  const { data, error } = await query
  if (error) console.error("Error fetching releases:", error)
  return (data as any) || []
}

export async function getReleasesWithUserVotes(userId: string, limit = 20, sortBy: "votes" | "recent" = "votes"): Promise<Release[]> {
  const supabase = await createClient()
  const query = supabase
    .from("releases")
    .select(`
      *,
      artist:bands!artist_id (*),
      user_vote:votes!left(id)
    `)
    .eq("user_vote.user_id", userId)
    .limit(limit)
    .order(sortBy === "votes" ? "vote_count" : "created_at", { ascending: false })

  const { data, error } = await query
  if (error) console.error("Error fetching releases with user votes:", error)
  return (data as any) || []
}

export async function getBands(limit = 20, search?: string): Promise<Band[]> {
  const supabase = await createClient()
  let query = supabase
    .from("bands")
    .select("*")
    .eq("is_active", true)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,username.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) console.error("Error fetching bands:", error)
  return data || []
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()

  // First, check if it's a user
  const { data: user, error: userError } = await supabase.from("users").select("*").eq("username", username).single()
  if (user) {
    return { ...user, type: 'user' };
  }
  if (userError && userError.code !== 'PGRST116') {
     console.error("Error fetching user by username:", userError)
  }

  // If not a user, check if it's a band
  const { data: band, error: bandError } = await supabase.from("bands").select("*").eq("username", username).single()
  if (band) {
    return { ...band, name: band.name, type: 'band' };
  }
   if (bandError && bandError.code !== 'PGRST116') {
     console.error("Error fetching band by username:", bandError)
  }

  console.log(`Profile not found for username: ${username}`)
  return null
}

export async function getBandReleases(artistId: string, limit = 10): Promise<Release[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("releases")
    .select(`
      *,
      artist:bands!artist_id (*)
    `)
    .eq("artist_id", artistId)
    .limit(limit)
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching band releases:", error)
  return (data as any) || []
}

export async function getProfileDonations(profile: Profile, limit = 10): Promise<Donation[]> {
    const supabase = await createClient()
    
    let query = supabase.from("donations").select("*, donor:users!donor_id(*)")

    if (profile.type === 'user') {
        query = query.eq('recipient_user_id', profile.id)
    } else {
        query = query.eq('recipient_band_id', profile.id)
    }

    const { data, error } = await query
        .eq("payment_status", "completed")
        .limit(limit)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching donations:", error?.message ?? error);
        return [];
    }

    return (data as any) || [];
}

export async function getDonationsGiven(userId: string): Promise<Donation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("donations")
    .select("*, recipient_user:users!recipient_user_id(*), recipient_band:bands!recipient_band_id(*)")
    .eq("donor_id", userId)
    .eq("payment_status", "completed")
    .order("created_at", { ascending: false })
  
  if (error) console.error("Error fetching donations given:", error)
  return (data as any) || []
}

export async function getDonationsReceived(userId: string): Promise<Donation[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("donations")
    .select("*, donor:users!donor_id(*)")
    .eq("recipient_user_id", userId)
    .eq("payment_status", "completed")
    .order("created_at", { ascending: false })

  if (error) console.error("Error fetching donations received:", error)
  return (data as any) || []
}

export async function getDonationStats(profile: Profile) {
  const supabase = await createClient()
  let query = supabase.from("donations").select("amount")

  if (profile.type === 'user') {
    query = query.eq('recipient_user_id', profile.id)
  } else {
    query = query.eq('recipient_band_id', profile.id)
  }

  const { data, error } = await query.eq("payment_status", "completed")

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
  if (error) console.error("Error fetching forum categories:", error)
  return data || []
}

export async function getForumPosts(categoryId?: string, limit = 20): Promise<ForumPost[]> {
  const supabase = await createClient()
  let query = supabase
    .from("forum_posts")
    .select(`
      *,
      author:users!author_id (*),
      category:forum_categories!category_id (name, color)
    `)
    .limit(limit)
    .order("is_pinned", { ascending: false })
    .order("last_reply_at", { ascending: false })

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data, error } = await query
  if (error) console.error("Error fetching forum posts:", error)
  return (data as any) || []
}

export async function getForumPost(postId: string): Promise<ForumPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("forum_posts")
    .select(`
      *,
      author:users!author_id (*),
      category:forum_categories!category_id (name, color)
    `)
    .eq("id", postId)
    .single()

  if (error) console.error("Error fetching forum post:", error)
  return (data as any) || null
}

export async function getForumReplies(postId: string, limit = 50): Promise<ForumReply[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("forum_replies")
    .select(`
      *,
      author:users!author_id (*)
    `)
    .eq("post_id", postId)
    .limit(limit)
    .order("created_at", { ascending: true })

  if (error) console.error("Error fetching forum replies:", error)
  return (data as any) || []
}

export async function getCategoryById(categoryId: string): Promise<ForumCategory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("forum_categories").select("*").eq("id", categoryId).single()
  if (error) console.error("Error fetching category:", error)
  return data || null
}

export async function getEvents(limit = 20, city?: string, upcoming = true): Promise<Event[]> {
  const supabase = await createClient()
  let query = supabase
    .from("events")
    .select(`
      *,
      organizer_user:users!organizer_user_id(*),
      organizer_band:bands!organizer_band_id(*)
    `)
    .limit(limit)

  if (upcoming) query = query.gte("event_date", new Date().toISOString())
  if (city) query = query.ilike("city", `%${city}%`)

  query = query.order("event_date", { ascending: true })

  const { data, error } = await query
  if (error) console.error("Error fetching events:", error)
  return (data as any) || []
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizer_user:users!organizer_user_id(*),
      organizer_band:bands!organizer_band_id(*)
    `)
    .eq("id", eventId)
    .single()

  if (error) console.error("Error fetching event:", error)
  return (data as any) || null
}

// ... other functions like getEventAttendees, etc. can be updated similarly ...
