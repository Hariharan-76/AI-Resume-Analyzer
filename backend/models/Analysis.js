import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      unique: true, // One analysis per resume
    },
    resumeScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grammarScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    summary: {
      type: String,
      required: true,
    },
    strengths: {
      type: [String],
      required: true,
      default: [],
    },
    weaknesses: {
      type: [String],
      required: true,
      default: [],
    },
    skillsFound: {
      type: [String],
      required: true,
      default: [],
    },
    missingSkills: {
      type: [String],
      required: true,
      default: [],
    },
    recommendedJobs: {
      type: [String],
      required: true,
      default: [],
    },
    improvements: {
      type: [String],
      required: true,
      default: [],
    },
    keywords: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
