import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import User from '../models/User.js'
// connectDB helper removed; use mongoose.connect directly here

// Load env variables
dotenv.config()

// Sample products data
const products = [
  {
    name: 'Viên uống bổ sung Vitamin D3 + K2',
    brand: 'Nature\'s Way',
    price: 350000,
    originalPrice: 420000,
    images: ['https://via.placeholder.com/300x300?text=Vitamin+D3+K2'],
    category: 'Vitamin & Khoáng chất',
    description: 'Viên uống bổ sung Vitamin D3 và K2 giúp hỗ trợ hấp thu canxi, tăng cường sức khỏe xương và răng. Sản phẩm phù hợp cho người thiếu hụt Vitamin D, người cao tuổi, trẻ em đang trong giai đoạn phát triển.',
    ingredients: 'Vitamin D3 (Cholecalciferol), Vitamin K2 (MK-7), Dầu hướng dương, Gelatin, Glycerin',
    usage: 'Uống 1 viên/ngày, tốt nhất sau bữa ăn hoặc theo chỉ dẫn của bác sĩ',
    note: 'Không dùng cho người dị ứng với bất kỳ thành phần nào của sản phẩm',
    rating: 4.5,
    numReviews: 128,
    stock: 100,
    inStock: true
  },
  {
    name: 'Omega-3 Fish Oil 1000mg',
    brand: 'Swisse',
    price: 580000,
    originalPrice: 650000,
    images: ['https://via.placeholder.com/300x300?text=Omega-3'],
    category: 'Sức khỏe tim mạch',
    description: 'Omega-3 Fish Oil với hàm lượng EPA và DHA cao, hỗ trợ sức khỏe tim mạch, não bộ và mắt. Sản phẩm được chiết xuất từ cá biển sạch, không mùi tanh.',
    ingredients: 'Dầu cá (EPA 300mg, DHA 200mg), Vitamin E, Gelatin',
    usage: 'Uống 1-2 viên/ngày, sau bữa ăn',
    note: 'Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp',
    rating: 4.7,
    numReviews: 256,
    stock: 150,
    inStock: true
  },
  {
    name: 'Probiotics 10 tỷ CFU',
    brand: 'Now Foods',
    price: 450000,
    originalPrice: 520000,
    images: ['https://via.placeholder.com/300x300?text=Probiotics'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Men vi sinh chứa 10 tỷ CFU với 10 chủng lợi khuẩn, hỗ trợ cân bằng hệ vi sinh đường ruột, cải thiện tiêu hóa và tăng cường miễn dịch.',
    ingredients: 'Lactobacillus acidophilus, Bifidobacterium lactis, Inulin, Cellulose',
    usage: 'Uống 1 viên/ngày, tốt nhất vào buổi sáng khi bụng đói',
    note: 'Nên uống với nước lạnh, tránh nước nóng',
    rating: 4.6,
    numReviews: 189,
    stock: 200,
    inStock: true
  },
  {
    name: 'Collagen Peptide Type 1 & 3',
    brand: 'Neocell',
    price: 680000,
    originalPrice: 750000,
    images: ['https://via.placeholder.com/300x300?text=Collagen'],
    category: 'Hỗ trợ làm đẹp',
    description: 'Collagen Peptide dạng bột, dễ hấp thu, hỗ trợ làm đẹp da, tóc, móng và khớp. Không mùi, dễ uống, hòa tan trong nước lạnh hoặc nước ấm.',
    ingredients: 'Collagen Peptide (Type 1 & 3), Vitamin C, Hương liệu tự nhiên',
    usage: 'Hòa tan 1-2 muỗng (10-20g) trong 250ml nước, uống 1 lần/ngày',
    note: 'Có thể uống trước khi ngủ hoặc buổi sáng',
    rating: 4.8,
    numReviews: 342,
    stock: 80,
    inStock: true
  },
  {
    name: 'Ginkgo Biloba 120mg',
    brand: 'Nature Made',
    price: 320000,
    originalPrice: 380000,
    images: ['https://via.placeholder.com/300x300?text=Ginkgo'],
    category: 'Thần kinh não',
    description: 'Bổ não Ginkgo Biloba giúp cải thiện tuần hoàn máu não, tăng cường trí nhớ và khả năng tập trung. Phù hợp cho người làm việc trí óc nhiều, học sinh, sinh viên.',
    ingredients: 'Chiết xuất Ginkgo Biloba (120mg), Cellulose, Magnesium stearate',
    usage: 'Uống 1 viên, 2 lần/ngày, sau bữa ăn',
    note: 'Không dùng cho phụ nữ có thai và cho con bú',
    rating: 4.4,
    numReviews: 167,
    stock: 120,
    inStock: true
  },
  {
    name: 'Glucosamine + Chondroitin + MSM',
    brand: 'Doctor\'s Best',
    price: 520000,
    originalPrice: 600000,
    images: ['https://via.placeholder.com/300x300?text=Glucosamine'],
    category: 'Cải thiện tăng cường chức năng',
    description: 'Viên uống hỗ trợ xương khớp với Glucosamine, Chondroitin và MSM, giúp bôi trơn khớp, giảm đau khớp và tăng cường sức khỏe sụn khớp.',
    ingredients: 'Glucosamine HCl (1500mg), Chondroitin Sulfate (1200mg), MSM (1000mg)',
    usage: 'Uống 2 viên/ngày, sau bữa ăn',
    note: 'Sử dụng đều đặn để có hiệu quả tốt nhất',
    rating: 4.5,
    numReviews: 203,
    stock: 90,
    inStock: true
  },
  {
    name: 'Milk Thistle 175mg',
    brand: 'Jarrow Formulas',
    price: 390000,
    originalPrice: 450000,
    images: ['https://via.placeholder.com/300x300?text=Milk+Thistle'],
    category: 'Hỗ trợ điều trị',
    description: 'Kế sữa (Milk Thistle) hỗ trợ giải độc gan, bảo vệ tế bào gan và hỗ trợ chức năng gan khỏe mạnh. Phù hợp cho người uống rượu bia nhiều, sử dụng thuốc tây lâu dài.',
    ingredients: 'Chiết xuất hạt Kế sữa (175mg), Silymarin (80%), Cellulose',
    usage: 'Uống 1 viên, 2 lần/ngày, sau bữa ăn',
    note: 'Nên uống đều đặn và kết hợp với chế độ ăn uống lành mạnh',
    rating: 4.6,
    numReviews: 145,
    stock: 110,
    inStock: true
  },
  {
    name: 'Vitamin C 1000mg với Rose Hips',
    brand: 'Solgar',
    price: 280000,
    originalPrice: 330000,
    images: ['https://via.placeholder.com/300x300?text=Vitamin+C'],
    category: 'Vitamin & Khoáng chất',
    description: 'Vitamin C 1000mg kết hợp với Rose Hips (tầm xuân), hỗ trợ tăng cường miễn dịch, chống oxy hóa và hỗ trợ làm đẹp da.',
    ingredients: 'Vitamin C (1000mg), Rose Hips, Cellulose, Citric acid',
    usage: 'Uống 1 viên/ngày, tốt nhất vào buổi sáng',
    note: 'Nên uống với nhiều nước',
    rating: 4.7,
    numReviews: 298,
    stock: 250,
    inStock: true
  }
]

// Categories data
const categories = [
  { name: 'Vitamin & Khoáng chất', description: 'Bổ sung vitamin và khoáng chất thiết yếu', icon: '💊' },
  { name: 'Sinh lý - Nội tiết tố', description: 'Hỗ trợ sinh lý và cân bằng nội tiết tố', icon: '⚕️' },
  { name: 'Cải thiện tăng cường chức năng', description: 'Tăng cường và cải thiện các chức năng cơ thể', icon: '⚡' },
  { name: 'Hỗ trợ điều trị', description: 'Hỗ trợ điều trị các vấn đề sức khỏe', icon: '🏥' },
  { name: 'Hỗ trợ tiêu hóa', description: 'Cải thiện hệ tiêu hóa và đường ruột', icon: '🌿' },
  { name: 'Thần kinh não', description: 'Hỗ trợ sức khỏe thần kinh và não bộ', icon: '🧠' },
  { name: 'Hỗ trợ làm đẹp', description: 'Hỗ trợ làm đẹp da, tóc, móng', icon: '✨' },
  { name: 'Sức khỏe tim mạch', description: 'Hỗ trợ sức khỏe tim mạch', icon: '❤️' }
]

// Admin user data
const adminUser = {
  name: 'Admin HealthyCare',
  email: 'admin@healthycare.com',
  password: '123456',
  phone: '0123456789',
  address: 'HealthyCare Headquarters',
  role: 'admin',
  isActive: true
}

const seedData = async () => {
  try {
    // Connect to database using MONGODB_URI from .env
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthycare'

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`)
    console.log(`📊 Database: ${mongoose.connection.name}`)

    // Clear existing data - drop collections completely
    try {
      await Product.collection.drop()
      await Category.collection.drop()
      await User.collection.drop()
    } catch (err) {
      // Collections don't exist yet, that's fine
    }
    console.log('✅ Đã xóa dữ liệu cũ')

    // Insert categories
    const createdCategories = await Category.insertMany(categories)
    console.log(`✅ Đã thêm ${createdCategories.length} danh mục`)

    // Insert products
    const createdProducts = await Product.insertMany(products)
    console.log(`✅ Đã thêm ${createdProducts.length} sản phẩm`)

    // Create admin user
    const createdAdmin = await User.create(adminUser)
    console.log(`✅ Đã tạo admin user: ${createdAdmin.email}`)

    console.log('✅ Seed data thành công!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error)
    process.exit(1)
  }
}

seedData()

