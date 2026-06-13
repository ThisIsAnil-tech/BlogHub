import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import BlogCard from '../../components/public/BlogCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import Pagination from '../../components/common/Pagination'
import { blogService } from '../../services/blogs'
import { Search, Filter, Calendar, Tag, User } from 'lucide-react'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    q: searchParams.get('q') || '',
    tags: searchParams.get('tags') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    sortBy: searchParams.get('sortBy') || 'relevance',
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', filters],
    queryFn: () => blogService.getAllChildBlogs(filters),
  })

  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 })
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      q: '',
      tags: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'relevance',
    })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Search size={24} className="text-accent mr-2" />
            <h1 className="text-3xl font-bold text-dark dark:text-light">
              Search Results{filters.q && `: "${filters.q}"`}
            </h1>
          </div>
          
          {/* Search Stats */}
          <div className="bg-primary dark:bg-dark rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <p className="text-dark dark:text-light">
                  Found <span className="font-bold">{data?.total || 0}</span> results
                  {filters.q && ` for "${filters.q}"`}
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Filter size={20} className="mr-2" />
                <h3 className="text-lg font-semibold text-dark dark:text-light">
                  Filters
                </h3>
              </div>

              {/* Search Term */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Search Term
                </label>
                <input
                  type="text"
                  value={filters.q}
                  onChange={(e) => handleFilterChange({ q: e.target.value })}
                  placeholder="Type to search..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="views">Most Viewed</option>
                  <option value="comments">Most Comments</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="mr-2" />
                  <label className="text-sm font-medium text-dark dark:text-light">
                    Date Range
                  </label>
                </div>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <div className="flex items-center mb-2">
                  <Tag size={16} className="mr-2" />
                  <label className="text-sm font-medium text-dark dark:text-light">
                    Popular Tags
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['react', 'javascript', 'webdev', 'tutorial', 'css', 'nodejs'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleFilterChange({ tags: tag })}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.tags === tag
                          ? 'bg-accent text-dark'
                          : 'bg-primary dark:bg-gray-700 text-dark dark:text-light hover:bg-secondary'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            )}

            {/* Error State */}
            {error && <ErrorMessage message={error.message} />}

            {/* Results Grid */}
            {!isLoading && !error && (
              <>
                {data?.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <Search size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-dark dark:text-light mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your search filters
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {data?.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {data?.totalPages > 1 && (
                      <Pagination
                        currentPage={filters.page}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SearchPage