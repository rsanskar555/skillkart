import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Circle, Clock, Laptop, BookOpen, 
  MessageSquare, XCircle, ChevronDown, ChevronUp, Play
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

// Mock data for roadmap
const MOCK_ROADMAP = {
  id: '1',
  title: 'React Developer',
  description: 'A comprehensive roadmap to become a proficient React developer, covering fundamentals to advanced concepts.',
  category: 'Web Development',
  progress: 35,
  totalWeeks: 10,
  completedWeeks: 3,
  weeks: [
    {
      id: 'week-1',
      title: 'JavaScript Fundamentals',
      isCompleted: true,
      isExpanded: true,
      steps: [
        {
          id: 'step-1-1',
          title: 'ES6+ Features',
          description: 'Learn modern JavaScript features like arrow functions, destructuring, and template literals.',
          status: 'completed',
          resources: [
            { id: 'resource-1', title: 'Modern JavaScript Tutorial', type: 'video' },
            { id: 'resource-2', title: 'ES6 Cheatsheet', type: 'blog' }
          ]
        },
        {
          id: 'step-1-2',
          title: 'Asynchronous JavaScript',
          description: 'Master Promises, async/await, and handling asynchronous operations.',
          status: 'completed',
          resources: [
            { id: 'resource-3', title: 'Async JavaScript Deep Dive', type: 'video' },
            { id: 'resource-4', title: 'Promise Patterns', type: 'blog' }
          ]
        }
      ]
    },
    {
      id: 'week-2',
      title: 'React Basics',
      isCompleted: true,
      isExpanded: false,
      steps: [
        {
          id: 'step-2-1',
          title: 'JSX and Components',
          description: 'Understand JSX syntax and how to create functional and class components.',
          status: 'completed',
          resources: [
            { id: 'resource-5', title: 'React Components 101', type: 'video' },
            { id: 'resource-6', title: 'JSX In Depth', type: 'blog' }
          ]
        },
        {
          id: 'step-2-2',
          title: 'Props and State',
          description: 'Learn about component props and state management.',
          status: 'completed',
          resources: [
            { id: 'resource-7', title: 'State and Props Guide', type: 'video' },
            { id: 'resource-8', title: 'State Management Patterns', type: 'blog' }
          ]
        }
      ]
    },
    {
      id: 'week-3',
      title: 'React Hooks',
      isCompleted: true,
      isExpanded: false,
      steps: [
        {
          id: 'step-3-1',
          title: 'useState and useEffect',
          description: 'Master the basic React hooks for state and side effects.',
          status: 'completed',
          resources: [
            { id: 'resource-9', title: 'React Hooks Introduction', type: 'video' },
            { id: 'resource-10', title: 'useState vs useReducer', type: 'blog' }
          ]
        },
        {
          id: 'step-3-2',
          title: 'Custom Hooks',
          description: 'Learn to create reusable custom hooks.',
          status: 'completed',
          resources: [
            { id: 'resource-11', title: 'Building Custom Hooks', type: 'video' },
            { id: 'resource-12', title: 'Custom Hooks Examples', type: 'blog' }
          ]
        }
      ]
    },
    {
      id: 'week-4',
      title: 'React Router',
      isCompleted: false,
      isExpanded: false,
      steps: [
        {
          id: 'step-4-1',
          title: 'Router Setup',
          description: 'Set up client-side routing with React Router.',
          status: 'in_progress',
          resources: [
            { id: 'resource-13', title: 'React Router Tutorial', type: 'video' },
            { id: 'resource-14', title: 'Navigation Patterns', type: 'blog' }
          ]
        },
        {
          id: 'step-4-2',
          title: 'Route Parameters',
          description: 'Learn to use dynamic route parameters and nested routes.',
          status: 'not_started',
          resources: [
            { id: 'resource-15', title: 'Advanced Routing', type: 'video' },
            { id: 'resource-16', title: 'Route Guards and Redirects', type: 'blog' }
          ]
        }
      ]
    },
    {
      id: 'week-5',
      title: 'State Management',
      isCompleted: false,
      isExpanded: false,
      steps: [
        {
          id: 'step-5-1',
          title: 'Context API',
          description: 'Use React Context for global state management.',
          status: 'not_started',
          resources: [
            { id: 'resource-17', title: 'Context API Deep Dive', type: 'video' },
            { id: 'resource-18', title: 'When to Use Context', type: 'blog' }
          ]
        },
        {
          id: 'step-5-2',
          title: 'Redux Basics',
          description: 'Learn Redux state management principles.',
          status: 'not_started',
          resources: [
            { id: 'resource-19', title: 'Redux Fundamentals', type: 'video' },
            { id: 'resource-20', title: 'Redux vs Context', type: 'blog' }
          ]
        }
      ]
    }
  ],
  discussions: [
    {
      id: 'disc-1',
      user: {
        id: 'user-1',
        name: 'Jane Cooper',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      content: 'Is anyone else struggling with useEffect dependencies? I keep getting infinite loops.',
      timestamp: '2 days ago',
      replies: [
        {
          id: 'reply-1',
          user: {
            id: 'user-2',
            name: 'Alex Johnson',
            avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          },
          content: 'Try adding your dependencies to the dependency array. If you\'re updating state based on props, make sure to include those props in the array.',
          timestamp: '1 day ago'
        }
      ]
    },
    {
      id: 'disc-2',
      user: {
        id: 'user-3',
        name: 'Robert Fox',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      content: 'The custom hooks tutorial in Week 3 was super helpful. I created a useLocalStorage hook for my project!',
      timestamp: '5 days ago',
      replies: []
    }
  ]
};

const RoadmapView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [roadmap, setRoadmap] = useState(MOCK_ROADMAP);
  const [activeTab, setActiveTab] = useState('content');
  const [selectedResource, setSelectedResource] = useState<{ id: string; title: string; type: string } | null>(null);
  const [newComment, setNewComment] = useState('');
  
  // Toggle week expansion
  const toggleWeekExpansion = (weekId: string) => {
    setRoadmap(prev => ({
      ...prev,
      weeks: prev.weeks.map(week => 
        week.id === weekId 
          ? { ...week, isExpanded: !week.isExpanded }
          : week
      )
    }));
  };
  
  // Update step status
  const updateStepStatus = (weekId: string, stepId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    setRoadmap(prev => ({
      ...prev,
      weeks: prev.weeks.map(week => 
        week.id === weekId 
          ? {
              ...week,
              steps: week.steps.map(step => 
                step.id === stepId 
                  ? { ...step, status: newStatus }
                  : step
              )
            }
          : week
      )
    }));
    
    // In a real app, we would make an API call to update the step status
  };
  
  // Calculate overall progress
  const totalSteps = roadmap.weeks.reduce((acc, week) => acc + week.steps.length, 0);
  const completedSteps = roadmap.weeks.reduce((acc, week) => {
    return acc + week.steps.filter(step => step.status === 'completed').length;
  }, 0);
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // In a real app, we would make an API call to post the comment
    // For now, we'll just add it to the local state
    const newDiscussion = {
      id: `disc-${roadmap.discussions.length + 1}`,
      user: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      content: newComment,
      timestamp: 'Just now',
      replies: []
    };
    
    setRoadmap(prev => ({
      ...prev,
      discussions: [newDiscussion, ...prev.discussions]
    }));
    
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
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{roadmap.title}</h1>
              <p className="text-gray-400">{roadmap.description}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{completedSteps}/{totalSteps}</div>
                <div className="text-sm text-gray-400">Steps</div>
              </div>
              
              <div className="h-16 w-16 rounded-full relative flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    fill="transparent"
                    stroke="#374151"
                    strokeWidth="4"
                  />
                  
                  {/* Progress Circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    fill="transparent"
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={30 * 2 * Math.PI}
                    strokeDashoffset={30 * 2 * Math.PI * (1 - progressPercentage / 100)}
                  />
                  
                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-semibold">{progressPercentage}%</span>
                </div>
              </div>
            </div>
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
            {roadmap.weeks.map((week, weekIndex) => (
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
                                onClick={() => updateStepStatus(week.id, step.id, 'not_started')}
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
                                onClick={() => updateStepStatus(week.id, step.id, 'in_progress')}
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
                                onClick={() => updateStepStatus(week.id, step.id, 'completed')}
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
            
            <div className="space-y-6">
              {roadmap.discussions.length > 0 ? (
                roadmap.discussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-800/30 border border-gray-700 rounded-xl p-6"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={discussion.user.avatar} 
                        alt={discussion.user.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{discussion.user.name}</h4>
                            <span className="text-sm text-gray-400">{discussion.timestamp}</span>
                          </div>
                          
                          <button className="text-gray-500 hover:text-gray-400">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                        
                        <p className="mb-4">{discussion.content}</p>
                        
                        <div className="flex gap-4">
                          <button className="text-sm text-gray-400 hover:text-cyan-400">
                            Reply
                          </button>
                        </div>
                        
                        {/* Replies */}
                        {discussion.replies.length > 0 && (
                          <div className="mt-4 pl-6 border-l border-gray-700 space-y-4">
                            {discussion.replies.map(reply => (
                              <div key={reply.id} className="flex gap-3">
                                <img 
                                  src={reply.user.avatar} 
                                  alt={reply.user.name} 
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                                
                                <div>
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <h5 className="font-medium">{reply.user.name}</h5>
                                    <span className="text-xs text-gray-400">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-sm">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                  <p className="text-gray-400">
                    Be the first to start a discussion!
                  </p>
                </div>
              )}
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