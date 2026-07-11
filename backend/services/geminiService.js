import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Analyzes resume text using the Gemini API.
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
  
  // Use gemini-3.5-flash which is supported by the API key
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

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

  try {
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

    return { ...defaultData, ...parsedData };
  } catch (error) {
    console.error('Gemini Analysis API Error:', error);
    throw new Error('AI analysis failed: ' + error.message);
  }
};
