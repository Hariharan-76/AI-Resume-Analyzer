import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const testAllModels = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found!');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const models = [
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-flash-lite-latest',
    'gemini-pro-latest',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-3-flash-preview',
    'gemini-3.1-flash-lite'
  ];

  console.log('Testing connectivity and quota for all available models...');
  
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say Hello');
      const text = result.response.text();
      console.log(`✅ SUCCESS: ${modelName} -> Response: "${text.trim()}"`);
    } catch (err) {
      console.log(`❌ FAILED: ${modelName} -> Error: ${err.message}`);
    }
  }
};

testAllModels();
