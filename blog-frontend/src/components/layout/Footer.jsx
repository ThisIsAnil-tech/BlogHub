import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ]

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ]

  const categories = [
    { name: 'Technology', href: '/blogs/technology' },
    { name: 'Lifestyle', href: '/blogs/lifestyle' },
    { name: 'Travel', href: '/blogs/travel' },
    { name: 'Food', href: '/blogs/food' },
  ]

  return (
    <footer className="bg-dark mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-text mb-4">
              Blog<span className="text-primary">Hub</span>
            </h3>
            <p className="text-text-light text-sm mb-4">
              A modern blogging platform for sharing ideas and stories. Join our community of writers and readers.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-text hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-text mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-text-light text-sm hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-text mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link to={category.href} className="text-text-light text-sm hover:text-primary transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-text mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-text-light text-sm">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                123 Blog Street, Digital City
              </li>
              <li className="flex items-center text-text-light text-sm">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <a href="mailto:contact@bloghub.com" className="hover:text-primary">contact@bloghub.com</a>
              </li>
              <li className="flex items-center text-text-light text-sm">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-primary">+1 (555) 123-4567</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold text-text mb-2">Subscribe to Newsletter</h4>
            <p className="text-text-light text-sm mb-4">Get the latest posts delivered right to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-text-light text-sm">
            © {currentYear} BlogHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer