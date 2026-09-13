require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { MongoMemoryServer } = require('mongodb-memory-server');

const seedAdmin = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    if (!uri || uri.includes('127.0.0.1')) {
      try {
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB at ${uri}`);
      } catch (err) {
        console.log(`Failed to connect to ${uri}, falling back to In-Memory MongoDB...`);
      }
    }
    
    if (!mongoose.connection.readyState) {
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${uri}`);
    }
    
    const email = 'admin@careerai.com';
    const password = 'Password123';
    
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    await User.create({
      name: 'Admin User',
      email: email,
      password_hash: password_hash,
      role: 'admin'
    });
    
    console.log('Admin user seeded successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
