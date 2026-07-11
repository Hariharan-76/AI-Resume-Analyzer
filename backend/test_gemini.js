import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const testGemini = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY in .env file!');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash-lite'
  ];

  for (const modelName of modelsToTest) {
    console.log(`Testing model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say Hello');
      const text = result.response.text();
      console.log(`\nSUCCESS with ${modelName}! Response: "${text.trim()}"`);
      process.exit(0);
    } catch (err) {
      console.warn(`FAILED with ${modelName}:`, err.message);
    }
  }

  console.error('\nAll new models failed.');
  process.exit(1);
};

testGemini();
