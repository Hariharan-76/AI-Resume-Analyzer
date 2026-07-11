import dns from 'dns';
import mongoose from 'mongoose';

// Configure Node to use Google's Public DNS resolvers to bypass local DNS lookup failures
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const uri = 'mongodb+srv://Hariharan:Hari_cool_7@ai-resume-analyser.2yybcua.mongodb.net/?appName=AI-Resume-Analyser';

console.log('Attempting connection to MongoDB Atlas with Google DNS resolvers...');
mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED: Connection error:', err.message);
    process.exit(1);
  });
