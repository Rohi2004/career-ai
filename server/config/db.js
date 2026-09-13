const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (uri) {
      try {
        await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      } catch (err) {
        console.log(`Failed to connect to ${uri}, falling back to In-Memory MongoDB...`);
        // Fall through to memory server
      }
    }

    // Use memory server if no URI or connection failed
    if (!mongoose.connection.readyState) {
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${uri}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }

  // Seed admin user for testing
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const existingAdmin = await User.findOne({ email: 'admin@careerai.com' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('Password123', salt);
      await User.create({
        name: 'Admin User',
        email: 'admin@careerai.com',
        password_hash: password_hash,
        role: 'admin'
      });
      console.log('Seeded test admin: admin@careerai.com / Password123');
    }
  } catch (err) {
    console.error('Failed to seed admin', err);
  }
};

module.exports = connectDB;
