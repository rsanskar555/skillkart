import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  resources: [
    {
      title: String,
      url: String
    }
  ]
});

const weekSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  steps: [stepSchema],
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const roadmapSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  totalWeeks: {
    type: Number,
    required: true
  },
  completedWeeks: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  },
  weeks: [weekSchema],
  isTemplate: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);