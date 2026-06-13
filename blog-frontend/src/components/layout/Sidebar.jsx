import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { tagService } from '../../services/tags'
import { blogService } from '../../services/blogs'
import TagCloud from '../public/TagCloud'
import LoadingSpinner from '../common/LoadingSpinner'
import ErrorMessage from '../common/ErrorMessage'
import { TrendingUp, Calendar, Eye, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useQuery({
    queryKey: ['tags-cloud'],
    queryFn: () => tagService.getTagCloud(),
  })

  const { data: popularBlogs, isLoading: blogsLoading, error: blogsError } = useQuery({
    queryKey: ['popular-blogs'],
    queryFn: () => blogService.getPopularBlogs(5),
  })

  const safeTags = Array.isArray(tags) ? tags : []
  const safePopularBlogs = Array.isArray(popularBlogs) ? popularBlogs : []

  return (
    <aside className="space-y-6">
      {/* Popular Posts */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center">
          <TrendingUp size={18} className="mr-2 text-primary" />
          Popular Posts
        </h3>
        {blogsLoading ? (
          <LoadingSpinner />
        ) : blogsError ? (
          <ErrorMessage message={blogsError.message} />
        ) : safePopularBlogs.length === 0 ? (
          <p className="text-text-light text-sm">No popular posts yet</p>
        ) : (
          <ul className="space-y-3">
            {safePopularBlogs.slice(0, 5).map((blog, index) => (
              <li key={blog.id} className="border-b border-border pb-3 last:border-0">
                <Link to={`/blog/${blog.slug}`} className="group block">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-bold text-primary min-w-[24px]">#{index + 1}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-text group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h4>
                      <div className="flex items-center text-xs text-text-light mt-1">
                        <Calendar size={10} className="mr-1" />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <Eye size={10} className="ml-2 mr-1" />
                        <span>{blog.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tag Cloud */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="text-lg font-semibold text-text mb-4">Tags</h3>
        {tagsLoading ? (
          <LoadingSpinner />
        ) : tagsError ? (
          <ErrorMessage message={tagsError.message} />
        ) : (
          <TagCloud tags={safeTags} />
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-accent rounded-lg shadow-md p-5 text-white">
        <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
        <p className="text-sm opacity-90 mb-4">
          Subscribe to get the latest updates
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full bg-white text-primary font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Ad Banner */}
      <div className="bg-light rounded-lg shadow-md p-5 text-center">
        <h4 className="font-bold text-text mb-2">Sponsored</h4>
        <p className="text-sm text-text-light mb-3">
          Your ad could be here
        </p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm">
          Learn More
        </button>
      </div>
    </aside>
  )
}

export default Sidebar