import React, { useState } from 'react'
import Layout from '../../components/layout/Layout'
import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../../services/analytics'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts'
import {
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  Calendar,
  Download,
  Filter,
} from 'lucide-react'

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('7d')
  const [chartType, setChartType] = useState('bar')

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics', period],
    queryFn: () => analyticsService.getAnalytics(period),
  })

  const { data: popularContent } = useQuery({
    queryKey: ['analytics-popular', period],
    queryFn: () => analyticsService.getPopularContent(10, period),
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  const stats = [
    { title: 'Total Views', value: analytics?.totalViews || 0, change: '+12%', icon: Eye },
    { title: 'Unique Visitors', value: analytics?.uniqueVisitors || 0, change: '+8%', icon: Users },
    { title: 'Total Comments', value: analytics?.totalComments || 0, change: '+24%', icon: MessageSquare },
    { title: 'Engagement Rate', value: '4.8%', change: '+2%', icon: TrendingUp },
  ]

  const trafficData = analytics?.trafficSources || [
    { source: 'Direct', value: 40 },
    { source: 'Social', value: 25 },
    { source: 'Search', value: 20 },
    { source: 'Referral', value: 15 },
  ]

  const viewsData = analytics?.viewsByDay || Array.from({ length: 7 }, (_, i) => ({
    date: `Day ${i + 1}`,
    views: Math.floor(Math.random() * 1000) + 500,
  }))

  const COLORS = ['#FCE5C0', '#E5E7A7', '#EAD6CE', '#cb997e', '#3ddbea9']

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `analytics-${period}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark dark:text-light">
              Analytics Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Track your blog's performance and growth
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportData}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
            >
              <Download size={18} className="mr-2" />
              Export Data
            </button>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-primary dark:bg-dark`}>
                  <stat.icon className="text-dark dark:text-light" size={24} />
                </div>
                <span className="text-sm font-medium text-green-500">
                  <TrendingUp size={16} className="inline mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-dark dark:text-light mb-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark dark:text-light">
                Traffic Sources
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Filter size={16} className="mr-1" />
                Source
              </div>
            </div>
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-dark dark:text-light">
                Views Over Time
              </h3>
              <div className="flex space-x-2">
                {['bar', 'line', 'area'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1 text-sm rounded capitalize ${
                      chartType === type
                        ? 'bg-accent text-dark'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={viewsData}>
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
                ) : chartType === 'line' ? (
                  <LineChart data={viewsData}>
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
                    <Line type="monotone" dataKey="views" stroke="#FCE5C0" strokeWidth={2} />
                  </LineChart>
                ) : (
                  <AreaChart data={viewsData}>
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
                    <Area type="monotone" dataKey="views" stroke="#FCE5C0" fill="#FCE5C0" fillOpacity={0.3} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Popular Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-dark dark:text-light">
              Popular Content
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-1" />
              Period: {period}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 text-gray-500 dark:text-gray-400">Title</th>
                  <th className="text-left py-3 text-gray-500 dark:text-gray-400">Views</th>
                  <th className="text-left py-3 text-gray-500 dark:text-gray-400">Comments</th>
                  <th className="text-left py-3 text-gray-500 dark:text-gray-400">Likes</th>
                  <th className="text-left py-3 text-gray-500 dark:text-gray-400">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {popularContent?.map((content, index) => (
                  <tr
                    key={content.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-primary dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="w-8 text-center font-bold text-gray-400 mr-3">
                          {index + 1}
                        </div>
                        <a
                          href={`/blog/${content.slug}`}
                          className="text-dark dark:text-light hover:text-accent transition-colors truncate max-w-xs"
                        >
                          {content.title}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {content.views.toLocaleString()}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {content.comments}
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">
                      {content.likes || 'N/A'}
                    </td>
                    <td className="py-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${Math.min(content.views / 100, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="font-semibold text-dark dark:text-light mb-4">
              Top Referrers
            </h4>
            <div className="space-y-3">
              {['Google', 'Twitter', 'LinkedIn', 'Direct', 'Newsletter'].map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{referrer}</span>
                  <span className="font-medium">{Math.floor(Math.random() * 1000)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="font-semibold text-dark dark:text-light mb-4">
              Device Breakdown
            </h4>
            <div className="space-y-3">
              {['Desktop', 'Mobile', 'Tablet'].map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{device}</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{['65%', '30%', '5%'][index]}</span>
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full"
                        style={{ width: ['65%', '30%', '5%'][index] }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h4 className="font-semibold text-dark dark:text-light mb-4">
              User Engagement
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Avg. Time on Page</span>
                <span className="font-medium">4:32 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Bounce Rate</span>
                <span className="font-medium text-green-500">42%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Pages per Session</span>
                <span className="font-medium">3.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Returning Visitors</span>
                <span className="font-medium">35%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AnalyticsPage