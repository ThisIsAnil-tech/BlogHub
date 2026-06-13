import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Clock, Tag } from 'lucide-react'

const BlogCard = ({ blog }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      {blog.featuredImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-5">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-light mb-3">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <User size={12} className="mr-1" />
            <span>{blog.author?.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center">
            <Eye size={12} className="mr-1" />
            <span>{blog.views || 0}</span>
          </div>
          <div className="flex items-center">
            <Clock size={12} className="mr-1" />
            <span>{blog.readingTime || 3} min read</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-text mb-2 line-clamp-2">
          <Link to={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
            {blog.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-text-light text-sm mb-3 line-clamp-3">
          {blog.excerpt || blog.content?.substring(0, 150) + '...'}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                to={`/tags/${tag.slug}`}
                className="inline-flex items-center px-2 py-0.5 bg-light text-text rounded-full text-xs hover:bg-primary hover:text-white transition-colors"
              >
                <Tag size={10} className="mr-1" />
                {tag.name}
              </Link>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-text-light">+{blog.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Read More */}
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-secondary transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}

export default BlogCard