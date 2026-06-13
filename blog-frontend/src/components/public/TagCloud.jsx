import React from 'react'
import { Link } from 'react-router-dom'

const TagCloud = ({ tags = [] }) => {
  const getFontSize = (weight) => {
    const baseSize = 12
    const increment = 3
    return baseSize + (weight * increment)
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          to={`/tags/${tag.slug}`}
          className="inline-block transition-all duration-300 hover:scale-105"
          style={{
            fontSize: `${getFontSize(tag.weight || 1)}px`,
          }}
        >
          <span
            className={`px-2.5 py-1 rounded-full inline-block ${
              (tag.weight || 1) > 2
                ? 'bg-primary text-white font-medium'
                : 'bg-light text-text'
            } hover:shadow-md transition-all`}
          >
            #{tag.name} <span className="text-xs opacity-75">({tag.count})</span>
          </span>
        </Link>
      ))}
    </div>
  )
}

export default TagCloud