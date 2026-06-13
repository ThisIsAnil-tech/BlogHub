import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Search, Menu, X, User, LogIn } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import SearchBar from '../public/SearchBar'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-text hover:text-primary'
    }`

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-text">
            Blog<span className="text-primary">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/blogs" className={navLinkClass}>Blogs</NavLink>
            <NavLink to="/tags" className={navLinkClass}>Tags</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-light transition-colors"
            >
              <Search size={20} className="text-text" />
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-light transition-colors">
                  <User size={20} className="text-text" />
                  <span className="hidden md:inline text-sm text-text">{user?.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-border">
                  <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-text hover:bg-light">Dashboard</Link>
                  <Link to="/admin/profile" className="block px-4 py-2 text-sm text-text hover:bg-light">Profile</Link>
                  <Link to="/admin/notifications" className="block px-4 py-2 text-sm text-text hover:bg-light">Notifications</Link>
                  <hr className="my-1 border-border" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-light">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/admin/login" className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors">
                <LogIn size={18} />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 rounded-full hover:bg-light transition-colors"
            >
              {isMenuOpen ? <X size={24} className="text-text" /> : <Menu size={24} className="text-text" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="py-4 border-t border-border">
            <SearchBar onSearch={() => setShowSearch(false)} />
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-3">
              <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
              <NavLink to="/blogs" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Blogs</NavLink>
              <NavLink to="/tags" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Tags</NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>About</NavLink>
              <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
              {!isAuthenticated && (
                <Link to="/admin/login" className="text-sm font-medium text-primary" onClick={() => setIsMenuOpen(false)}>Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar