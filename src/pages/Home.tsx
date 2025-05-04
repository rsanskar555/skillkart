"use client"

import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { BookOpen, Code, Palette, Database, ChevronRight, Star, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"

const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 opacity-95"></div>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg')",
            }}
          ></div>
          {/* Abstract shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-6 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium"
              >
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" />
                  <span>The ultimate learning platform</span>
                </div>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block">Master New Skills with</span>
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text">
                  Personalized Roadmaps
                </span>
              </h1>

              <p className="text-gray-300 text-lg mb-8 max-w-lg">
                Build customized learning paths, track your progress, and connect with peers on your journey to mastery.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                    <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-3 px-8 rounded-lg flex items-center gap-2">
                      <span>Get Started</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </motion.button>
                </Link>

                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-gray-500 hover:border-white text-gray-300 hover:text-white font-medium py-3 px-8 rounded-lg transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gradient-to-br from-gray-700 to-gray-800"
                    ></div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-white font-medium">1,000+</span> learners joined this week
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden md:block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur-lg"></div>
              <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-2xl relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="rounded-md bg-gradient-to-r from-gray-700 to-gray-600 h-6 w-24"></div>
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-cyan-500"></div>
                    </div>
                    <div className="h-4 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 w-40"></div>
                    <div className="ml-auto px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-300 text-xs">
                      75%
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                    </div>
                    <div className="h-4 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 w-56"></div>
                    <div className="ml-auto px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs">
                      40%
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-pink-500"></div>
                    </div>
                    <div className="h-4 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 w-48"></div>
                    <div className="ml-auto px-2 py-1 rounded-md bg-pink-500/20 text-pink-300 text-xs">
                      90%
                    </div>
                  </div>
                </div>

                <div className="mt-8 h-2 rounded-full bg-gray-700 w-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 w-3/4"></div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-xs text-gray-400">Progress</div>
                  <div className="text-xs font-medium text-white">75%</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl shadow-lg rotate-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-xs text-green-300 font-medium">Task completed!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-block mb-3 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span>How it works</span>
              </div>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
              Your Path to Mastery
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-400 max-w-2xl mx-auto">
              Our platform helps you create structured learning paths based on your goals, interests, and available time.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
                <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 shadow-lg"
                >
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700/50 flex items-center justify-center mb-5 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
                </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-3 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span>Success stories</span>
              </div>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">
              What Our Learners Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of learners who have accelerated their skill development with our personalized roadmaps.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gradient-to-br from-gray-800/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center"
          >
            <motion.div variants={itemVariants} className="inline-block mb-3 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                <span>Start today</span>
              </div>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of learners who have accelerated their skill development with our personalized roadmaps.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-3 px-8 rounded-lg flex items-center gap-2">
                    <span>Create Your First Roadmap</span>
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </div>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}

const features = [
  {
    title: "Select Your Skills",
    description: "Choose from a variety of skill domains like Web Development, UI/UX Design, Data Science, and more.",
    icon: <Code className="h-6 w-6 text-cyan-400" />,
  },
  {
    title: "Set Your Goals",
    description: "Define your learning objectives and the amount of time you can dedicate to learning each week.",
    icon: <BookOpen className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Follow Your Roadmap",
    description: "Access a personalized step-by-step learning path with curated resources for each topic.",
    icon: <Palette className="h-6 w-6 text-pink-400" />,
  },
  {
    title: "Track Progress",
    description: "Mark topics as complete, earn XP points, and unlock badges as you progress through your roadmap.",
    icon: <Database className="h-6 w-6 text-green-400" />,
  },
]

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Frontend Developer",
    text: "SkillKart helped me transition from a beginner to a professional developer in just 6 months. The roadmap was perfectly tailored to my needs.",
  },
  {
    name: "Sarah Williams",
    role: "UX Designer",
    text: "The structured approach to learning design principles was exactly what I needed. I've landed my dream job thanks to the skills I gained.",
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    text: "The AI and machine learning roadmap was comprehensive and up-to-date with the latest technologies. Highly recommended!",
  },
]

export default Home
