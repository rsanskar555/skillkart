import React from 'react';
import { motion } from 'framer-motion';

interface XPProgressProps {
  xp: number;
  level: number;
}

const XPProgress: React.FC<XPProgressProps> = ({ xp, level }) => {
  // Calculate level thresholds
  const currentLevelThreshold = level * 100;
  const nextLevelThreshold = (level + 1) * 100;
  
  // Calculate progress percentage to next level
  const progressToNextLevel = ((xp - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-gray-400 mb-2 font-medium text-sm">Your Level</h3>
      
      <div className="flex items-center justify-center flex-1">
        <div className="relative">
          <svg className="w-24 h-24">
            {/* Background Circle */}
            <circle
              cx="48"
              cy="48"
              r="36"
              fill="transparent"
              stroke="#374151"
              strokeWidth="8"
            />
            
            {/* Progress Circle */}
            <motion.circle
              cx="48"
              cy="48"
              r="36"
              fill="transparent"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={36 * 2 * Math.PI}
              initial={{ strokeDashoffset: 36 * 2 * Math.PI }}
              animate={{ 
                strokeDashoffset: 36 * 2 * Math.PI * (1 - progressToNextLevel / 100) 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{level}</span>
            <span className="text-xs text-gray-400">Level</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{xp} XP</span>
          <span>{nextLevelThreshold} XP</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default XPProgress;