import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Code, Palette, Database, ChevronRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg')] bg-cover bg-center"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="block">Master New Skills with</span>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
                  Personalized Roadmaps
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg mb-8">
                Build customized learning paths, track your progress, and connect with peers on your journey to mastery.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-md"
                  >
                    Get Started
                  </motion.button>
                </Link>
                
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border border-gray-500 hover:border-white text-gray-300 hover:text-white font-medium py-3 px-8 rounded-md transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 p-6 rounded-xl shadow-lg">
                <div className="rounded-md bg-gradient-to-r from-gray-800 to-gray-700 h-6 w-24 mb-4"></div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-cyan-500"></div>
                    </div>
                    <div className="h-4 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 w-40"></div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                    </div>
                    <div className="h-4 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 w-56"></div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-pink-500"></div>
                    </div>
                    <div className="h-4 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 w-48"></div>
                  </div>
                </div>
                
                <div className="mt-6 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 w-3/4"></div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-gray-800/40 backdrop-blur-sm border border-gray-700 p-4 rounded-xl shadow-lg rotate-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="h-3 rounded-md bg-gradient-to-r from-gray-700 to-gray-600 w-20"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How SkillKart Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our platform helps you create structured learning paths based on your goals, interests, and available time.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of learners who have accelerated their skill development with our personalized roadmaps.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-md inline-flex items-center"
              >
                <span>Create Your First Roadmap</span>
                <ChevronRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

const features = [
  {
    title: "Select Your Skills",
    description: "Choose from a variety of skill domains like Web Development, UI/UX Design, Data Science, and more.",
    icon: <Code className="h-6 w-6 text-cyan-400" />
  },
  {
    title: "Set Your Goals",
    description: "Define your learning objectives and the amount of time you can dedicate to learning each week.",
    icon: <BookOpen className="h-6 w-6 text-purple-400" />
  },
  {
    title: "Follow Your Roadmap",
    description: "Access a personalized step-by-step learning path with curated resources for each topic.",
    icon: <Palette className="h-6 w-6 text-pink-400" />
  },
  {
    title: "Track Progress",
    description: "Mark topics as complete, earn XP points, and unlock badges as you progress through your roadmap.",
    icon: <Database className="h-6 w-6 text-green-400" />
  }
];

export default Home;