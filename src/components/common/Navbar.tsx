import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, User, LogOut, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <motion.nav 
      className="bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-sm border-b border-gray-800 py-4 px-6 sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-cyan-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            SkillKart
          </span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <motion.div
                className="flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </motion.div>
              <Link to="/profile">
                <motion.div
                  className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <User className="h-5 w-5 text-white" />
                </motion.div>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link to="/register">
                <motion.button 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;