import mongoose from 'mongoose';
import Roadmap from './src/models/Roadmap.js';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'skillkart'
    });
    console.log('MongoDB connected to skillkart database');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Roadmap.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing roadmaps and users');

    // Seed templates
    const templates = [
      {
        userId: 'admin',
        title: 'React Roadmap',
        description: 'A comprehensive roadmap to learn React for web development.',
        skill: 'react',
        category: 'Web Development',
        imageUrl: 'https://picsum.photos/400/200',
        weeks: [
          {
            title: 'Week 1: Introduction to React',
            steps: [
              {
                title: 'Learn JSX',
                description: 'Understand the basics of JSX syntax.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'JSX Introduction', type: 'article' },
                  { _id: new mongoose.Types.ObjectId(), title: 'JSX Basics Video', type: 'video' }
                ]
              },
              {
                title: 'Set Up React Environment',
                description: 'Install Node.js and create a new React app using Create React App.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'Create React App Guide', type: 'article' }
                ]
              }
            ]
          },
          {
            title: 'Week 2: React Components',
            steps: [
              {
                title: 'Create Functional Components',
                description: 'Learn how to create and use functional components in React.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'Functional Components Video', type: 'video' },
                  { _id: new mongoose.Types.ObjectId(), title: 'React Components Quiz', type: 'quiz' }
                ]
              }
            ]
          }
        ],
        totalWeeks: 2,
        completedWeeks: 0,
        progress: 0,
        lastActivity: new Date(),
        isTemplate: true,
        discussions: [
          {
            userId: 'admin',
            username: 'Admin',
            comment: 'Welcome to the React Roadmap! Feel free to ask questions here.',
            createdAt: new Date(),
            replies: []
          }
        ]
      },
      {
        userId: 'admin',
        title: 'Node.js Roadmap',
        description: 'A roadmap to learn Node.js for backend development.',
        skill: 'node',
        category: 'Backend',
        imageUrl: 'https://picsum.photos/400/200',
        weeks: [
          {
            title: 'Week 1: Introduction to Node.js',
            steps: [
              {
                title: 'Install Node.js',
                description: 'Set up Node.js on your machine.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'Node.js Installation Guide', type: 'article' },
                  { _id: new mongoose.Types.ObjectId(), title: 'Node.js Setup Video', type: 'video' }
                ]
              }
            ]
          }
        ],
        totalWeeks: 1,
        completedWeeks: 0,
        progress: 0,
        lastActivity: new Date(),
        isTemplate: true,
        discussions: []
      },
      {
        userId: 'admin',
        title: 'Python Roadmap',
        description: 'A roadmap to learn Python for programming and data science.',
        skill: 'python',
        category: 'Data Science',
        imageUrl: 'https://picsum.photos/400/200',
        weeks: [
          {
            title: 'Week 1: Introduction to Python',
            steps: [
              {
                title: 'Install Python',
                description: 'Set up Python on your machine.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'Python Installation Guide', type: 'article' },
                  { _id: new mongoose.Types.ObjectId(), title: 'Python Setup Video', type: 'video' }
                ]
              },
              {
                title: 'Learn Python Basics',
                description: 'Understand variables, data types, and basic syntax in Python.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'Python Basics Tutorial', type: 'article' }
                ]
              }
            ]
          },
          {
            title: 'Week 2: Python Control Structures',
            steps: [
              {
                title: 'Learn Loops and Conditionals',
                description: 'Understand how to use loops and conditionals in Python.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'Python Loops and Conditionals Video', type: 'video' },
                  { _id: new mongoose.Types.ObjectId(), title: 'Python Control Structures Quiz', type: 'quiz' }
                ]
              }
            ]
          }
        ],
        totalWeeks: 2,
        completedWeeks: 0,
        progress: 0,
        lastActivity: new Date(),
        isTemplate: true,
        discussions: [
          {
            userId: 'admin',
            username: 'Admin',
            comment: 'Welcome to the Python Roadmap! Let’s get started with Python basics.',
            createdAt: new Date(),
            replies: [
              {
                userId: 'learner1',
                username: 'Learner1',
                comment: 'Thanks for the roadmap! I’m excited to learn Python.',
                createdAt: new Date(),
              }
            ]
          }
        ]
      },
      {
        userId: 'admin',
        title: 'UI/UX Design Roadmap',
        description: 'A roadmap to learn UI/UX design principles and tools.',
        skill: 'uiux',
        category: 'UI/UX Design',
        imageUrl: 'https://picsum.photos/400/200',
        weeks: [
          {
            title: 'Week 1: Introduction to UI/UX',
            steps: [
              {
                title: 'Learn Design Principles',
                description: 'Understand the basics of design principles like balance, contrast, and hierarchy.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'UI/UX Design Principles', type: 'article' },
                  { _id: new mongoose.Types.ObjectId(), title: 'Design Basics Video', type: 'video' }
                ]
              }
            ]
          }
        ],
        totalWeeks: 1,
        completedWeeks: 0,
        progress: 0,
        lastActivity: new Date(),
        isTemplate: true,
        discussions: []
      },
      {
        userId: 'admin',
        title: 'Data Science Roadmap',
        description: 'A roadmap to learn data science with Python.',
        skill: 'datascience',
        category: 'Data Science',
        imageUrl: 'https://picsum.photos/400/200',
        weeks: [
          {
            title: 'Week 1: Introduction to Data Science',
            steps: [
              {
                title: 'Learn Data Science Basics',
                description: 'Understand the data science workflow and key concepts.',
                status: 'not_started',
                resources: [
                  { _id: new mongoose.Types.ObjectId(), title: 'Data Science Introduction', type: 'article' },
                  { _id: new mongoose.Types.ObjectId(), title: 'Data Science Overview Video', type: 'video' }
                ]
              }
            ]
          }
        ],
        totalWeeks: 1,
        completedWeeks: 0,
        progress: 0,
        lastActivity: new Date(),
        isTemplate: true,
        discussions: []
      }
    ];

    await Roadmap.insertMany(templates);
    console.log('Inserted roadmap templates:', templates);

    // Seed a sample user with a roadmap
    const sampleUser = new User({
      uid: 'learner1',
      email: 'learner1@example.com',
      profile: {
        name: 'Learner One',
        interests: ['Web Development', 'Data Science'],
        goals: 'Become a Full-Stack Developer', // Changed from array to string
        weeklyTime: 10,
        experience: 'beginner'
      },
      xp: 50,
      badges: [
        {
          id: 'first-roadmap',
          name: 'First Steps',
          description: 'Started your first learning roadmap',
          earnedAt: new Date()
        }
      ],
      lastActivity: new Date()
    });

    await sampleUser.save();
    console.log('Inserted sample user:', sampleUser);

    // Create a user roadmap based on the Python template
    const pythonTemplate = templates.find(t => t.skill === 'python');
    const userRoadmap = new Roadmap({
      userId: 'learner1',
      title: 'My Python Roadmap',
      description: pythonTemplate.description,
      skill: pythonTemplate.skill,
      category: pythonTemplate.category,
      imageUrl: pythonTemplate.imageUrl,
      weeks: pythonTemplate.weeks.map(week => ({
        ...week,
        steps: week.steps.map(step => ({
          ...step,
          resources: step.resources.map(resource => ({ ...resource }))
        }))
      })),
      totalWeeks: pythonTemplate.totalWeeks,
      completedWeeks: 0,
      progress: 0,
      lastActivity: new Date(),
      isTemplate: false,
      discussions: [
        {
          userId: 'learner1',
          username: 'Learner1',
          comment: 'I’ve started this roadmap! Any tips for beginners?',
          createdAt: new Date(),
          replies: []
        }
      ]
    });

    await userRoadmap.save();
    console.log('Inserted user roadmap:', userRoadmap);

    // Disconnect from MongoDB
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Seed error:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();