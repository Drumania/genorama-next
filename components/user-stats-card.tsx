'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Music, Heart, Activity } from 'lucide-react'

interface UserStats {
  band_count: number
  following_count: number
  activity_count: number
}

interface UserStatsCardProps {
  userId: string
}

export default function UserStatsCard({ userId }: UserStatsCardProps) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchUserStats()
  }, [userId])

  const fetchUserStats = async () => {
    try {
      setLoading(true)
      
      // Fetch user stats from the view
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If view doesn't exist, calculate manually
        await calculateStatsManually()
      } else {
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      await calculateStatsManually()
    } finally {
      setLoading(false)
    }
  }

  const calculateStatsManually = async () => {
    try {
      // Count user's bands
      const { count: bandCount } = await supabase
        .from('user_bands')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true)

      // Count following bands
      const { count: followingCount } = await supabase
        .from('band_followers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Count user activity
      const { count: activityCount } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      setStats({
        band_count: bandCount || 0,
        following_count: followingCount || 0,
        activity_count: activityCount || 0
      })
    } catch (error) {
      console.error('Error calculating stats manually:', error)
      setStats({
        band_count: 0,
        following_count: 0,
        activity_count: 0
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Estadísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Music className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats?.band_count || 0}</div>
            <div className="text-sm text-blue-600">Bandas</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Heart className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats?.following_count || 0}</div>
            <div className="text-sm text-green-600">Siguiendo</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-purple-600">{stats?.activity_count || 0}</div>
            <div className="text-sm text-purple-600">Actividades</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Users className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-sm text-orange-600">Seguidores</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
