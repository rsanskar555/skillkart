"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle, Shield } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/common/Navbar"
import Footer from "../../components/common/Footer"

const Register: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setError("")
      setLoading(true)
      await register(email, password)
      navigate("/profile-setup")
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.")
      } else {
        setError("Failed to create an account. Please try again.")
      }
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

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "" }
    if (password.length < 6) return { strength: 1, text: "Weak" }
    if (password.length < 10) return { strength: 2, text: "Medium" }
    return { strength: 3, text: "Strong" }
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <>
      <Navbar />
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
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
                  <User className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Create your account
                </h2>
                <p className="text-gray-400 mt-2">Start building your personalized learning journey</p>
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

              <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
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
                    {password && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <Shield
                          className={`h-5 w-5 ${
                            passwordStrength.strength === 1
                              ? "text-red-400"
                              : passwordStrength.strength === 2
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                  {password && (
                    <div className="mt-1">
                      <div className="flex gap-1 h-1 mt-2">
                        <div
                          className={`flex-1 rounded-full ${
                            passwordStrength.strength >= 1 ? "bg-red-400" : "bg-gray-700"
                          }`}
                        ></div>
                        <div
                          className={`flex-1 rounded-full ${
                            passwordStrength.strength >= 2 ? "bg-yellow-400" : "bg-gray-700"
                          }`}
                        ></div>
                        <div
                          className={`flex-1 rounded-full ${
                            passwordStrength.strength >= 3 ? "bg-green-400" : "bg-gray-700"
                          }`}
                        ></div>
                      </div>
                      <p className="text-xs mt-1 text-gray-400">
                        {passwordStrength.text} {passwordStrength.strength < 3 && "- Use at least 10 characters"}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-800/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-3"
                      placeholder="••••••••"
                    />
                    {confirmPassword && password === confirmPassword && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-500 text-cyan-500 focus:ring-cyan-500 bg-gray-700"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                    I agree to the{" "}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium">
                    {loading ? (
                      <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <User className="h-5 w-5" />
                        <span>Create Account</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.form>

              <motion.div variants={itemVariants} className="mt-6 text-center text-sm">
                <span className="text-gray-400">Already have an account? </span>
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center">
                  Sign in
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default Register;
