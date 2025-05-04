"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, ArrowRight, Star } from "lucide-react"

interface Roadmap {
  id: string
  title: string
  category: string
  progress: number
  totalWeeks: number
  completedWeeks: number
  lastActivity: Date | string
  imageUrl: string
}

interface RoadmapCardProps {
  roadmap: Roadmap
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  const formatDate = (dateInput: Date | string): string => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "Unknown"
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const roadmapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (roadmapDate.getTime() === today.getTime()) {
      return "Today"
    } else if (roadmapDate.getTime() === yesterday.getTime()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  if (!roadmap.id || roadmap.id === "undefined") {
    console.error("RoadmapCard: Invalid roadmap ID:", roadmap)
    return null
  }

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    tap: { scale: 0.98 },
  }

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${roadmap.progress}%`,
      transition: { duration: 1.2, ease: "easeOut", delay: 0.3 },
    },
  }

  const buttonVariants = {
    initial: { opacity: 0.9 },
    hover: {
      scale: 1.03,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  const arrowVariants = {
    hover: {
      x: 5,
      transition: { repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" as "reverse", duration: 0.6 },
    },
  }

  const categoryVariants = {
    hover: {
      y: -3,
      backgroundColor: "rgba(99, 102, 241, 0.8)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg border border-gray-700/50 rounded-xl overflow-hidden shadow-lg shadow-purple-900/10 transition-all duration-300"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="h-44 overflow-hidden relative">
        <motion.div variants={imageVariants} className="h-full w-full">
          <img
            src={roadmap.imageUrl || "/placeholder.svg"}
            alt={roadmap.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/95"></div>

        {/* Glowing effect on top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500 opacity-80"></div>

        <motion.div variants={categoryVariants} className="absolute bottom-3 left-3">
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-600/70 text-white shadow-lg shadow-indigo-900/20 backdrop-blur-md border border-indigo-500/30 flex items-center gap-1">
            <Star className="h-3 w-3" />
            {roadmap.category}
          </span>
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {roadmap.title}
        </h3>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5 text-gray-300 text-sm">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>
              Last active <span className="font-semibold text-cyan-300">{formatDate(roadmap.lastActivity)}</span>
            </span>
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {roadmap.completedWeeks}/{roadmap.totalWeeks} weeks
          </span>
        </div>

        <div className="relative h-2.5 bg-gray-800/80 rounded-full mb-5 border border-gray-700/50 p-0.5">
          <motion.div
            variants={progressVariants}
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, rgba(6,182,212,1) 0%, rgba(124,58,237,1) 100%)",
              boxShadow: "0 0 10px rgba(124,58,237,0.5)",
            }}
          >
            {/* Animated glow effect */}
            <div className="absolute top-0 right-0 w-4 h-full bg-white/30 blur-sm"></div>
          </motion.div>
        </div>

        <Link to={`/roadmap/${roadmap.id}`} className="block">
          <motion.button
            variants={buttonVariants}
            className="w-full py-2.5 px-4 rounded-lg text-white flex items-center justify-center gap-2 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(124,58,237,0.25) 100%)",
              border: "1px solid rgba(124,58,237,0.3)",
              boxShadow: "0 4px 12px rgba(124,58,237,0.15), inset 0 1px 1px rgba(255,255,255,0.1)",
            }}
          >
            <span className="font-medium">Continue Learning</span>
            <motion.div variants={arrowVariants}>
              <ArrowRight className="h-4 w-4 text-purple-300" />
            </motion.div>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

export default RoadmapCard;
