import dns from 'dns';
import mongoose from 'mongoose';

// Configure Node.js to use Google DNS for resolving MongoDB SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
  console.log('DNS configuration initialized: using Google DNS resolvers.');
} catch (dnsErr) {
  console.warn('Warning: Failed to set custom DNS servers, using system default.', dnsErr.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
