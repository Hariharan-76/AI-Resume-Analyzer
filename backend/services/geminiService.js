import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Analyzes resume text using the Gemini API with automatic model fallback.
 * @param {string} resumeText - Raw text extracted from the PDF.
 * @returns {Promise<object>} - JSON object containing scores and details.
 */
export const analyzeResumeText = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  // Initialize Gemini SDK
  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
    Analyze the following resume text and provide a structured, professional assessment.
    
    You must evaluate:
    1. Overall resume score (based on formatting, readability, and content quality).
    2. ATS score (how well it passes applicant tracking systems, keyword density, layout scan-friendliness).
    3. Grammar and writing quality score.
    4. A concise professional summary.
    5. Strengths (at least 3 detailed points).
    6. Weaknesses or areas of concern (at least 3 detailed points).
    7. Professional skills found in the resume.
    8. Missing skills that would significantly enhance the candidate's profile based on their field.
    9. Suggested job roles suitable for this candidate.
    10. Clear, actionable improvements.
    11. Key industry-related keywords found or highly recommended for the resume.

    Return ONLY a valid JSON object matching this exact schema:
    {
      "resumeScore": number (value from 0 to 100),
      "atsScore": number (value from 0 to 100),
      "grammarScore": number (value from 0 to 100),
      "summary": "string description",
      "strengths": ["string", "string", ...],
      "weaknesses": ["string", "string", ...],
      "skillsFound": ["string", "string", ...],
      "missingSkills": ["string", "string", ...],
      "recommendedJobs": ["string", "string", ...],
      "improvements": ["string", "string", ...],
      "keywords": ["string", "string", ...]
    }

    Resume Text:
    ${resumeText}
  `;

  // Fallback models if primary is overloaded or busy
  const modelsToTry = [
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3-flash-preview'
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting Gemini analysis with model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text().trim();

      // Parse clean JSON output
      let parsedData;
      try {
        parsedData = JSON.parse(jsonText);
      } catch (parseError) {
        // Fallback clean-up if markdown block markers were returned in spite of responseMimeType
        const regex = /^\s*```(?:json)?([\s\S]+?)```\s*$/;
        const match = jsonText.match(regex);
        if (match) {
          parsedData = JSON.parse(match[1].trim());
        } else {
          throw new Error('Could not parse Gemini response as JSON: ' + jsonText);
        }
      }

      // Double-check keys exist to prevent frontend crash
      const defaultData = {
        resumeScore: 70,
        atsScore: 70,
        grammarScore: 70,
        summary: '',
        strengths: [],
        weaknesses: [],
        skillsFound: [],
        missingSkills: [],
        recommendedJobs: [],
        improvements: [],
        keywords: [],
      };

      console.log(`SUCCESS: Completed resume analysis using model: ${modelName}`);
      return { ...defaultData, ...parsedData };
    } catch (error) {
      console.warn(`WARNING: Model ${modelName} failed or unavailable:`, error.message);
      lastError = error;
      // Continue loop to try next model
    }
  }

  // If all models failed
  console.error('ERROR: All available Gemini models failed.');
  throw new Error('AI analysis failed (all models busy or unavailable): ' + lastError.message);
};
