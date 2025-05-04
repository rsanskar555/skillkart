import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Circle, Clock, BookOpen, 
  MessageSquare, XCircle, ChevronDown, ChevronUp, Play
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useRoadmapStore } from '../../store/useRoadmapStore';
import RoadmapCard from '../../components/roadmaps/RoadmapCard';

const RoadmapView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchRoadmap, currentRoadmap, isLoading, error, toggleWeekExpansion, updateStepStatus } = useRoadmapStore();
  const [activeTab, setActiveTab] = useState('content');
  const [selectedResource, setSelectedResource] = useState<{ id: string; title: string; type: string } | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id && id !== 'undefined') {
      console.log('RoadmapView: Fetching roadmap with id:', id);
      fetchRoadmap(id);
    } else {
      console.error('RoadmapView: Invalid roadmap ID provided in URL:', id);
    }
  }, [id, fetchRoadmap]);

  if (!id || id === 'undefined') {
    return <div className="text-red-500 text-center py-8">Error: Invalid roadmap ID provided in URL.</div>;
  }

  if (isLoading) return <div className="text-white text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!currentRoadmap) return <div className="text-white text-center py-8">Roadmap not found</div>;

  // Validate currentRoadmap.id before rendering interactive elements
  if (!currentRoadmap.id || currentRoadmap.id === 'undefined') {
    console.error('RoadmapView: Current roadmap has invalid ID:', currentRoadmap);
    return <div className="text-red-500 text-center py-8">Error: Roadmap has invalid ID.</div>;
  }

  const totalSteps = currentRoadmap.weeks.reduce((acc, week) => acc + week.steps.length, 0);
  const completedSteps = currentRoadmap.weeks.reduce((acc, week) => {
    return acc + week.steps.filter(step => step.status === 'completed').length;
  }, 0);
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    // TODO: Implement real comment submission
    setNewComment('');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{currentRoadmap.title}</h1>
              <p className="text-gray-400">{currentRoadmap.description}</p>
            </div>

            <RoadmapCard
              roadmap={{
                id: currentRoadmap.id,
                title: currentRoadmap.title,
                category: currentRoadmap.category,
                progress: currentRoadmap.progress,
                totalWeeks: currentRoadmap.totalWeeks,
                completedWeeks: currentRoadmap.completedWeeks,
                lastActivity: new Date(currentRoadmap.lastActivity),
                imageUrl: currentRoadmap.imageUrl || 'https://via.placeholder.com/400x200'
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'content'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`py-2 px-4 font-medium text-sm border-b-2 ${
              activeTab === 'discussion'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Discussion
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {currentRoadmap.weeks.map((week, weekIndex) => (
              <motion.div
                key={week.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: weekIndex * 0.1 }}
                className={`border rounded-xl overflow-hidden ${
                  week.isCompleted
                    ? 'border-green-500/30 bg-green-500/5'
                    : 'border-gray-700 bg-gray-800/30'
                }`}
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleWeekExpansion(week.id)}
                >
                  <div className="flex items-center gap-3">
                    {week.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-500" />
                    )}
                    
                    <div>
                      <h3 className="font-medium">Week {weekIndex + 1}: {week.title}</h3>
                      <div className="text-sm text-gray-400">
                        {week.steps.filter(step => step.status === 'completed').length}/{week.steps.length} steps completed
                      </div>
                    </div>
                  </div>
                  
                  <button className="text-gray-400">
                    {week.isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {week.isExpanded && (
                  <div className="border-t border-gray-700 p-4 space-y-4">
                    {week.steps.map((step, stepIndex) => (
                      <div key={step.id} className="bg-gray-800/50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {step.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : step.status === 'in_progress' ? (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">
                              {weekIndex + 1}.{stepIndex + 1} {step.title}
                            </h4>
                            <p className="text-sm text-gray-400 mb-4">{step.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {step.resources.map(resource => (
                                <motion.button
                                  key={resource.id}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setSelectedResource(resource)}
                                  className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs bg-gray-700 hover:bg-gray-600 text-gray-300"
                                >
                                  {resource.type === 'video' ? (
                                    <Play className="h-3 w-3" />
                                  ) : (
                                    <BookOpen className="h-3 w-3" />
                                  )}
                                  <span>{resource.title}</span>
                                </motion.button>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateStepStatus(currentRoadmap.id, step.id, 'not_started')}
                                className={`py-1 px-3 rounded-full text-xs font-medium border ${
                                  step.status === 'not_started'
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                              >
                                Not Started
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateStepStatus(currentRoadmap.id, step.id, 'in_progress')}
                                className={`py-1 px-3 rounded-full text-xs font-medium border ${
                                  step.status === 'in_progress'
                                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                              >
                                In Progress
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateStepStatus(currentRoadmap.id, step.id, 'completed')}
                                className={`py-1 px-3 rounded-full text-xs font-medium border ${
                                  step.status === 'completed'
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                    : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-600'
                                }`}
                              >
                                Completed
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Discussion Tab */}
        {activeTab === 'discussion' && (
          <div>
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ask a question or share your thoughts..."
                  className="w-full bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-4 min-h-[100px]"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="py-2 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Post Comment</span>
                </motion.button>
              </div>
            </form>
            
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
              <p className="text-gray-400">
                Be the first to start a discussion!
              </p>
            </div>
          </div>
        )}
        
        {/* Resource Modal */}
        {selectedResource && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-3xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedResource.title}</h2>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 mb-6 flex items-center justify-center min-h-[300px]">
                {selectedResource.type === 'video' ? (
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      In a real application, a video player would be embedded here.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      In a real application, a blog article would be displayed here.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedResource(null)}
                  className="py-2 px-6 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white font-medium"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RoadmapView;