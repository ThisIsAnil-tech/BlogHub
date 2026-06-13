import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import analyticsService from '../../services/analytics.service'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  }, [])

  if (!stats) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500">Total Views</p>
          <p className="text-2xl font-bold">{stats.totalViews}</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <p className="text-gray-500">Views (Last Hour)</p>
          {/* Fixed: changed hourlyViews to viewsLastHour to match backend */}
          <p className="text-2xl font-bold">{stats.realtime?.viewsLastHour || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard