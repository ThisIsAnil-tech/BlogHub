import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import BlogCard from '../../components/public/BlogCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import Pagination from '../../components/common/Pagination'
import { tagService } from '../../services/tags'
import { ArrowLeft, Tag, TrendingUp, Hash } from 'lucide-react'
import { Link } from 'react-router-dom'

const TagDetailPage = () => {
  const { slug } = useParams()
  const [page, setPage] = React.useState(1)

  const { data: tagData, isLoading, error } = useQuery({
    queryKey: ['tag', slug, page],
    queryFn: () => tagService.getTagBySlug(slug, page, 9),
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage message={error.message} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/tags"
          className="inline-flex items-center text-accent hover:text-opacity-90 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to All Tags
        </Link>

        {/* Tag Header */}
        <div className="bg-accent rounded-2xl p-8 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-6">
              <Tag size={32} className="text-dark" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-dark">
                #{tagData?.name}
              </h1>
              <p className="text-dark opacity-90 mt-2">
                Explore all posts tagged with #{tagData?.name}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-white px-4 py-2 rounded-full">
              <TrendingUp size={18} className="mr-2" />
              <span className="font-medium">{tagData?.count || 0} Posts</span>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full">
              <Hash size={18} className="mr-2" />
              <span className="font-medium">
                {tagData?.blogs?.[0]?.category || 'General'} Category
              </span>
            </div>
          </div>
        </div>

        {/* Related Tags */}
        {tagData?.relatedTags && tagData.relatedTags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagData.relatedTags.map((relatedTag) => (
                <Link
                  key={relatedTag.id}
                  to={`/tags/${relatedTag.slug}`}
                  className="px-3 py-1 bg-primary dark:bg-gray-700 text-dark dark:text-light rounded-full text-sm hover:bg-accent transition-colors"
                >
                  #{relatedTag.name} ({relatedTag.count})
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark dark:text-light mb-6">
            Latest Posts
          </h2>
          
          {tagData?.blogs && tagData.blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {tagData.blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>

              {/* Pagination */}
              {tagData.totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={tagData.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No posts found with this tag.
              </p>
            </div>
          )}
        </div>

        {/* Tag Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
            Tag Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary dark:bg-dark rounded-lg">
              <div className="text-2xl font-bold text-dark dark:text-light">
                {tagData?.count || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Posts
              </div>
            </div>
            <div className="text-center p-4 bg-primary dark:bg-dark rounded-lg">
              <div className="text-2xl font-bold text-dark dark:text-light">
                {Math.floor((tagData?.count || 0) / 30)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Posts per Month
              </div>
            </div>
            <div className="text-center p-4 bg-primary dark:bg-dark rounded-lg">
              <div className="text-2xl font-bold text-dark dark:text-light">
                {tagData?.totalViews || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Views
              </div>
            </div>
            <div className="text-center p-4 bg-primary dark:bg-dark rounded-lg">
              <div className="text-2xl font-bold text-dark dark:text-light">
                {tagData?.popularity || 'Medium'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Popularity
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TagDetailPage