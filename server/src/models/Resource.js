import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['video', 'blog', 'quiz'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: String,
    stepId: String,
    uploadedBy: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Resource', resourceSchema);