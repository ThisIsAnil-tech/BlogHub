import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import BlogCard from '../../components/public/BlogCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { blogService } from '../../services/blogs'
import { ArrowLeft, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const ParentBlogPage = () => {
  const { parentSlug } = useParams()

  const { data: parentBlog, isLoading: parentLoading, error: parentError } = useQuery({
    queryKey: ['parent-blog', parentSlug],
    queryFn: () => blogService.getParentBlogBySlug(parentSlug),
  })

  if (parentLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    )
  }

  if (parentError) {
    return (
      <Layout>
        <ErrorMessage message={parentError.message} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center text-accent hover:text-opacity-90 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to All Blogs
        </Link>

        {/* Category Header */}
        <div className="bg-secondary rounded-2xl p-8 mb-8">
          <div className="flex items-center mb-4">
            <FolderOpen size={32} className="text-dark mr-3" />
            <div>
              <h1 className="text-4xl font-bold text-dark">{parentBlog?.title}</h1>
              <p className="text-dark opacity-90 mt-2">
                {parentBlog?.description}
              </p>
            </div>
          </div>
          <div className="flex items-center text-dark">
            <span className="bg-accent px-3 py-1 rounded-full text-sm font-medium">
              {parentBlog?.childrenCount || 0} Posts
            </span>
            <span className="ml-4">
              {parentBlog?.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Category Description */}
        {parentBlog?.description && (
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {parentBlog.description}
            </p>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark dark:text-light mb-6">
            Recent Posts in {parentBlog?.title}
          </h2>
          
          {parentBlog?.children && parentBlog.children.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parentBlog.children.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No posts available in this category yet.
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        {parentBlog?.tags && parentBlog.tags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
              Popular Tags in {parentBlog.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {parentBlog.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug}`}
                  className="px-3 py-1 bg-primary dark:bg-gray-700 text-dark dark:text-light rounded-full text-sm hover:bg-accent transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ParentBlogPage