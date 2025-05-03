import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    profile: {
      interests: [String],
      goals: String,
      weeklyTime: Number,
      experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      }
    },
    xp: {
      type: Number,
      default: 0
    },
    badges: [
      {
        id: String,
        name: String,
        description: String,
        earnedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    streakDays: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    role: {
      type: String,
      enum: ['learner', 'curator'],
      default: 'learner'
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);