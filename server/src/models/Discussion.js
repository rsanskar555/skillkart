import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    replies: [replySchema]
  },
  { timestamps: true }
);

export default mongoose.model('Discussion', discussionSchema);