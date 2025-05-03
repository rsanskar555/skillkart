import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

interface Roadmap {
  id: string;
  title: string;
  category: string;
  progress: number;
  totalWeeks: number;
  completedWeeks: number;
  lastActivity: Date;
  imageUrl: string;
}

interface RoadmapCardProps {
  roadmap: Roadmap;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  // Format date to display "Today", "Yesterday" or the date
  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const roadmapDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (roadmapDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (roadmapDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
    >
      <div className="h-40 overflow-hidden relative">
        <img 
          src={roadmap.imageUrl} 
          alt={roadmap.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-700/80 text-gray-300">
            {roadmap.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{roadmap.title}</h3>
        
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock className="h-4 w-4" />
            <span>Last active {formatDate(roadmap.lastActivity)}</span>
          </div>
          <span className="text-sm font-medium">{roadmap.completedWeeks}/{roadmap.totalWeeks} weeks</span>
        </div>
        
        <div className="relative h-2 bg-gray-700 rounded-full mb-4">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${roadmap.progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
          ></motion.div>
        </div>
        
        <Link to={`/roadmap/${roadmap.id}`}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-white hover:from-cyan-500/30 hover:to-purple-600/30 border border-cyan-500/40 flex items-center justify-center gap-2"
          >
            <span>Continue Learning</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default RoadmapCard;