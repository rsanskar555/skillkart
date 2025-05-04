import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Code, BookOpen, Award, Search, Bell, Save 
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import RoadmapCard from '../../components/roadmaps/RoadmapCard';
import XPProgress from '../../components/gamification/XPProgress';
import { useRoadmapStore } from '../../store/useRoadmapStore';

// Mock data for badges
const MOCK_BADGES = [
  { id: '1', name: '5-Day Streak', icon: '🔥', description: 'Completed activities for 5 consecutive days' },
  { id: '2', name: 'React Novice', icon: '⚛️', description: 'Completed the React basics module' },
  { id: '3', name: 'First Steps', icon: '👣', description: 'Started your first roadmap' }
];

// Mock skills available for selection
const AVAILABLE_SKILLS = [
  { id: 'react', name: 'React', icon: <code className="text-blue-400">⚛️</code>, category: 'Web Development' },
  { id: 'angular', name: 'Angular', icon: <code className="text-red-400">🅰️</code>, category: 'Web Development' },
  { id: 'vue', name: 'Vue.js', icon: <code className="text-green-400">🟢</code>, category: 'Web Development' },
  { id: 'node', name: 'Node.js', icon: <code className="text-green-400">🟢</code>, category: 'Backend' },
  { id: 'figma', name: 'Figma', icon: <code className="text-purple-400">🎨</code>, category: 'UI/UX Design' },
  { id: 'python', name: 'Python', icon: <code className="text-yellow-400">🐍</code>, category: 'Data Science' },
  { id: 'ml', name: 'Machine Learning', icon: <code className="text-pink-400">🧠</code>, category: 'Data Science' },
  { id: 'swift', name: 'iOS Development', icon: <code className="text-orange-400">📱</code>, category: 'Mobile' },
  { id: 'uiux', name: 'UI/UX Design', icon: <code className="text-purple-400">🎨</code>, category: 'UI/UX Design' },
  { id: 'datascience', name: 'Data Science', icon: <code className="text-blue-400">📊</code>, category: 'Data Science' },
];

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const { userRoadmaps, template, fetchRoadmaps, fetchTemplate, createRoadmap, isLoading, error } = useRoadmapStore();
  const [weeks, setWeeks] = useState<any[]>([]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  useEffect(() => {
    if (selectedSkill) {
      console.log('Dashboard: Fetching template for skill:', selectedSkill);
      fetchTemplate(selectedSkill);
    }
  }, [selectedSkill, fetchTemplate]);

  useEffect(() => {
    if (template && template.skill.toLowerCase() === selectedSkill?.toLowerCase()) {
      console.log('Dashboard: Template updated, setting weeks:', template.weeks);
      setWeeks(template.weeks || []);
    }
  }, [template, selectedSkill]);

  // Filter skills based on search query and selected category
  const filteredSkills = AVAILABLE_SKILLS.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? skill.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for the filter
  const categories = Array.from(new Set(AVAILABLE_SKILLS.map(skill => skill.category)));

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId);
  };

  const handleCreateRoadmap = async () => {
    if (!selectedSkill) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }
    try {
      console.log('Dashboard: Creating roadmap for skill:', selectedSkill);
      const roadmapId = await createRoadmap(selectedSkill);
      setIsCreateModalOpen(false);
      setSelectedSkill(null);
      navigate(`/roadmap/${roadmapId}`);
    } catch (err: any) {
      console.error('Dashboard: Failed to create roadmap:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome Back, {currentUser?.email?.split('@')[0] || 'Learner'}!
            </h1>
            <p className="text-gray-400">
              Continue your learning journey or start a new roadmap
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Roadmap</span>
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 cursor-pointer"
            >
              <Bell className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
        
        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <XPProgress xp={240} level={2} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex flex-col"
          >
            <h3 className="text-gray-400 mb-2 font-medium text-sm">Current Streak</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">5</span>
              <span className="text-lg text-yellow-400">🔥</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Days in a row</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex flex-col"
          >
            <h3 className="text-gray-400 mb-2 font-medium text-sm">Badges Earned</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{MOCK_BADGES.length}</span>
              <span className="text-lg text-purple-400">🏆</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">Keep learning to earn more</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 flex flex-col"
          >
            <h3 className="text-gray-400 mb-2 font-medium text-sm">Hours Studied</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">12</span>
              <span className="text-lg text-green-400">⏱️</span>
            </div>
            <p className="text-gray-500 text-sm mt-2">This week</p>
          </motion.div>
        </div>
        
        {/* My Roadmaps Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Roadmaps</h2>
            <Link to="/roadmaps" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View All
            </Link>
          </div>
          
          {userRoadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRoadmaps.map(roadmap => (
                <RoadmapCard key={roadmap.id} roadmap={roadmap} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/30 rounded-xl p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No roadmaps yet</h3>
              <p className="text-gray-400 mb-6">Start your learning journey by creating your first roadmap</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-md inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Roadmap</span>
              </motion.button>
            </div>
          )}
        </div>
        
        {/* Badges Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Earned Badges</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {MOCK_BADGES.map(badge => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center flex flex-col items-center"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-3 text-3xl">
                  {badge.icon}
                </div>
                <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                <p className="text-gray-500 text-xs">{badge.description}</p>
              </motion.div>
            ))}
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800/20 border border-dashed border-gray-700 rounded-xl p-4 text-center flex flex-col items-center justify-center cursor-default"
            >
              <div className="h-16 w-16 rounded-full bg-gray-800/40 flex items-center justify-center mb-3 text-3xl text-gray-600">
                ?
              </div>
              <h4 className="font-medium text-sm mb-1 text-gray-500">Next Badge</h4>
              <p className="text-gray-600 text-xs">Keep learning to unlock</p>
            </motion.div>
          </div>
        </div>
        
        {/* Create Roadmap Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Create New Roadmap</h2>
                <button 
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSelectedSkill(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {!selectedSkill ? (
                <>
                  <div className="mb-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search for a skill..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 p-3"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`py-1 px-3 rounded-full text-sm whitespace-nowrap ${
                        selectedCategory === null
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`py-1 px-3 rounded-full text-sm whitespace-nowrap ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {filteredSkills.map(skill => (
                      <motion.div
                        key={skill.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSkillSelect(skill.id)}
                        className="bg-gray-700/50 border border-gray-600 hover:border-cyan-500/50 rounded-lg p-4 h-full flex flex-col cursor-pointer"
                      >
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center mr-3 text-xl">
                            {skill.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{skill.name}</h4>
                            <p className="text-gray-400 text-sm">{skill.category}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {isLoading ? (
                    <div className="text-white text-center py-8">Loading template...</div>
                  ) : error || !template ? (
                    <div className="text-white text-center py-8">
                      <p>{error || 'Template not found'}</p>
                      {error && <p className="text-red-400 mt-2">Error details: {error}</p>}
                      <button
                        onClick={() => setSelectedSkill(null)}
                        className="text-cyan-400 hover:text-cyan-300 mt-4"
                      >
                        Back to Skill Selection
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Preview: {template.title}</h2>
                        <RoadmapCard
                          roadmap={{
                            id: `preview-${selectedSkill}`,
                            title: template.title || `${selectedSkill} Roadmap`,
                            category: template.category || 'Uncategorized',
                            progress: 0,
                            totalWeeks: template.totalWeeks || weeks.length,
                            completedWeeks: 0,
                            lastActivity: new Date(),
                            imageUrl: template.imageUrl || 'https://picsum.photos/400/200',
                          }}
                        />
                      </div>

                      <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Weeks</h2>
                        {weeks.length > 0 ? (
                          <div className="space-y-6">
                            {weeks.map((week: any, index: number) => (
                              <motion.div
                                key={`week-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-gray-800/70 border border-gray-700 rounded-xl p-6 shadow-lg"
                              >
                                <h3 className="text-lg font-semibold mb-2">{week.title}</h3>
                                <ul className="space-y-2">
                                  {week.steps.map((step: any, stepIndex: number) => (
                                    <li
                                      key={`step-${index}-${stepIndex}`}
                                      className="text-gray-300"
                                    >
                                      {step.title}: {step.description}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">No weeks available for this template.</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <div className="flex justify-end gap-3 mt-6 border-t border-gray-700 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setSelectedSkill(null);
                  }}
                  className="py-2 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </motion.button>
                {selectedSkill && !isLoading && !error && template && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateRoadmap}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>Create Roadmap</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;