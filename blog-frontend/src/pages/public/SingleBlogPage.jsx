import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import CommentBox from '../../components/public/CommentBox'
import RelatedPosts from '../../components/public/RelatedPosts'
import ShareButtons from '../../components/public/ShareButtons'
import AuthorCard from '../../components/public/AuthorCard'
import { blogService } from '../../services/blogs'
import { commentService } from '../../services/comments'
import { Calendar, User, Eye, Clock, Tag, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const SingleBlogPage = () => {
  const { slug } = useParams()

  const {
    data: blog,
    isLoading: blogLoading,
    error: blogError,
  } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getChildBlogBySlug(slug),
  })

  const {
    data: comments,
    isLoading: commentsLoading,
  } = useQuery({
    queryKey: ['comments', blog?.id],
    queryFn: () => commentService.getCommentsByBlog(blog?.id),
    enabled: !!blog?.id,
  })

  if (blogLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    )
  }

  if (blogError) {
    return (
      <Layout>
        <ErrorMessage message={blogError.message} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center text-accent hover:text-opacity-90 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blogs
        </Link>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <User size={16} className="mr-1" />
            <Link
              to={`/authors/${blog.author?.id}`}
              className="hover:text-accent transition-colors"
            >
              {blog.author?.username}
            </Link>
          </div>
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            <span>{blog.views} views</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{blog.readingTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-dark dark:text-light mb-6">
          {blog.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags?.map((tag) => (
            <Link
              key={tag.id}
              to={`/tags/${tag.slug}`}
              className="inline-flex items-center px-3 py-1 bg-primary dark:bg-gray-700 text-dark dark:text-light rounded-full text-sm hover:bg-accent transition-colors"
            >
              <Tag size={12} className="mr-1" />
              {tag.name}
            </Link>
          ))}
        </div>

        {/* Content */}
        <article className="prose dark:prose-invert max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>

        {/* Share Buttons */}
        <div className="mb-12">
          <ShareButtons
            url={window.location.href}
            title={blog.title}
            description={blog.excerpt}
          />
        </div>

        {/* Author Card */}
        {blog.author && (
          <div className="mb-12">
            <AuthorCard author={blog.author} />
          </div>
        )}

        {/* Related Posts */}
        {blog.relatedPosts && blog.relatedPosts.length > 0 && (
          <div className="mb-12">
            <RelatedPosts posts={blog.relatedPosts} />
          </div>
        )}

        {/* Comments */}
        <div>
          <CommentBox blogId={blog.id} comments={comments || []} />
        </div>
      </div>
    </Layout>
  )
}

export default SingleBlogPage