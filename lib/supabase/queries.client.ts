"use client"

import { createClient } from "@/lib/supabase/client"
import type { Release, Profile, Donation, ForumCategory, ForumPost, ForumReply, Event } from "@/lib/types"

// Forum
export async function getForumCategories(): Promise<ForumCategory[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .order("created_at", { ascending: true })
  if (error) {
    console.error("Error fetching forum categories (client):", error)
    return []
  }
  return data || []
}

export async function getForumPosts(categoryId?: string, limit = 20): Promise<ForumPost[]> {
  const supabase = createClient()
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
  if (categoryId) query = query.eq("category_id", categoryId)
  const { data, error } = await query
  if (error) {
    console.error("Error fetching forum posts (client):", error)
    return []
  }
  return data || []
}

export async function getForumPost(postId: string): Promise<ForumPost | null> {
  const supabase = createClient()
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
    console.error("Error fetching forum post (client):", error)
    return null
  }
  return data
}

export async function getForumReplies(postId: string, limit = 50): Promise<ForumReply[]> {
  const supabase = createClient()
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
    console.error("Error fetching forum replies (client):", error)
    return []
  }
  return data || []
}

// Events
export async function getEvents(limit = 20, city?: string, upcoming = true): Promise<Event[]> {
  const supabase = createClient()
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
  if (upcoming) query = query.gte("event_date", new Date().toISOString())
  if (city) query = query.ilike("city", `%${city}%`)
  query = query.order("event_date", { ascending: true })
  const { data, error } = await query
  if (error) {
    console.error("Error fetching events (client):", error)
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
  const supabase = createClient()
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
  if (upcoming) query = query.gte("event_date", new Date().toISOString())
  if (city) query = query.ilike("city", `%${city}%`)
  query = query.order("event_date", { ascending: true })
  const { data, error } = await query
  if (error) {
    console.error("Error fetching events with attendance (client):", error)
    return []
  }
  return data || []
}

