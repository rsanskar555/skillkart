"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { LogIn, Mail, Lock, AlertCircle, Info, ArrowRight } from 'lucide-react'
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/common/Navbar"
import Footer from "../../components/common/Footer"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setError("")
      setLoading(true)
      await login(email, password)
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      setError("Failed to log in. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-md relative z-10"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur-lg opacity-70"></div>
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg border border-gray-700/50 rounded-xl p-8 shadow-2xl relative">
              <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 mb-4">
                  <LogIn className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-gray-400 mt-2">Login to access your learning roadmaps</p>
              </motion.div>

              {/* Demo credentials info */}
              <motion.div
                variants={itemVariants}
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 rounded-lg p-4 mb-6 flex items-start gap-3"
              >
                <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-1">Demo Credentials</p>
                  <p className="text-sm">Email: demo@skillkart.com</p>
                  <p className="text-sm">Password: demo1234</p>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <motion.form variants={itemVariants} onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-3"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-3"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-500 text-cyan-500 focus:ring-cyan-500 bg-gray-700"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full relative group ${loading ? "opacity-70" : ""}`}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium">
                    {loading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        <span>Sign In</span>
                      </>
                    )}
                  </div>
                </motion.button>
                </div>
              </motion.form>

              <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
                <span className="text-gray-400">Don't have an account? </span>
                <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                  Sign up now
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
