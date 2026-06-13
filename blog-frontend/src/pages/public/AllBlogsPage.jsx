import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import BlogCard from '../../components/public/BlogCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import Pagination from '../../components/common/Pagination'
import SearchBar from '../../components/public/SearchBar'
import { blogService } from '../../services/blogs'
import { Filter } from 'lucide-react'

const AllBlogsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    q: '',
    tags: '',
    sortBy: 'date',
    order: 'desc',
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', filters],
    queryFn: () => blogService.getAllChildBlogs(filters),
  })

  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
  }

  const handleSearch = (searchTerm) => {
    setFilters({ ...filters, q: searchTerm, page: 1 })
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark dark:text-light mb-4">
            All Blog Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover articles, tutorials, and stories from our community
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <SearchBar initialQuery={filters.q} onSearch={handleSearch} />
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center">
              <Filter size={18} className="mr-2 text-gray-500" />
              <span className="text-sm font-medium text-dark dark:text-light">Sort by:</span>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="date">Latest</option>
              <option value="date_asc">Oldest</option>
              <option value="views">Most Viewed</option>
              <option value="comments">Most Comments</option>
            </select>
            
            <select
              value={filters.order}
              onChange={(e) => handleFilterChange({ order: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
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

        {/* Blog Grid */}
        {!isLoading && !error && (
          <>
            {data?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No blog posts found. Try adjusting your search filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        {/* Stats */}
        {data && (
          <div className="mt-12 p-6 bg-primary dark:bg-dark rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-dark dark:text-light">{data.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-dark dark:text-light">24</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-dark dark:text-light">156</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tags</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-dark dark:text-light">{data.page}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Current Page</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AllBlogsPage