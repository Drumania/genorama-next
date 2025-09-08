import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

// This profile is a simplified user profile for display in the header.
// It's not intended to be a full user model.
interface Profile {
  username: string
  avatar_url: string | null
  display_name: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  const profileFetchRef = useRef<boolean>(false)
  const lastUserIdRef = useRef<string | null>(null)

  const fetchProfile = useCallback(async (userId: string) => {
    // Avoid duplicate fetches
    if (profileFetchRef.current || lastUserIdRef.current === userId) {
      return
    }

    profileFetchRef.current = true
    lastUserIdRef.current = userId
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔍 [useAuth] Fetching user profile for:', userId)
      
      const { data: userProfile, error: userError } = await supabase
        .from("users")
        .select("username, avatar_url, display_name")
        .eq("id", userId)
        .single()

      if (userError) {
        // Don't throw an error if the user profile is simply not found.
        // It could be that the user just signed up and the profile is not created yet.
        if (userError.code === 'PGRST116') { // "single() row not found"
          console.log('✅ [useAuth] User profile not found, which is okay.')
          setProfile(null)
        } else {
          throw userError
        }
      }
      
      if (userProfile) {
        console.log('✅ [useAuth] User profile found:', userProfile)
        setProfile(userProfile)
      } else {
        // This case is handled by the error check above, but as a fallback:
        setProfile(null)
      }

    } catch (err) {
      console.error('💥 [useAuth] Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setProfile(null)
    } finally {
      profileFetchRef.current = false
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (mounted) {
          setUser(user)
          if (user?.id) {
            await fetchProfile(user.id)
          }
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          console.error('💥 [useAuth] Error inicializando auth:', err)
          setError(err instanceof Error ? err.message : 'Error desconocido')
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      const nextUser = session?.user ?? null
      setUser(nextUser)
      
      if (nextUser?.id) {
        // Solo buscar perfil si es un usuario diferente
        if (lastUserIdRef.current !== nextUser.id) {
          await fetchProfile(nextUser.id)
        }
      } else {
        setProfile(null)
        lastUserIdRef.current = null
        setError(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth, fetchProfile])

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      lastUserIdRef.current = null
    } catch (err) {
      console.error('💥 [useAuth] Error signing out:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    }
  }, [supabase.auth])

  return {
    user,
    profile,
    isLoading,
    error,
    signOut,
    refetchProfile: () => user?.id ? fetchProfile(user.id) : null
  }
}
