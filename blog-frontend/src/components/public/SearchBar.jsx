import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'

const SearchBar = ({ initialQuery = '', onSearch }) => {
  const navigate = useNavigate()
  const [query, setQuery] = useState(initialQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    tags: [],
    category: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'relevance',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams({
      q: query,
      ...(filters.category && { category: filters.category }),
      ...(filters.tags.length > 0 && { tags: filters.tags.join(',') }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
      sortBy: filters.sortBy,
    })
    navigate(`/search?${params.toString()}`)
    if (onSearch) onSearch()
  }

  const handleTagToggle = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search blogs, tags, authors..."
            className="w-full pl-12 pr-24 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-dark dark:text-light focus:outline-none focus:border-accent transition-colors"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-primary dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Filters"
            >
              <Filter size={20} />
            </button>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-2 hover:bg-primary dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Clear"
              >
                <X size={20} />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-opacity-90 text-dark rounded-full font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 z-50 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="travel">Travel</option>
                  <option value="food">Food</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date (Newest)</option>
                  <option value="date_asc">Date (Oldest)</option>
                  <option value="views">Most Viewed</option>
                  <option value="comments">Most Comments</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Date From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Date To
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Popular Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {['react', 'javascript', 'webdev', 'tutorial', 'beginners', 'css', 'nodejs', 'api'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        filters.tags.includes(tag)
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

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    tags: [],
                    category: '',
                    dateFrom: '',
                    dateTo: '',
                    sortBy: 'relevance',
                  })
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-accent hover:bg-opacity-90 text-dark font-medium rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar