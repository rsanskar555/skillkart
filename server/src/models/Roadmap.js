import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  resources: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ]
});

const weekSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  steps: [stepSchema]
});

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    skill: {
      type: String,
      required: true
    },
    category: String,
    totalWeeks: {
      type: Number,
      default: 0
    },
    completedWeeks: {
      type: Number,
      default: 0
    },
    progress: {
      type: Number,
      default: 0
    },
    imageUrl: String,
    weeks: [weekSchema],
    isTemplate: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('Roadmap', roadmapSchema);