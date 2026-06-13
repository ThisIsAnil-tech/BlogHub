import React from 'react'
import {
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Mail,
  MessageCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

const ShareButtons = ({ url, title, description }) => {
  const shareData = {
    title,
    text: description,
    url,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const shareLinks = [
    {
      icon: Facebook,
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'bg-[#1DA1F2] hover:bg-[#1A91DA]',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: 'bg-[#0A66C2] hover:bg-[#0959A9]',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
      color: 'bg-[#25D366] hover:bg-[#22C35A]',
    },
    {
      icon: Mail,
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ]

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${link.color} text-white p-2 rounded-full hover:scale-110 transition-transform`}
          aria-label={`Share on ${link.label}`}
          title={link.label}
        >
          <link.icon size={18} />
        </a>
      ))}
      <button
        onClick={handleCopyLink}
        className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full hover:scale-110 transition-transform"
        title="Copy link"
      >
        <LinkIcon size={18} />
      </button>
    </div>
  )
}

export default ShareButtons