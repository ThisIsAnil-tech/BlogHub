import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../../services/analytics'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Users,
  Eye,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
} from 'lucide-react'

const AdminDashboard = () => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsService.getAnalytics('7d'),
  })

  const { data: realtime } = useQuery({
    queryKey: ['analytics-realtime'],
    queryFn: () => analyticsService.getRealtimeAnalytics(),
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const stats = [
    {
      title: 'Total Views',
      value: analytics?.totalViews || 0,
      icon: Eye,
      change: '+12%',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      change: '+8%',
      color: 'bg-green-500',
    },
    {
      title: 'Total Comments',
      value: analytics?.totalComments || 0,
      icon: MessageSquare,
      change: '+24%',
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Posts',
      value: analytics?.totalPosts || 0,
      icon: FileText,
      change: '+5%',
      color: 'bg-purple-500',
    },
  ]

  const trafficData = analytics?.trafficSources || [
    { source: 'Direct', value: 40 },
    { source: 'Social', value: 25 },
    { source: 'Search', value: 20 },
    { source: 'Referral', value: 15 },
  ]

  
const COLORS = ['#FCE5C0', '#E5E7A7', '#EAD6CE', '#CB997E', '#3DDBEA']


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark dark:text-light">
          Dashboard Overview
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock size={16} />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={stat.color.replace('bg-', 'text-')} size={24} />
              </div>
              <span className="text-sm font-medium text-green-500">
                <TrendingUp size={16} className="inline mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-dark dark:text-light mb-1">
              {stat.value.toLocaleString()}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Real-time Stats */}
      {realtime && (
        <div className="bg-secondary rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-dark">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">{realtime.activeUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Views (1h)</p>
              <p className="text-2xl font-bold">{realtime.hourlyViews}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">New Comments</p>
              <p className="text-2xl font-bold">{realtime.newComments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Online Now</p>
              <p className="text-2xl font-bold">{realtime.onlineUsers}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
            Traffic Sources
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Traffic']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Views Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
            Views (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.viewsByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="views" fill="#FCE5C0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
          Popular Content
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-gray-500 dark:text-gray-400">Title</th>
                <th className="text-left py-3 text-gray-500 dark:text-gray-400">Views</th>
                <th className="text-left py-3 text-gray-500 dark:text-gray-400">Comments</th>
                <th className="text-left py-3 text-gray-500 dark:text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.popularContent?.map((content) => (
                <tr
                  key={content.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-primary dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-3">
                    <a
                      href={`/blog/${content.slug}`}
                      className="text-dark dark:text-light hover:text-accent transition-colors"
                    >
                      {content.title}
                    </a>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    {content.views}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    {content.comments}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard