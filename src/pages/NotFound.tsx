import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const NotFound: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg"
        >
          <h1 className="text-9xl font-bold text-cyan-400">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-3 px-6 rounded-md mx-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;