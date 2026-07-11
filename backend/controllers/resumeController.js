import fs from 'fs';
import { extractTextFromPDF } from '../services/pdfService.js';
import { analyzeResumeText } from '../services/geminiService.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';

/**
 * @desc    Upload PDF and extract text
 * @route   POST /api/resume/upload
 * @access  Private
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF file');
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    let extractedText = '';
    try {
      extractedText = await extractTextFromPDF(filePath);
    } catch (err) {
      // Clean up uploaded file in case of error
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      res.status(400);
      throw new Error('Failed to parse PDF file. Ensure it is not corrupted. Detail: ' + err.message);
    }

    // Clean up uploaded file after successful extraction
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      fileName,
      extractedText,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze extracted text using Gemini & Save to Database
 * @route   POST /api/resume/analyze
 * @access  Private
 */
export const analyzeResume = async (req, res, next) => {
  const { fileName, extractedText } = req.body;

  try {
    if (!fileName || !extractedText) {
      res.status(400);
      throw new Error('fileName and extractedText are required');
    }

    // 1. Call Gemini Service
    const analysisData = await analyzeResumeText(extractedText);

    // 2. Save Resume to DB
    const resume = await Resume.create({
      userId: req.user._id,
      fileName,
      extractedText,
    });

    // 3. Save Analysis to DB linked to Resume
    const analysis = await Analysis.create({
      resumeId: resume._id,
      ...analysisData,
    });

    res.status(201).json({
      success: true,
      resume,
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's resume analysis history
 * @route   GET /api/resume/history
 * @access  Private
 */
export const getHistory = async (req, res, next) => {
  try {
    // Find all resumes uploaded by user
    const resumes = await Resume.find({ userId: req.user._id });
    const resumeIds = resumes.map((r) => r._id);

    // Find analyses for those resumes
    const analyses = await Analysis.find({ resumeId: { $in: resumeIds } })
      .populate('resumeId', 'fileName uploadDate')
      .sort({ createdAt: -1 });

    // Calculate quick stats for user dashboard
    let averageResumeScore = 0;
    let averageAtsScore = 0;
    let averageGrammarScore = 0;

    if (analyses.length > 0) {
      const totals = analyses.reduce(
        (acc, curr) => {
          acc.resume += curr.resumeScore;
          acc.ats += curr.atsScore;
          acc.grammar += curr.grammarScore;
          return acc;
        },
        { resume: 0, ats: 0, grammar: 0 }
      );
      averageResumeScore = Math.round(totals.resume / analyses.length);
      averageAtsScore = Math.round(totals.ats / analyses.length);
      averageGrammarScore = Math.round(totals.grammar / analyses.length);
    }

    res.status(200).json({
      analyses,
      stats: {
        totalAnalyses: analyses.length,
        averageResumeScore,
        averageAtsScore,
        averageGrammarScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single analysis by ID
 * @route   GET /api/resume/:id
 * @access  Private
 */
export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate({
      path: 'resumeId',
      select: 'fileName userId uploadDate',
    });

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis not found');
    }

    // Verify ownership
    if (analysis.resumeId.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this analysis');
    }

    res.status(200).json(analysis);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete analysis and associated resume
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
export const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id).populate('resumeId');

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis not found');
    }

    // Verify ownership
    if (analysis.resumeId.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this analysis');
    }

    // Delete both analysis and resume from db
    const resumeId = analysis.resumeId._id;
    await Analysis.findByIdAndDelete(req.params.id);
    await Resume.findByIdAndDelete(resumeId);

    res.status(200).json({ success: true, message: 'Analysis and resume successfully deleted' });
  } catch (error) {
    next(error);
  }
};
