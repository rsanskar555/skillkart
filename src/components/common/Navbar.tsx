"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { BookOpen, User, LogOut, LogIn, Menu, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  const linkVariants = {
    hover: {
      scale: 1.05,
      color: "#ffffff",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const menuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  }

  return (
    <motion.nav
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-b border-gray-700/50 py-4 px-6 sticky top-0 z-50 shadow-lg shadow-purple-900/10"
      initial="hidden"
      animate="visible"
      variants={navVariants}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div variants={logoVariants} whileHover="hover" whileTap="tap">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur-md opacity-70"></div>
              <div className="relative bg-gray-900 rounded-full p-2">
                <BookOpen className="h-7 w-7 text-cyan-400" />
              </div>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 text-transparent bg-clip-text">
              SkillKart
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {currentUser ? (
            <>
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors flex items-center space-x-1 font-medium"
                >
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4 opacity-70" />
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer font-medium"
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 text-purple-400" />
                <span>Logout</span>
              </motion.div>

              <Link to="/profile">
                <motion.div
                  className="relative group"
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-[2px]">
                    <div className="bg-gray-900 rounded-full h-full w-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </>
          ) : (
            <>
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  <LogIn className="h-5 w-5 text-purple-400" />
                  <span>Login</span>
                </Link>
              </motion.div>

              <Link to="/register">
                <motion.button
                  className="relative group"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-md blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-2 px-5 rounded-md">
                    Get Started
                  </div>
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-gray-800 border border-gray-700"
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 top-[72px] bg-gray-900/95 backdrop-blur-lg z-40 md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="flex flex-col space-y-4 p-6 h-full">
              {currentUser ? (
                <>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/dashboard"
                      className="flex items-center justify-between text-gray-200 hover:text-white py-3 px-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg font-medium">Dashboard</span>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/profile"
                      className="flex items-center justify-between text-gray-200 hover:text-white py-3 px-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg font-medium">Profile</span>
                      <User className="h-5 w-5 text-cyan-400" />
                    </Link>
                  </motion.div>

                  <motion.button
                    variants={menuItemVariants}
                    className="flex items-center justify-between text-gray-200 hover:text-white py-3 px-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <span className="text-lg font-medium">Logout</span>
                    <LogOut className="h-5 w-5 text-purple-400" />
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/login"
                      className="flex items-center justify-between text-gray-200 hover:text-white py-3 px-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="text-lg font-medium">Login</span>
                      <LogIn className="h-5 w-5 text-cyan-400" />
                    </Link>
                  </motion.div>

                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/register"
                      className="flex items-center justify-center text-white py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-medium text-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
