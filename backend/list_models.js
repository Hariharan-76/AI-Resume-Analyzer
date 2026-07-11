import dotenv from 'dotenv';

dotenv.config();

const listModels = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY in .env file!');
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  console.log('Fetching available models from Google API using native fetch...');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errText}`);
    }
    const data = await response.json();
    console.log('Available Models:');
    if (data.models && data.models.length > 0) {
      data.models.forEach((m) => {
        console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log('No models returned.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed to retrieve models list:', error.message);
    process.exit(1);
  }
};

listModels();
