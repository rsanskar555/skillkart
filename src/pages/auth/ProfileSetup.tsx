import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, BrainCircuit, AlertCircle, ChevronRight, Briefcase 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

// Constants for available interests and weekly time options
const INTERESTS = [
  { id: 'web-dev', label: 'Web Development', icon: <code className="text-cyan-400">{'</>'}</code> },
  { id: 'ui-ux', label: 'UI/UX Design', icon: <code className="text-purple-400">{'✦'}</code> },
  { id: 'data-science', label: 'Data Science', icon: <code className="text-green-400">{'📊'}</code> },
  { id: 'mobile-dev', label: 'Mobile Development', icon: <code className="text-pink-400">{'📱'}</code> },
  { id: 'devops', label: 'DevOps', icon: <code className="text-yellow-400">{'⚙️'}</code> },
  { id: 'game-dev', label: 'Game Development', icon: <code className="text-red-400">{'🎮'}</code> },
];

const WEEKLY_TIME_OPTIONS = [
  { value: 5, label: 'Less than 5 hours' },
  { value: 10, label: '5-10 hours' },
  { value: 15, label: '10-15 hours' },
  { value: 20, label: '15-20 hours' },
  { value: 25, label: '20+ hours' },
];

interface ProfileData {
  interests: string[];
  goals: string;
  weeklyTime: number;
  experience: string;
}

const ProfileSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, setHasProfile } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [profileData, setProfileData] = useState<ProfileData>({
    interests: [],
    goals: '',
    weeklyTime: 10,
    experience: 'beginner'
  });
  
  const handleInterestToggle = (interestId: string) => {
    setProfileData(prev => {
      const exists = prev.interests.includes(interestId);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter(id => id !== interestId)
          : [...prev.interests, interestId]
      };
    });
  };
  
  const handleNextStep = () => {
    if (step === 1 && profileData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }
    
    if (step === 2 && !profileData.goals.trim()) {
      setError('Please enter your learning goals');
      return;
    }
    
    setError('');
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      // In a real application, this would make an API call to save the profile data
      // For now, we'll just mock it with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user state to indicate they have a profile
      setHasProfile(true);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Set Up Your Learning Profile</h2>
              <p className="text-gray-400 mt-2">Help us personalize your learning roadmaps</p>
            </div>
            
            {/* Progress Indicator */}
            <div className="relative mb-8">
              <div className="h-1 w-full bg-gray-700 rounded-full">
                <motion.div 
                  className="h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                  initial={{ width: '33.33%' }}
                  animate={{ width: `${step * 33.33}%` }}
                  transition={{ duration: 0.3 }}
                ></motion.div>
              </div>
              
              <div className="flex justify-between mt-2">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    1
                  </div>
                  <span className="text-xs text-gray-400 mt-1">Interests</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    2
                  </div>
                  <span className="text-xs text-gray-400 mt-1">Goals</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    3
                  </div>
                  <span className="text-xs text-gray-400 mt-1">Time & Level</span>
                </div>
              </div>
            </div>
            
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
            
            {/* Step 1: Interests */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-cyan-400" />
                  <span>What are you interested in learning?</span>
                </h3>
                <p className="text-gray-400 mb-6">Select all that apply</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {INTERESTS.map(interest => (
                    <motion.div
                      key={interest.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`cursor-pointer p-4 rounded-lg border ${
                        profileData.interests.includes(interest.id)
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      } flex items-center gap-3`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center">
                        {interest.icon}
                      </div>
                      <span className="font-medium">{interest.label}</span>
                      {profileData.interests.includes(interest.id) && (
                        <CheckCircle className="h-5 w-5 text-cyan-400 ml-auto" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Step 2: Goals */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-cyan-400" />
                  <span>What are your learning goals?</span>
                </h3>
                <p className="text-gray-400 mb-6">Describe what you hope to achieve</p>
                
                <div className="mb-8">
                  <textarea
                    value={profileData.goals}
                    onChange={(e) => setProfileData(prev => ({ ...prev, goals: e.target.value }))}
                    rows={5}
                    className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-4"
                    placeholder="e.g., I want to build a personal website using React, or learn UX design to create better products."
                  ></textarea>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Time & Experience Level */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <span>How much time can you dedicate weekly?</span>
                </h3>
                
                <div className="mb-8">
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    {WEEKLY_TIME_OPTIONS.map(option => (
                      <motion.div
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setProfileData(prev => ({ ...prev, weeklyTime: option.value }))}
                        className={`cursor-pointer p-4 rounded-lg border ${
                          profileData.weeklyTime === option.value
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        } flex items-center gap-3`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {profileData.weeklyTime === option.value && (
                          <CheckCircle className="h-5 w-5 text-cyan-400 ml-auto" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 mt-8 flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-cyan-400" />
                    <span>Your experience level:</span>
                  </h3>
                  
                  <div className="flex gap-4 mb-6">
                    {['beginner', 'intermediate', 'advanced'].map(level => (
                      <motion.button
                        key={level}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileData(prev => ({ ...prev, experience: level }))}
                        className={`flex-1 py-3 px-4 rounded-lg uppercase text-sm font-medium tracking-wide ${
                          profileData.experience === level
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                            : 'bg-gray-800/30 border border-gray-700 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        {level}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevStep}
                  className="py-2 px-6 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  Back
                </motion.button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextStep}
                  className="py-2 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium flex items-center gap-2"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`py-2 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium flex items-center gap-2 ${
                    loading ? 'opacity-70' : 'hover:from-cyan-600 hover:to-purple-700'
                  }`}
                >
                  {loading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  ) : (
                    <>
                      <span>Complete Profile</span>
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileSetup;