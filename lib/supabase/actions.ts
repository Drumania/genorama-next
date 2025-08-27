"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleVote(releaseId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "You must be logged in to vote" }
  }

  // Check if user already voted
  const { data: existingVote, error: voteCheckError } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", user.id)
    .eq("release_id", releaseId)
    .single()

  if (voteCheckError && voteCheckError.code !== "PGRST116") {
    return { error: "Error checking vote status" }
  }

  if (existingVote) {
    // Remove vote
    const { error: deleteError } = await supabase.from("votes").delete().eq("id", existingVote.id)

    if (deleteError) {
      return { error: "Error removing vote" }
    }

    revalidatePath("/")
    return { success: true, action: "removed" }
  } else {
    // Add vote
    const { error: insertError } = await supabase.from("votes").insert({
      user_id: user.id,
      release_id: releaseId,
    })

    if (insertError) {
      return { error: "Error adding vote" }
    }

    revalidatePath("/")
    return { success: true, action: "added" }
  }
}

export async function createDonation(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "You must be logged in to donate" }
  }

  const recipientId = formData.get("recipientId") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const message = formData.get("message") as string
  const isAnonymous = formData.get("isAnonymous") === "true"

  if (!recipientId || !amount || amount <= 0) {
    return { error: "Invalid donation data" }
  }

  // Simulate payment processing
  const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const { error: insertError } = await supabase.from("donations").insert({
    donor_id: isAnonymous ? null : user.id,
    recipient_id: recipientId,
    amount,
    message: message || null,
    is_anonymous: isAnonymous,
    payment_status: "completed", // In real app, this would be "pending" initially
    payment_id: paymentId,
  })

  if (insertError) {
    console.error("Donation error:", insertError)
    return { error: "Error processing donation" }
  }

  revalidatePath(`/banda/[username]`, "page")
  return { success: true, paymentId }
}

export async function createForumPost(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "You must be logged in to create a post" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const categoryId = formData.get("categoryId") as string

  if (!title || !content || !categoryId) {
    return { error: "All fields are required" }
  }

  const { data, error: insertError } = await supabase
    .from("forum_posts")
    .insert({
      title,
      content,
      author_id: user.id,
      category_id: categoryId,
    })
    .select()
    .single()

  if (insertError) {
    console.error("Forum post creation error:", insertError)
    return { error: "Error creating post" }
  }

  revalidatePath("/comunidad")
  return { success: true, postId: data.id }
}

export async function createForumReply(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "You must be logged in to reply" }
  }

  const content = formData.get("content") as string
  const postId = formData.get("postId") as string

  if (!content || !postId) {
    return { error: "Content and post ID are required" }
  }

  const { error: insertError } = await supabase.from("forum_replies").insert({
    content,
    author_id: user.id,
    post_id: postId,
  })

  if (insertError) {
    console.error("Forum reply creation error:", insertError)
    return { error: "Error creating reply" }
  }

  // Update post reply count and last reply time
  const { error: updateError } = await supabase
    .from("forum_posts")
    .update({
      reply_count: supabase.raw("reply_count + 1"),
      last_reply_at: new Date().toISOString(),
    })
    .eq("id", postId)

  if (updateError) {
    console.error("Error updating post stats:", updateError)
  }

  revalidatePath(`/comunidad/post/${postId}`)
  return { success: true }
}

export async function toggleEventAttendance(eventId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "You must be logged in to attend events" }
  }

  // Check if user is already attending
  const { data: existingAttendance, error: attendanceCheckError } = await supabase
    .from("event_attendees")
    .select("id")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single()

  if (attendanceCheckError && attendanceCheckError.code !== "PGRST116") {
    return { error: "Error checking attendance status" }
  }

  if (existingAttendance) {
    // Remove attendance
    const { error: deleteError } = await supabase.from("event_attendees").delete().eq("id", existingAttendance.id)

    if (deleteError) {
      return { error: "Error removing attendance" }
    }

    revalidatePath("/eventos")
    return { success: true, action: "removed" }
  } else {
    // Add attendance
    const { error: insertError } = await supabase.from("event_attendees").insert({
      user_id: user.id,
      event_id: eventId,
    })

    if (insertError) {
      return { error: "Error adding attendance" }
    }

    revalidatePath("/eventos")
    return { success: true, action: "added" }
  }
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "You must be logged in to create events" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const eventDate = formData.get("eventDate") as string
  const endDate = formData.get("endDate") as string
  const location = formData.get("location") as string
  const city = formData.get("city") as string
  const country = formData.get("country") as string
  const venueName = formData.get("venueName") as string
  const ticketUrl = formData.get("ticketUrl") as string
  const isOnline = formData.get("isOnline") === "true"
  const maxAttendees = formData.get("maxAttendees") as string
  const genres = formData.get("genres") as string

  if (!title || !eventDate || !city) {
    return { error: "Title, date, and city are required" }
  }

  const genresArray = genres
    ? genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean)
    : null

  const { data, error: insertError } = await supabase
    .from("events")
    .insert({
      title,
      description: description || null,
      organizer_id: user.id,
      event_date: eventDate,
      end_date: endDate || null,
      location: location || null,
      city,
      country: country || null,
      venue_name: venueName || null,
      ticket_url: ticketUrl || null,
      is_online: isOnline,
      max_attendees: maxAttendees ? Number.parseInt(maxAttendees) : null,
      genres: genresArray,
    })
    .select()
    .single()

  if (insertError) {
    console.error("Event creation error:", insertError)
    return { error: "Error creating event" }
  }

  revalidatePath("/eventos")
  return { success: true, eventId: data.id }
}
