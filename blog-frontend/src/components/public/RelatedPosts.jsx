import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const RelatedPosts = ({ posts = [] }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === posts.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? posts.length - 1 : prev - 1))
  }

  if (posts.length === 0) return null

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-dark dark:text-light mb-6">
        Related Posts
      </h3>
      
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative h-64">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0,
                x: index === currentIndex ? 0 : 100,
              }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 ${index === currentIndex ? 'block' : 'hidden'}`}
            >
              <div className="relative h-full">
                <img
                  src={post.featuredImage || '/placeholder.jpg'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h4 className="text-xl font-bold mb-2">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h4>
                  <p className="text-gray-200 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        {posts.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {posts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-accent w-6'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {posts.slice(0, 4).map((post, index) => (
          <div
            key={post.id}
            className={`relative overflow-hidden rounded-lg cursor-pointer transition-all ${
              index === currentIndex ? 'ring-2 ring-accent' : ''
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src={post.featuredImage || '/placeholder.jpg'}
              alt={post.title}
              className="w-full h-24 object-cover hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors" />
            <p className="absolute bottom-2 left-2 right-2 text-xs text-white font-medium truncate">
              {post.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedPosts