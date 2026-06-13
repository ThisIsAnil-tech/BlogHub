import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import TagCloud from '../../components/public/TagCloud'
import { tagService } from '../../services/tags'
import { Tag, TrendingUp, Hash, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

const TagsPage = () => {
  const [filter, setFilter] = useState('all') // all, popular, trending

  const { data: tags, isLoading, error } = useQuery({
    queryKey: ['tags', filter],
    queryFn: () => tagService.getAllTags(filter === 'popular'),
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark dark:text-light mb-4">
            Explore Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover topics and categories across all blog posts
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-accent text-dark'
                  : 'bg-white dark:bg-gray-800 text-dark dark:text-light hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <Hash size={18} className="mr-2" />
              All Tags
            </button>
            <button
              onClick={() => setFilter('popular')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                filter === 'popular'
                  ? 'bg-accent text-dark'
                  : 'bg-white dark:bg-gray-800 text-dark dark:text-light hover:bg-primary dark:hover:bg-gray-700'
              }`}
            >
              <TrendingUp size={18} className="mr-2" />
              Popular Tags
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Error State */}
        {error && <ErrorMessage message={error.message} />}

        {/* Tag Cloud */}
        {!isLoading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
            <TagCloud tags={tags} />
          </div>
        )}

        {/* Tags Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tags?.map((tag) => (
              <Link
                key={tag.id}
                to={`/tags/${tag.slug}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary dark:bg-dark rounded-lg flex items-center justify-center mr-4">
                      <Tag size={24} className="text-dark dark:text-light" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark dark:text-light">
                        #{tag.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tag.count} posts
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Trending in {tag.category || 'General'}
                  </div>
                  <div className="text-sm font-medium text-accent">
                    View Posts →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-secondary rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-dark mb-6 text-center">
            Tag Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-dark">{tags?.length || 0}</div>
              <div className="text-sm text-dark opacity-90">Total Tags</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dark">
                {tags?.reduce((sum, tag) => sum + tag.count, 0) || 0}
              </div>
              <div className="text-sm text-dark opacity-90">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dark">
                {Math.round(tags?.reduce((sum, tag) => sum + tag.count, 0) / (tags?.length || 1))}
              </div>
              <div className="text-sm text-dark opacity-90">Avg Posts/Tag</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dark">
                {tags?.[0]?.count || 0}
              </div>
              <div className="text-sm text-dark opacity-90">Most Used Tag</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TagsPage