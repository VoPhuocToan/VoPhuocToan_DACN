import mongoose from 'mongoose';
import Promotion from '../models/Promotion.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare';

const testDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    console.log('Checking for existing promotions...');
    const count = await Promotion.countDocuments();
    console.log(`Found ${count} promotions.`);

    const testCode = 'TEST_PROMO_' + Date.now();
    console.log(`Attempting to create test promotion: ${testCode}`);

    const newPromo = await Promotion.create({
      code: testCode,
      description: 'Test Promotion',
      discountType: 'percentage',
      discountValue: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000),
      isActive: true
    });

    console.log('Successfully created promotion:', newPromo._id);

    console.log('Attempting to delete test promotion...');
    await Promotion.findByIdAndDelete(newPromo._id);
    console.log('Successfully deleted test promotion.');

    process.exit(0);
  } catch (error) {
    console.error('Database Test Failed:', error);
    process.exit(1);
  }
};

testDB();
