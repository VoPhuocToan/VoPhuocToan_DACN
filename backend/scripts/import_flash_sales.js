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

const flashSales = [
  {
    code: 'FLASH_1212_0822',
    description: 'Flash Sale 12/12 (08:00 - 22:00)',
    discountType: 'percentage',
    discountValue: 22,
    startDate: new Date('2025-12-12T08:00:00'),
    endDate: new Date('2025-12-12T22:00:00'),
    isActive: true,
    usageLimit: 1000
  },
  {
    code: 'FLASH_1312_0822',
    description: 'Flash Sale 13/12 (08:00 - 22:00)',
    discountType: 'percentage',
    discountValue: 22,
    startDate: new Date('2025-12-13T08:00:00'),
    endDate: new Date('2025-12-13T22:00:00'),
    isActive: true,
    usageLimit: 1000
  },
  {
    code: 'FLASH_1312_1013',
    description: 'Flash Sale 13/12 (10:00 - 13:00)',
    discountType: 'percentage',
    discountValue: 30,
    startDate: new Date('2025-12-13T10:00:00'),
    endDate: new Date('2025-12-13T13:00:00'),
    isActive: true,
    usageLimit: 500
  },
  {
    code: 'FLASH_1312_1821',
    description: 'Flash Sale 13/12 (18:00 - 21:00)',
    discountType: 'percentage',
    discountValue: 25,
    startDate: new Date('2025-12-13T18:00:00'),
    endDate: new Date('2025-12-13T21:00:00'),
    isActive: true,
    usageLimit: 500
  },
  {
    code: 'FLASH_1412_0822',
    description: 'Flash Sale 14/12 (08:00 - 22:00)',
    discountType: 'percentage',
    discountValue: 20,
    startDate: new Date('2025-12-14T08:00:00'),
    endDate: new Date('2025-12-14T22:00:00'),
    isActive: true,
    usageLimit: 1000
  }
];

const importFlashSales = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const sale of flashSales) {
      // Check if exists
      const exists = await Promotion.findOne({ code: sale.code });
      if (exists) {
        console.log(`Skipping ${sale.code} - already exists`);
        continue;
      }

      await Promotion.create(sale);
      console.log(`Created ${sale.code}`);
    }

    console.log('Import completed');
    process.exit(0);
  } catch (error) {
    console.error('Error importing flash sales:', error);
    process.exit(1);
  }
};

importFlashSales();
