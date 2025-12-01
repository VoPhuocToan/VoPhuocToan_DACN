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
  // 1. Vitamin & Khoáng chất - Bổ sung canxi & vitamin D
  {
    name: 'Siro ống uống Canxi-D3-K2 5ml Kingphar bổ sung canxi & vitamin D3 cho cơ thể',
    brand: 'Kingphar',
    price: 165000,
    originalPrice: 195000,
    image: 'siro canxik2-d3_1.jpg',
    images: ['siro canxik2-d3_1.jpg', 'siro canxik2-d3_2.jpg', 'siro canxik2-d3_3.jpg', 'siro canxik2-d3_4.jpg', 'siro canxik2-d3_5.jpg'],
    category: 'Vitamin & Khoáng chất',
    description: 'Siro ống uống Canxi-D3-K2 Kingphar bổ sung canxi, vitamin D3 và K2, giúp tăng cường sức khỏe xương, răng, hỗ trợ phát triển chiều cao cho trẻ em và phòng ngừa loãng xương ở người lớn tuổi.',
    ingredients: 'Canxi (200mg), Vitamin D3 (400 IU), Vitamin K2 (45mcg), Xi-rô glucose, nước tinh khiết',
    usage: 'Trẻ em từ 1-3 tuổi: 1 ống/ngày. Trẻ em từ 4-10 tuổi: 1-2 ống/ngày. Người lớn: 2 ống/ngày, uống sau bữa ăn',
    note: 'Lắc đều trước khi uống. Bảo quản nơi khô ráo, tránh ánh sáng trực tiếp',
    rating: 4.6,
    numReviews: 234,
    stock: 150,
    inStock: true
  },
  
  // 2. Vitamin & Khoáng chất - Vitamin tổng hợp
  {
    name: 'Viên uống Immuvita Easylife bổ sung vitamin và khoáng chất cho cơ thể, tăng sức khỏe',
    brand: 'Easylife',
    price: 320000,
    originalPrice: 380000,
    image: 'Immuvita Easylife_1.jpg',
    images: ['Immuvita Easylife_1.jpg', 'Immuvita Easylife_2.jpg', 'Immuvita Easylife_3.jpg', 'Immuvita Easylife_4.jpg', 'Immuvita Easylife_5.jpg', 'Immuvita Easylife_6.jpg'],
    category: 'Vitamin & Khoáng chất',
    description: 'Immuvita Easylife cung cấp đầy đủ vitamin và khoáng chất thiết yếu, hỗ trợ tăng cường hệ miễn dịch, cải thiện sức khỏe tổng thể, giảm mệt mỏi và stress.',
    ingredients: 'Vitamin A, C, E, D3, B1, B2, B6, B12, Acid folic, Kẽm, Selen, Magie, Canxi',
    usage: 'Uống 1 viên/ngày, sau bữa ăn sáng với nhiều nước',
    note: 'Không dùng cho người đang dùng thuốc chống đông máu. Tham khảo ý kiến bác sĩ nếu đang mang thai hoặc cho con bú',
    rating: 4.5,
    numReviews: 189,
    stock: 200,
    inStock: true
  },
  
  {
    name: 'Viên uống C 500mg Nature\'s Bounty bổ sung vitamin C, tăng cường sức đề kháng',
    brand: 'Nature\'s Bounty',
    price: 280000,
    originalPrice: 330000,
    image: 'VU_C 500mg Nature\'s Bounty_1.jpg',
    images: ['VU_C 500mg Nature\'s Bounty_1.jpg', 'VU_C 500mg Nature\'s Bounty_2.jpg', 'VU_C 500mg Nature\'s Bounty_3.jpg', 'VU_C 500mg Nature\'s Bounty_4.jpg'],
    category: 'Vitamin & Khoáng chất',
    description: 'Vitamin C 500mg Nature\'s Bounty hỗ trợ tăng cường hệ miễn dịch, chống oxy hóa, làm đẹp da và hỗ trợ cơ thể chống lại các tác nhân gây bệnh.',
    ingredients: 'Vitamin C (500mg dưới dạng Acid Ascorbic), Cellulose vi tinh thể, Silica',
    usage: 'Uống 1 viên/ngày, tốt nhất vào buổi sáng sau bữa ăn',
    note: 'Uống với nhiều nước. Không dùng quá liều khuyến cáo',
    rating: 4.7,
    numReviews: 312,
    stock: 250,
    inStock: true
  },
  
  {
    name: 'Viên uống DHC Vitamin C Hard bổ sung vitamin C, vitamin B2 cho cơ thể',
    brand: 'DHC',
    price: 195000,
    originalPrice: 245000,
    image: 'VU_DHC Vitamin C_1.jpg',
    images: ['VU_DHC Vitamin C_1.jpg', 'VU_DHC Vitamin C_2.jpg', 'VU_DHC Vitamin C_3.jpg', 'VU_DHC Vitamin C_4.jpg'],
    category: 'Vitamin & Khoáng chất',
    description: 'DHC Vitamin C Hard bổ sung vitamin C liều cao kết hợp vitamin B2, hỗ trợ làm đẹp da, chống lão hóa, tăng cường miễn dịch.',
    ingredients: 'Vitamin C (500mg), Vitamin B2 (2mg), Cellulose, Stearic acid',
    usage: 'Uống 2 viên/ngày, chia làm 2 lần (sáng và chiều) sau bữa ăn',
    note: 'Sản phẩm của Nhật Bản. Bảo quản nơi khô ráo, tránh ánh nắng mặt trời',
    rating: 4.6,
    numReviews: 178,
    stock: 180,
    inStock: true
  },
  
  {
    name: 'Viên uống Vitamin E 400IU Nature\'s Bounty hỗ trợ chống oxy hóa, làm chậm quá trình lão hóa da',
    brand: 'Nature\'s Bounty',
    price: 420000,
    originalPrice: 490000,
    image: 'VU_Vitamin E 400IU_1.jpg',
    images: ['VU_Vitamin E 400IU_1.jpg', 'VU_Vitamin E 400IU_2.jpg', 'VU_Vitamin E 400IU_3.jpg', 'VU_Vitamin E 400IU_4.jpg', 'VU_Vitamin E 400IU_5.jpg', 'VU_Vitamin E 400IU_6.jpg'],
    category: 'Vitamin & Khoáng chất',
    description: 'Vitamin E 400IU Nature\'s Bounty là chất chống oxy hóa mạnh mẽ, giúp bảo vệ tế bào khỏi gốc tự do, làm đẹp da, chống lão hóa và hỗ trợ sức khỏe tim mạch.',
    ingredients: 'Vitamin E 400 IU (d-Alpha Tocopherol), Dầu đậu nành, Gelatin, Glycerin',
    usage: 'Uống 1 viên mềm/ngày, sau bữa ăn',
    note: 'Không dùng cho người đang dùng thuốc chống đông máu',
    rating: 4.8,
    numReviews: 267,
    stock: 120,
    inStock: true
  },
  
  // 3. Vitamin & Khoáng chất - Dầu cá, Omega
  {
    name: 'Viên nang mềm NatureCare Omega 369 bổ sung Omega, giảm nguy cơ xơ vữa động mạch',
    brand: 'NatureCare',
    price: 385000,
    originalPrice: 450000,
    image: 'VU_NatureCare Omega 369_1.jpg',
    images: ['VU_NatureCare Omega 369_1.jpg', 'VU_NatureCare Omega 369_2.jpg', 'VU_NatureCare Omega 369_3.jpg', 'VU_NatureCare Omega 369_4.jpg', 'VU_NatureCare Omega 369_5.jpg'],
    category: 'Vitamin & Khoáng chất',
    description: 'NatureCare Omega 369 kết hợp 3 loại Omega thiết yếu (3, 6, 9), hỗ trợ sức khỏe tim mạch, giảm cholesterol xấu, tăng trí nhớ và bảo vệ thị lực.',
    ingredients: 'Omega 3 (EPA & DHA từ dầu cá), Omega 6 (từ dầu hoa anh thảo), Omega 9 (từ dầu Oliu), Vitamin E',
    usage: 'Uống 2 viên/ngày, sau bữa ăn chính',
    note: 'Người dị ứng hải sản cần thận trọng. Bảo quản nơi khô mát',
    rating: 4.5,
    numReviews: 198,
    stock: 160,
    inStock: true
  },
  
  // 4. Sinh lý - Nội tiết tố - Sinh lý Nam
  {
    name: 'Viên uống Sâm Nhung Bổ Thận NV Dolexpharm hỗ trợ tráng dương, tăng cường sinh lực',
    brand: 'Dolexpharm',
    price: 295000,
    originalPrice: 350000,
    image: 'VU_Sâm Nhung Bổ Thận_1.jpg',
    images: ['VU_Sâm Nhung Bổ Thận_1.jpg', 'VU_Sâm Nhung Bổ Thận_2.jpg', 'VU_Sâm Nhung Bổ Thận_3.jpg', 'VU_Sâm Nhung Bổ Thận_4.jpg', 'VU_Sâm Nhung Bổ Thận_5.jpg'],
    category: 'Sinh lý - Nội tiết tố',
    description: 'Sâm Nhung Bổ Thận NV kết hợp nhung hươu, nhân sâm và các dược liệu quý, hỗ trợ bổ thận tráng dương, tăng cường sinh lực và cải thiện chức năng sinh lý nam giới.',
    ingredients: 'Nhung hươu, Nhân sâm, Thục địa, Ba kích, Hà thủ ô, Đỗ trọng, Dương khởi thạch',
    usage: 'Uống 2 viên/ngày, sáng và tối trước bữa ăn 30 phút',
    note: 'Không dùng cho người cao huyết áp, người dị ứng với thành phần sản phẩm',
    rating: 4.4,
    numReviews: 156,
    stock: 140,
    inStock: true
  },
  
  {
    name: 'Viên uống Maca M Male Power hỗ trợ bổ thận, tráng dương',
    brand: 'Male Power',
    price: 450000,
    originalPrice: 520000,
    image: 'VU_Maca M Male Power_1.jpg',
    images: ['VU_Maca M Male Power_1.jpg', 'VU_Maca M Male Power_2.jpg', 'VU_Maca M Male Power_3.jpg', 'VU_Maca M Male Power_4.jpg', 'VU_Maca M Male Power_5.jpg'],
    category: 'Sinh lý - Nội tiết tố',
    description: 'Maca M Male Power chiết xuất từ rễ Maca Peru, kết hợp L-Arginine và kẽm, hỗ trợ tăng cường sinh lý nam, cải thiện chất lượng tinh trùng và sức bền.',
    ingredients: 'Chiết xuất Maca Peru (500mg), L-Arginine (200mg), Kẽm (15mg), Vitamin E, Sâm Hàn Quốc',
    usage: 'Uống 2 viên/ngày, sáng và tối sau bữa ăn',
    note: 'Dùng liên tục 2-3 tháng để đạt hiệu quả tốt nhất',
    rating: 4.6,
    numReviews: 201,
    stock: 130,
    inStock: true
  },
  
  // 5. Sinh lý - Nội tiết tố - Sinh lý Nữ
  {
    name: 'Viên uống Tố Nữ Vương Royal Care hỗ trợ cải thiện nội tiết tố nữ',
    brand: 'Royal Care',
    price: 285000,
    originalPrice: 340000,
    image: 'VU_Tố Nữ Vương Royal Care_1.jpg',
    images: ['VU_Tố Nữ Vương Royal Care_1.jpg', 'VU_Tố Nữ Vương Royal Care_2.jpg', 'VU_Tố Nữ Vương Royal Care_3.jpg', 'VU_Tố Nữ Vương Royal Care_4.jpg', 'VU_Tố Nữ Vương Royal Care_5.jpg'],
    category: 'Sinh lý - Nội tiết tố',
    description: 'Tố Nữ Vương Royal Care hỗ trợ cân bằng nội tiết tố nữ, cải thiện sinh lý phụ nữ, giảm triệu chứng tiền mãn kinh và mãn kinh, làm đẹp da.',
    ingredients: 'Đương quy, Thục địa, Bạch thược, Xuyên khung, Mộc hương, Đỗ trọng, Cam thảo',
    usage: 'Uống 2 viên/lần x 2 lần/ngày (sáng và tối) sau bữa ăn',
    note: 'Không dùng cho phụ nữ có thai. Dùng liên tục trong 2-3 tháng',
    rating: 4.5,
    numReviews: 187,
    stock: 170,
    inStock: true
  },
  
  {
    name: 'Viên uống Maca F Female hỗ trợ tăng cường nội tiết tố nữ, tăng khả năng sinh lý',
    brand: 'Maca F',
    price: 420000,
    originalPrice: 480000,
    image: 'VU_Maca F Female_1.jpg',
    images: ['VU_Maca F Female_1.jpg', 'VU_Maca F Female_2.jpg', 'VU_Maca F Female_3.jpg', 'VU_Maca F Female_4.jpg', 'VU_Maca F Female_5.jpg', 'VU_Maca F Female_6.jpg'],
    category: 'Sinh lý - Nội tiết tố',
    description: 'Maca F Female với chiết xuất Maca đỏ dành riêng cho nữ giới, hỗ trợ cân bằng hormone, tăng cường sinh lý, cải thiện tâm trạng và giảm stress.',
    ingredients: 'Chiết xuất Maca đỏ (500mg), Sâm Hàn Quốc, Đậu nành (Isoflavone), Vitamin B6, Axit Folic',
    usage: 'Uống 2 viên/ngày, sau bữa ăn sáng và tối',
    note: 'Sản phẩm dành cho phụ nữ từ 18 tuổi trở lên',
    rating: 4.7,
    numReviews: 223,
    stock: 145,
    inStock: true
  },
  
  // 6. Sinh lý - Nội tiết tố - Sức khỏe tình dục
  {
    name: 'Viên uống Best King Jpanwell hỗ trợ tăng cường sinh lý và khả năng sinh sản ở nam giới',
    brand: 'Jpanwell',
    price: 680000,
    originalPrice: 780000,
    image: 'VU_Best King Jpanwell_1.jpg',
    images: ['VU_Best King Jpanwell_1.jpg', 'VU_Best King Jpanwell_2.jpg', 'VU_Best King Jpanwell_3.jpg', 'VU_Best King Jpanwell_4.jpg', 'VU_Best King Jpanwell_5.jpg'],
    category: 'Sinh lý - Nội tiết tố',
    description: 'Best King Jpanwell kết hợp thảo dược quý và công nghệ Nhật Bản, hỗ trợ toàn diện sức khỏe sinh lý nam giới, tăng cường sinh lực và cải thiện chất lượng tinh trùng.',
    ingredients: 'Nhung hươu, Đông trùng hạ thảo, Maca, Hàu biển, Kẽm, L-Arginine, Vitamin E',
    usage: 'Uống 2 viên/ngày, sau bữa ăn sáng và tối',
    note: 'Dùng liên tục 2-3 tháng để đạt hiệu quả tối ưu',
    rating: 4.8,
    numReviews: 289,
    stock: 95,
    inStock: true
  },
  
  // 7. Sinh lý - Nội tiết tố - Cân bằng nội tiết tố
  {
    name: 'Viên nang cứng Vương Nữ Khang Royal Care hỗ trợ hạn chế sự phát triển u xơ tử cung, u vú lành tính',
    brand: 'Royal Care',
    price: 395000,
    originalPrice: 460000,
    image: 'VU_Vương Nữ Khang Royal_1.jpg',
    images: ['VU_Vương Nữ Khang Royal_1.jpg', 'VU_Vương Nữ Khang Royal_2.jpg', 'VU_Vương Nữ Khang Royal_3.jpg', 'VU_Vương Nữ Khang Royal_4.jpg', 'VU_Vương Nữ Khang Royal_5.jpg', 'VU_Vương Nữ Khang Royal_6.jpg'],
    category: 'Sinh lý - Nội tiết tố',
    description: 'Vương Nữ Khang hỗ trợ điều hòa nội tiết tố nữ, giảm nguy cơ phát triển u xơ tử cung, u vú lành tính, cải thiện chu kỳ kinh nguyệt và giảm đau bụng kinh.',
    ingredients: 'Hà thủ ô, Đương quy, Xuyên khung, Bạch thược, Ích mẫu, Mộc hương, Hương phụ',
    usage: 'Uống 2 viên x 2 lần/ngày (sáng và tối) sau bữa ăn',
    note: 'Không dùng cho phụ nữ có thai và cho con bú. Dùng liên tục 3-6 tháng',
    rating: 4.6,
    numReviews: 167,
    stock: 110,
    inStock: true
  },
  
  {
    name: 'Viên uống Bảo Xuân Tuổi 50+ Nam Dược bổ sung và hỗ trợ cân bằng nội tiết tố nữ Estrogen',
    brand: 'Nam Dược',
    price: 185000,
    originalPrice: 225000,
    image: 'VU_ BaoXuan_1.jpg',
    images: ['VU_ BaoXuan_1.jpg', 'VU_ BaoXuan_2.jpg', 'VU_ BaoXuan_3.jpg', 'VU_ BaoXuan_4.jpg', 'VU_ BaoXuan_5.jpg', 'VU_ BaoXuan_6.jpg', 'VU_ BaoXuan_7.jpg'],
    category: 'Sinh lý - Nội tiết tố',
    description: 'Bảo Xuân Tuổi 50+ dành riêng cho phụ nữ tiền mãn kinh và mãn kinh, hỗ trợ bổ sung Estrogen tự nhiên, giảm bốc hỏa, đổ mồ hôi đêm, cải thiện giấc ngủ.',
    ingredients: 'Đậu nành (Isoflavone), Hắc đậu, Hà thủ ô đỏ, Đương quy, Cam thảo, Vitamin E, Canxi',
    usage: 'Uống 2 viên/lần x 2 lần/ngày sau bữa ăn',
    note: 'Sản phẩm dành cho phụ nữ từ 45 tuổi trở lên',
    rating: 4.5,
    numReviews: 145,
    stock: 200,
    inStock: true
  },
  
  // 8. Cải thiện tăng cường chức năng - Chức năng gan
  {
    name: 'Viên uống Dr. Liver Jpanwell bổ gan, tăng cường giải độc gan',
    brand: 'Jpanwell',
    price: 520000,
    originalPrice: 600000,
    image: 'VU_Dr. Liver Jpanwell_1.jpg',
    images: ['VU_Dr. Liver Jpanwell_1.jpg', 'VU_Dr. Liver Jpanwell_2.png', 'VU_Dr. Liver Jpanwell_3.jpg', 'VU_Dr. Liver Jpanwell_4.jpg', 'VU_Dr. Liver Jpanwell_6.jpg'],
    category: 'Cải thiện tăng cường chức năng',
    description: 'Dr. Liver Jpanwell với chiết xuất từ kế sữa, atiso và nghệ, hỗ trợ bảo vệ tế bào gan, tăng cường chức năng giải độc gan, phù hợp cho người thường xuyên uống rượu bia.',
    ingredients: 'Chiết xuất Kế sữa (Silymarin 140mg), Atiso (100mg), Nghệ (50mg), Vitamin B1, B2, B6',
    usage: 'Uống 1 viên x 2 lần/ngày, sau bữa ăn sáng và tối',
    note: 'Nên dùng liên tục 2-3 tháng và kết hợp chế độ ăn uống lành mạnh',
    rating: 4.7,
    numReviews: 234,
    stock: 125,
    inStock: true
  },
  
  {
    name: 'Viên uống Milk Thistle Pharma World hỗ trợ chống oxy hóa, giải độc gan',
    brand: 'Pharma World',
    price: 385000,
    originalPrice: 450000,
    image: 'VU_Milk Thistle Pharma World_1.jpg',
    images: ['VU_Milk Thistle Pharma World_1.jpg', 'VU_Milk Thistle Pharma World_2.jpg', 'VU_Milk Thistle Pharma World_3.jpg', 'VU_Milk Thistle Pharma World_4.jpg', 'VU_Milk Thistle Pharma World_5.jpg'],
    category: 'Cải thiện tăng cường chức năng',
    description: 'Milk Thistle (Kế sữa) Pharma World chiết xuất chuẩn hóa 80% Silymarin, hỗ trợ tái tạo tế bào gan, bảo vệ gan khỏi độc tố và chống oxy hóa mạnh mẽ.',
    ingredients: 'Chiết xuất Kế sữa chuẩn hóa 80% Silymarin (175mg), Vitamin E (30 IU)',
    usage: 'Uống 1 viên x 2 lần/ngày, trước bữa ăn 30 phút',
    note: 'Uống nhiều nước trong ngày. Tránh dùng cho phụ nữ có thai',
    rating: 4.6,
    numReviews: 198,
    stock: 150,
    inStock: true
  },
  
  // 9. Cải thiện tăng cường chức năng - Bổ mắt, bảo vệ mắt
  {
    name: 'Viên Sáng Mắt Hải Thượng Vương hỗ trợ tăng cường thị lực',
    brand: 'Hải Thượng Vương',
    price: 245000,
    originalPrice: 295000,
    image: 'VU_Sáng Mắt Hải Thượng Vương_1.jpg',
    images: ['VU_Sáng Mắt Hải Thượng Vương_1.jpg', 'VU_Sáng Mắt Hải Thượng Vương_2.jpg', 'VU_Sáng Mắt Hải Thượng Vương_3.jpg', 'VU_Sáng Mắt Hải Thượng Vương_4.jpg', 'VU_Sáng Mắt Hải Thượng Vương_5.jpg'],
    category: 'Cải thiện tăng cường chức năng',
    description: 'Sáng Mắt Hải Thượng Vương kết hợp thảo dược truyền thống với dưỡng chất hiện đại, hỗ trợ cải thiện thị lực, giảm mỏi mắt, khô mắt cho người dùng máy tính nhiều.',
    ingredients: 'Quyết minh tử, Cúc hoa, Gấc, Việt quất, Lutein (10mg), Zeaxanthin (2mg), Vitamin A',
    usage: 'Uống 2 viên/lần x 2 lần/ngày, sau bữa ăn',
    note: 'Kết hợp nghỉ ngơi mắt thường xuyên khi làm việc',
    rating: 4.4,
    numReviews: 156,
    stock: 180,
    inStock: true
  },
  
  {
    name: 'Viên uống Visionace Original Vitabiotics bổ sung vitamin, khoáng chất, lutein, hỗ trợ cải thiện thị lực',
    brand: 'Vitabiotics',
    price: 385000,
    originalPrice: 450000,
    image: 'VU_Visionace Original Vitabiotics_1.jpg',
    images: ['VU_Visionace Original Vitabiotics_1.jpg', 'VU_Visionace Original Vitabiotics_2.jpg', 'VU_Visionace Original Vitabiotics_3.jpg', 'VU_Visionace Original Vitabiotics_4.jpg', 'VU_Visionace Original Vitabiotics_5.jpg', 'VU_Visionace Original Vitabiotics_6.jpg'],
    category: 'Cải thiện tăng cường chức năng',
    description: 'Visionace Original từ Anh Quốc, công thức đặc biệt với Lutein, Zeaxanthin, Vitamin A, C, E và kẽm, hỗ trợ toàn diện sức khỏe mắt và thị lực.',
    ingredients: 'Lutein (10mg), Zeaxanthin (2mg), Vitamin A, C, E, D, B12, Kẽm, Selen, Đồng',
    usage: 'Uống 1 viên/ngày sau bữa ăn chính với một ly nước',
    note: 'Sản phẩm nhập khẩu từ Anh. Không thay thế chế độ ăn cân đối',
    rating: 4.8,
    numReviews: 267,
    stock: 110,
    inStock: true
  },
  
  // 10. Hỗ trợ điều trị - Cơ xương khớp
  {
    name: 'Thực phẩm bảo vệ sức khỏe Calcium Premium JpanWell bổ sung canxi, giảm nguy cơ loãng xương',
    brand: 'JpanWell',
    price: 580000,
    originalPrice: 670000,
    image: 'VU_Calcium Premium JpanWell_1.jpg',
    images: ['VU_Calcium Premium JpanWell_1.jpg', 'VU_Calcium Premium JpanWell_2.jpg', 'VU_Calcium Premium JpanWell_3.jpg', 'VU_Calcium Premium JpanWell_4.jpg', 'VU_Calcium Premium JpanWell_5.jpg', 'VU_Calcium Premium JpanWell_6.jpg'],
    category: 'Hỗ trợ điều trị',
    description: 'Calcium Premium JpanWell bổ sung canxi hữu cơ dễ hấp thu, kết hợp vitamin D3, K2 và Magie, hỗ trợ xương chắc khỏe, phòng ngừa loãng xương hiệu quả.',
    ingredients: 'Canxi hữu cơ (600mg), Vitamin D3 (800 IU), Vitamin K2 (45mcg), Magie (100mg), Kẽm (10mg)',
    usage: 'Uống 2 viên/ngày, sau bữa ăn tối hoặc trước khi ngủ',
    note: 'Nên kết hợp tập thể dục và phơi nắng vừa phải',
    rating: 4.7,
    numReviews: 245,
    stock: 135,
    inStock: true
  },
  
  {
    name: 'Viên nang mềm Omexxel Arthri hỗ trợ tăng tiết dịch khớp, giảm đau do lão hóa khớp',
    brand: 'Omexxel',
    price: 495000,
    originalPrice: 580000,
    image: 'VU_Omexxel Arthri_1.jpg',
    images: ['VU_Omexxel Arthri_1.jpg', 'VU_Omexxel Arthri_2.jpg', 'VU_Omexxel Arthri_3.jpg', 'VU_Omexxel Arthri_4.jpg', 'VU_Omexxel Arthri_5.jpg', 'VU_Omexxel Arthri_6.jpg'],
    category: 'Hỗ trợ điều trị',
    description: 'Omexxel Arthri với Glucosamine, Chondroitin và MSM, hỗ trợ tái tạo sụn khớp, tăng tiết dịch khớp, giảm đau và viêm khớp do thoái hóa.',
    ingredients: 'Glucosamine Sulfate (750mg), Chondroitin Sulfate (600mg), MSM (500mg), Collagen Type II (40mg)',
    usage: 'Uống 2 viên/lần x 2 lần/ngày, sau bữa ăn sáng và tối',
    note: 'Dùng liên tục 3-6 tháng. Người dị ứng hải sản cần thận trọng',
    rating: 4.6,
    numReviews: 189,
    stock: 120,
    inStock: true
  },

  // 20. Hỗ trợ điều trị - Hô hấp, ho, xoang
  {
    name: 'Siro Ginkid Ho Cam hỗ trợ giảm ho, long đờm',
    brand: 'Ginkid',
    price: 85000,
    originalPrice: 95000,
    image: 'Siro Ginkid Ho Cam_1.jpg',
    images: ['Siro Ginkid Ho Cam_1.jpg', 'Siro Ginkid Ho Cam_2.jpg', 'Siro Ginkid Ho Cam_3.jpg', 'Siro Ginkid Ho Cam_4.jpg', 'Siro Ginkid Ho Cam_5.jpg'],
    category: 'Hỗ trợ điều trị',
    description: 'Siro Ginkid Ho Cam với chiết xuất thảo dược tự nhiên, hỗ trợ giảm ho, long đờm, làm dịu cổ họng, tăng cường sức đề kháng đường hô hấp.',
    ingredients: 'Cao lá Trầu không, Cao rễ Cà gai leo, Cao hoa Cúc hoa, Mật ong, Vitamin C',
    usage: 'Trẻ 1-5 tuổi: 5ml x 3 lần/ngày. Trẻ trên 5 tuổi và người lớn: 10ml x 3 lần/ngày',
    note: 'Lắc đều trước khi uống. Bảo quản nơi khô mát',
    rating: 4.5,
    numReviews: 167,
    stock: 200,
    inStock: true
  },

  {
    name: 'Xịt họng Xuyên Tâm Liên hỗ trợ kháng khuẩn, giảm viêm họng',
    brand: 'Xuyên Tâm Liên',
    price: 115000,
    originalPrice: 135000,
    image: 'Xịt họng Xuyên Tâm_1.jpg',
    images: ['Xịt họng Xuyên Tâm_1.jpg', 'Xịt họng Xuyên Tâm_2.jpg', 'Xịt họng Xuyên Tâm_3.jpg', 'Xịt họng Xuyên Tâm_4.jpg', 'Xịt họng Xuyên Tâm_5.jpg', 'Xịt họng Xuyên Tâm_6.jpg'],
    category: 'Hỗ trợ điều trị',
    description: 'Xịt họng Xuyên Tâm Liên với thành phần thảo dược, hỗ trợ kháng khuẩn, giảm viêm, đau họng, làm sạch khoang miệng.',
    ingredients: 'Cao Xuyên tâm liên, Bạc hà, Bồ công anh, Cam thảo, Nha đam',
    usage: 'Xịt 2-3 lần vào họng, 3-4 lần/ngày. Không ăn uống trong 15 phút sau khi xịt',
    note: 'Lắc đều trước khi xịt. Không sử dụng cho trẻ dưới 6 tuổi',
    rating: 4.4,
    numReviews: 145,
    stock: 180,
    inStock: true
  },

  // 21. Hỗ trợ điều trị - Hỗ trợ điều trị ung thư
  {
    name: 'CumarGold Kare CVI hỗ trợ điều trị ung thư, tăng miễn dịch',
    brand: 'CVI Pharma',
    price: 1250000,
    originalPrice: 1450000,
    image: 'VU_CumarGold Kare CVI_1.jpg',
    images: ['VU_CumarGold Kare CVI_1.jpg', 'VU_CumarGold Kare CVI_2.jpg', 'VU_CumarGold Kare CVI_3.jpg', 'VU_CumarGold Kare CVI_4.jpg', 'VU_CumarGold Kare CVI_5.jpg'],
    category: 'Hỗ trợ điều trị',
    description: 'CumarGold Kare với Curcumin nano, hỗ trợ điều trị ung thư, tăng cường hệ miễn dịch, giảm tác dụng phụ của hóa trị và xạ trị.',
    ingredients: 'Nano Curcumin (500mg), Beta Glucan (200mg), Vitamin E, Selen',
    usage: 'Uống 2 viên x 2 lần/ngày, trước bữa ăn sáng và tối 30 phút',
    note: 'Dùng theo chỉ định của bác sĩ. Sử dụng liên tục ít nhất 3-6 tháng',
    rating: 4.8,
    numReviews: 98,
    stock: 80,
    inStock: true
  },

  // 22. Hỗ trợ tiêu hóa - Dạ dày
  {
    name: 'Gasso Max hỗ trợ cải thiện chức năng dạ dày',
    brand: 'Gasso',
    price: 195000,
    originalPrice: 230000,
    image: 'VU_Gasso Max Vitamins_1.jpg',
    images: ['VU_Gasso Max Vitamins_1.jpg', 'VU_Gasso Max Vitamins_2.jpg', 'VU_Gasso Max Vitamins_3.jpg', 'VU_Gasso Max Vitamins_4.jpg', 'VU_Gasso Max Vitamins_5.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Gasso Max với thành phần thảo dược, hỗ trợ giảm triệu chứng viêm loét dạ dày, trào ngược dạ dày, ợ hơi, khó tiêu.',
    ingredients: 'Cao nghệ, Cao rau má, Cao mật nhân, Men tiêu hóa, Prebiotics',
    usage: 'Uống 2 viên x 2 lần/ngày, trước bữa ăn sáng và tối 30 phút',
    note: 'Nên dùng liên tục 1-2 tháng. Kết hợp chế độ ăn uống lành mạnh',
    rating: 4.5,
    numReviews: 234,
    stock: 150,
    inStock: true
  },

  {
    name: 'Dr.Sto Jpanwell hỗ trợ bảo vệ niêm mạc dạ dày',
    brand: 'Jpanwell',
    price: 285000,
    originalPrice: 325000,
    image: 'VU_Dr.Sto Jpanwell_1.jpg',
    images: ['VU_Dr.Sto Jpanwell_1.jpg', 'VU_Dr.Sto Jpanwell_3.jpg', 'VU_Dr.Sto Jpanwell_4.jpg', 'VU_Dr.Sto Jpanwell_5.jpg', 'VU_Dr.Sto Jpanwell_6.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Dr.Sto Jpanwell bảo vệ niêm mạc dạ dày, giảm acid dịch vị, hỗ trợ điều trị viêm loét dạ dày tá tràng, trào ngược.',
    ingredients: 'Cao nghệ vàng, Rau má, Tảo xoắn Spirulina, PPI thảo dược, Kẽm',
    usage: 'Uống 1-2 viên x 2 lần/ngày, trước bữa ăn 30 phút',
    note: 'Sử dụng liên tục 2-3 tháng để đạt hiệu quả tốt',
    rating: 4.6,
    numReviews: 201,
    stock: 140,
    inStock: true
  },

  // 23. Hỗ trợ tiêu hóa - Táo bón
  {
    name: 'Ginkid GINIC hỗ trợ giảm táo bón cho trẻ em',
    brand: 'Ginkid',
    price: 125000,
    originalPrice: 145000,
    image: 'Siro Ginkid GINIC_1.jpg',
    images: ['Siro Ginkid GINIC_1.jpg', 'Siro Ginkid GINIC_2.jpg', 'Siro Ginkid GINIC_3.jpg', 'Siro Ginkid GINIC_4.jpg', 'Siro Ginkid GINIC_5.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Ginkid GINIC với men vi sinh, chất xơ tự nhiên, hỗ trợ giảm táo bón, cải thiện tiêu hóa cho trẻ em một cách nhẹ nhàng.',
    ingredients: 'Men vi sinh Lactobacillus, Bifidobacterium, Chất xơ Inulin, FOS',
    usage: 'Trẻ 1-3 tuổi: 1 gói/ngày. Trẻ trên 3 tuổi: 1-2 gói/ngày',
    note: 'Pha với nước ấm hoặc sữa. Bảo quản nơi khô mát',
    rating: 4.7,
    numReviews: 312,
    stock: 220,
    inStock: true
  },

  {
    name: 'Bio-acimin hỗ trợ cải thiện táo bón, tiêu hóa',
    brand: 'Bio-acimin',
    price: 165000,
    originalPrice: 190000,
    image: 'Bio-acimin_1.jpg',
    images: ['Bio-acimin_1.jpg', 'Bio-acimin_2.jpg', 'Bio-acimin_3.jpg', 'Bio-acimin_4.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Bio-acimin kết hợp men vi sinh đa dạng và chất xơ, hỗ trợ cải thiện táo bón mãn tính, điều hòa nhu động ruột.',
    ingredients: '10 tỷ CFU men vi sinh (Lactobacillus, Bifidobacterium), Psyllium husk, Inulin',
    usage: 'Uống 1-2 viên/ngày, trước bữa ăn tối hoặc trước khi ngủ',
    note: 'Uống nhiều nước khi dùng sản phẩm. Hiệu quả sau 7-14 ngày',
    rating: 4.5,
    numReviews: 278,
    stock: 190,
    inStock: true
  },

  // 24. Hỗ trợ tiêu hóa - Khó tiêu
  {
    name: 'Soki Novo hỗ trợ tiêu hóa, giảm đầy hơi',
    brand: 'Novo',
    price: 145000,
    originalPrice: 170000,
    image: 'Soki Novo_1.jpg',
    images: ['Soki Novo_1.jpg', 'Soki Novo_2.jpg', 'Soki Novo_3.jpg', 'Soki Novo_4.jpg', 'Soki Novo_5.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Soki Novo với enzym tiêu hóa tự nhiên, hỗ trợ tiêu hóa thức ăn, giảm đầy hơi, khó tiêu, ợ chua.',
    ingredients: 'Enzym tiêu hóa (Amylase, Protease, Lipase), Gừng, Bạc hà, Cam thảo',
    usage: 'Uống 1-2 viên sau mỗi bữa ăn chính',
    note: 'Có thể uống trước bữa ăn nhiều dầu mỡ 15 phút',
    rating: 4.4,
    numReviews: 189,
    stock: 170,
    inStock: true
  },

  {
    name: 'Edoz DHG hỗ trợ cải thiện khó tiêu, đầy bụng',
    brand: 'DHG Pharma',
    price: 98000,
    originalPrice: 115000,
    image: 'Edoz DHG_1.jpg',
    images: ['Edoz DHG_1.jpg', 'Edoz DHG_2.jpg', 'Edoz DHG_3.jpg', 'Edoz DHG_4.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Edoz DHG với enzym Pancreatin, hỗ trợ tiêu hóa protein, tinh bột, chất béo, giảm khó tiêu, đầy bụng.',
    ingredients: 'Pancreatin 300mg (Amylase, Protease, Lipase), Simethicone',
    usage: 'Uống 1-2 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Không nhai, nuốt nguyên viên với nước',
    rating: 4.3,
    numReviews: 156,
    stock: 200,
    inStock: true
  },

  // 25. Hỗ trợ tiêu hóa - Đại tràng
  {
    name: 'Đại Tràng Tâm Bình hỗ trợ điều trị viêm đại tràng',
    brand: 'Tâm Bình',
    price: 185000,
    originalPrice: 215000,
    image: 'Đại Tràng Tâm Bình_1.jpg',
    images: ['Đại Tràng Tâm Bình_1.jpg', 'Đại Tràng Tâm Bình_2.jpg', 'Đại Tràng Tâm Bình_3.jpg', 'Đại Tràng Tâm Bình_4.jpg', 'Đại Tràng Tâm Bình_5.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Đại Tràng Tâm Bình với thành phần thảo dược, hỗ trợ điều trị viêm đại tràng, hội chứng ruột kích thích, đau bụng, rối loạn tiêu hóa.',
    ingredients: 'Hoàng liên, Hoàng cầm, Bạch truật, Địa du, Cam thảo',
    usage: 'Uống 2 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Dùng liên tục 1-2 tháng. Kết hợp chế độ ăn nhẹ, dễ tiêu',
    rating: 4.6,
    numReviews: 167,
    stock: 130,
    inStock: true
  },

  {
    name: 'Tràng Phục Linh hỗ trợ cải thiện chức năng đại tràng',
    brand: 'Phục Linh',
    price: 155000,
    originalPrice: 180000,
    image: 'Tràng Phục Linh_1.jpg',
    images: ['Tràng Phục Linh_1.jpg', 'Tràng Phục Linh_2.jpg', 'Tràng Phục Linh_3.jpg', 'Tràng Phục Linh_4.jpg', 'Tràng Phục Linh_5.jpg', 'Tràng Phục Linh_6.jpg'],
    category: 'Hỗ trợ tiêu hóa',
    description: 'Tràng Phục Linh giúp cải thiện chức năng đại tràng, giảm triệu chứng tiêu chảy, đau bụng, đi ngoài phân lỏng.',
    ingredients: 'Phục linh, Bạch truật, Trần bì, Mộc hương, Ích mẫu',
    usage: 'Uống 3 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Uống liên tục 2-4 tuần. Bảo quản nơi khô ráo',
    rating: 4.4,
    numReviews: 142,
    stock: 160,
    inStock: true
  },

  // 26. Thần kinh não - Bổ não
  {
    name: 'Omexxel Ginkgo hỗ trợ tuần hoàn não, cải thiện trí nhớ',
    brand: 'Omexxel',
    price: 385000,
    originalPrice: 450000,
    image: 'VU_Omexxel Ginkgo_1.jpg',
    images: ['VU_Omexxel Ginkgo_1.jpg', 'VU_Omexxel Ginkgo_2.jpg', 'VU_Omexxel Ginkgo_3.jpg', 'VU_Omexxel Ginkgo_4.jpg', 'VU_Omexxel Ginkgo_5.jpg'],
    category: 'Thần kinh não',
    description: 'Omexxel Ginkgo với chiết xuất Bạch quả chuẩn hóa EGb 761, hỗ trợ tuần hoàn não, tăng cường trí nhớ, giảm hoa mắt, chóng mặt.',
    ingredients: 'Ginkgo Biloba Extract EGb 761 (120mg), Vitamin B6, B12, Acid folic',
    usage: 'Uống 1 viên x 2 lần/ngày, sau bữa ăn sáng và tối',
    note: 'Dùng liên tục 2-3 tháng. Người đang dùng thuốc chống đông máu cần tham khảo bác sĩ',
    rating: 4.7,
    numReviews: 245,
    stock: 150,
    inStock: true
  },

  {
    name: 'Ích Trí Gold hỗ trợ bổ não, tăng cường trí nhớ',
    brand: 'Ích Trí',
    price: 295000,
    originalPrice: 340000,
    image: 'VU_Ich Tri Gold_1.jpg',
    images: ['VU_Ich Tri Gold_1.jpg', 'VU_Ich Tri Gold_2.jpg', 'VU_Ich Tri Gold_3.jpg', 'VU_Ich Tri Gold_4.jpg', 'VU_Ich Tri Gold_5.jpg'],
    category: 'Thần kinh não',
    description: 'Ích Trí Gold với DHA, EPA, Lecithin và thảo dược, hỗ trợ bổ não, tăng cường trí nhớ, giảm căng thẳng, mệt mỏi.',
    ingredients: 'DHA (200mg), Lecithin đậu nành, Bạch quả, Viễn chí, Vitamin E',
    usage: 'Uống 2 viên x 2 lần/ngày, sau bữa ăn',
    note: 'Phù hợp cho người học tập, làm việc trí óc, người cao tuổi',
    rating: 4.5,
    numReviews: 198,
    stock: 170,
    inStock: true
  },

  // 27. Thần kinh não - Tuần hoàn máu
  {
    name: 'Migrin Plus CVI hỗ trợ giảm đau đầu migraine',
    brand: 'CVI Pharma',
    price: 245000,
    originalPrice: 285000,
    image: 'VU_Migrin Plus CVI_1.jpg',
    images: ['VU_Migrin Plus CVI_1.jpg', 'VU_Migrin Plus CVI_2.jpg', 'VU_Migrin Plus CVI_3.jpg', 'VU_Migrin Plus CVI_4.jpg'],
    category: 'Thần kinh não',
    description: 'Migrin Plus với Feverfew, Magie, Vitamin B2, hỗ trợ giảm đau đầu migraine, đau đầu căng thẳng, cải thiện tuần hoàn não.',
    ingredients: 'Feverfew Extract (150mg), Magie (300mg), Vitamin B2 (400mg), CoQ10',
    usage: 'Uống 1 viên x 2 lần/ngày, sau bữa ăn',
    note: 'Hiệu quả sau 2-4 tuần sử dụng. Không thay thế thuốc điều trị',
    rating: 4.6,
    numReviews: 167,
    stock: 140,
    inStock: true
  },

  {
    name: 'Bamogin hỗ trợ cải thiện tuần hoàn máu não',
    brand: 'Bamogin',
    price: 215000,
    originalPrice: 250000,
    image: 'VU_Bamogin_1.jpg',
    images: ['VU_Bamogin_1.jpg', 'VU_Bamogin_2.jpg', 'VU_Bamogin_3.jpg', 'VU_Bamogin_4.jpg', 'VU_Bamogin_5.jpg'],
    category: 'Thần kinh não',
    description: 'Bamogin với Ginkgo Biloba và Vinpocetine, hỗ trợ tăng cường tuần hoàn máu não, giảm chóng mặt, ù tai, mất ngủ.',
    ingredients: 'Ginkgo Biloba (80mg), Vinpocetine (10mg), Vitamin B1, B6, B12',
    usage: 'Uống 1 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Dùng liên tục 1-2 tháng để đạt hiệu quả tốt',
    rating: 4.4,
    numReviews: 156,
    stock: 160,
    inStock: true
  },

  // 28. Thần kinh não - Hoạt huyết
  {
    name: 'Dưỡng Não Thái Minh hỗ trợ hoạt huyết dưỡng não',
    brand: 'Thái Minh',
    price: 175000,
    originalPrice: 205000,
    image: 'Dưỡng Não Thái Minh_1.jpg',
    images: ['Dưỡng Não Thái Minh_1.jpg', 'Dưỡng Não Thái Minh_2.jpg', 'Dưỡng Não Thái Minh_3.jpg', 'Dưỡng Não Thái Minh_4.jpg', 'Dưỡng Não Thái Minh_5.jpg', 'Dưỡng Não Thái Minh_6.jpg'],
    category: 'Thần kinh não',
    description: 'Dưỡng Não Thái Minh với thành phần thảo dược, hỗ trợ hoạt huyết dưỡng não, cải thiện tuần hoàn máu, giảm mệt mỏi.',
    ingredients: 'Đan sâm, Xuyên khung, Đương quy, Ích mẫu, Bạch quả',
    usage: 'Uống 2-3 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Sử dụng liên tục 1-2 tháng. Bảo quản nơi khô mát',
    rating: 4.5,
    numReviews: 178,
    stock: 180,
    inStock: true
  },

  {
    name: 'Hoạt Huyết Thông Mạch hỗ trợ tuần hoàn máu',
    brand: 'Hoạt Huyết',
    price: 195000,
    originalPrice: 230000,
    image: 'Hoạt Huyết Thông Mạch_1.jpg',
    images: ['Hoạt Huyết Thông Mạch_1.jpg', 'Hoạt Huyết Thông Mạch_2.jpg', 'Hoạt Huyết Thông Mạch_3.jpg', 'Hoạt Huyết Thông Mạch_4.jpg', 'Hoạt Huyết Thông Mạch_5.jpg'],
    category: 'Thần kinh não',
    description: 'Hoạt Huyết Thông Mạch hỗ trợ hoạt huyết, thông mạch máu, giảm triệu chứng tê tay chân, đau nhức do tuần hoàn kém.',
    ingredients: 'Đan sâm, Xuyên khung, Hồng hoa, Táo nhân, Đương quy',
    usage: 'Uống 3-4 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Phù hợp cho người tuổi trung niên, người cao tuổi',
    rating: 4.6,
    numReviews: 189,
    stock: 150,
    inStock: true
  },

  // 29. Hỗ trợ làm đẹp - Da
  {
    name: 'VwhiteSkin hỗ trợ làm trắng da, chống lão hóa',
    brand: 'Vwhite',
    price: 425000,
    originalPrice: 490000,
    image: 'VU_VwhiteSkin_1.jpg',
    images: ['VU_VwhiteSkin_1.jpg', 'VU_VwhiteSkin_2.jpg', 'VU_VwhiteSkin_3.jpg', 'VU_VwhiteSkin_4.jpg', 'VU_VwhiteSkin_5.jpg'],
    category: 'Hỗ trợ làm đẹp',
    description: 'VwhiteSkin với Glutathione, Collagen và Vitamin C, hỗ trợ làm trắng da, mờ thâm nám, chống lão hóa, tăng độ đàn hồi.',
    ingredients: 'Glutathione (500mg), Collagen peptide (5000mg), Vitamin C (100mg), Vitamin E',
    usage: 'Uống 1-2 viên/ngày, trước bữa ăn sáng hoặc trước khi ngủ',
    note: 'Uống liên tục 2-3 tháng. Kết hợp chống nắng khi ra ngoài',
    rating: 4.8,
    numReviews: 456,
    stock: 200,
    inStock: true
  },

  {
    name: 'Hydrolyzed Collagen hỗ trợ đẹp da, chống lão hóa',
    brand: 'Collagen Plus',
    price: 385000,
    originalPrice: 450000,
    image: 'Hydrolyzed Collagen_1.jpg',
    images: ['Hydrolyzed Collagen_1.jpg', 'Hydrolyzed Collagen_2.jpg', 'Hydrolyzed Collagen_3.jpg', 'Hydrolyzed Collagen_4.jpg', 'Hydrolyzed Collagen_5.jpg'],
    category: 'Hỗ trợ làm đẹp',
    description: 'Hydrolyzed Collagen peptide phân tử nhỏ, hấp thụ tốt, hỗ trợ tái tạo da, giảm nếp nhăn, tăng độ đàn hồi, chống lão hóa.',
    ingredients: 'Hydrolyzed Collagen peptide (5000mg), Vitamin C, Hyaluronic Acid, Biotin',
    usage: 'Pha 1 gói với 150ml nước, uống 1 lần/ngày trước khi ngủ',
    note: 'Hiệu quả rõ rệt sau 4-8 tuần sử dụng đều đặn',
    rating: 4.7,
    numReviews: 389,
    stock: 180,
    inStock: true
  },

  // 30. Hỗ trợ làm đẹp - Tóc
  {
    name: 'Hair Volume New Nordic hỗ trợ mọc tóc, giảm rụng tóc',
    brand: 'New Nordic',
    price: 545000,
    originalPrice: 620000,
    image: 'Hair Volume New Nordic_1.jpg',
    images: ['Hair Volume New Nordic_1.jpg', 'Hair Volume New Nordic_2.jpg', 'Hair Volume New Nordic_3.jpg', 'Hair Volume New Nordic_4.jpg'],
    category: 'Hỗ trợ làm đẹp',
    description: 'Hair Volume New Nordic với chiết xuất táo, kê và Biotin, hỗ trợ mọc tóc, giảm rụng tóc, tăng độ dày và sức sống cho tóc.',
    ingredients: 'Apple Extract, Millet Extract, Biotin (2500mcg), Kẽm, Selen, Vitamin C',
    usage: 'Uống 2 viên/ngày, cùng với bữa ăn',
    note: 'Dùng liên tục 3-6 tháng. Phù hợp cả nam và nữ',
    rating: 4.6,
    numReviews: 267,
    stock: 120,
    inStock: true
  },

  {
    name: 'Vit Hair Men Galien hỗ trợ giảm rụng tóc nam',
    brand: 'Galien',
    price: 365000,
    originalPrice: 420000,
    image: 'VU_Vit Hair Men Galien_1.jpg',
    images: ['VU_Vit Hair Men Galien_1.jpg', 'VU_Vit Hair Men Galien_2.jpg', 'VU_Vit Hair Men Galien_3.jpg', 'VU_Vit Hair Men Galien_4.jpg'],
    category: 'Hỗ trợ làm đẹp',
    description: 'Vit Hair Men chuyên biệt cho nam giới, hỗ trợ giảm rụng tóc, kích thích mọc tóc, ngăn ngừa hói đầu sớm.',
    ingredients: 'Saw Palmetto (320mg), Biotin (5000mcg), Kẽm, L-Cysteine, Vitamin B complex',
    usage: 'Uống 1 viên x 2 lần/ngày, sau bữa ăn',
    note: 'Hiệu quả sau 2-3 tháng. Kết hợp chăm sóc tóc bên ngoài',
    rating: 4.5,
    numReviews: 234,
    stock: 140,
    inStock: true
  },

  // 31. Sức khỏe tim mạch - Giảm Cholesterol
  {
    name: 'Omega 3 Power hỗ trợ giảm cholesterol, bảo vệ tim mạch',
    brand: 'Power Health',
    price: 395000,
    originalPrice: 460000,
    image: 'VU_Omega 3 Power_1.jpg',
    images: ['VU_Omega 3 Power_1.jpg', 'VU_Omega 3 Power_2.jpg', 'VU_Omega 3 Power_3.jpg', 'VU_Omega 3 Power_4.jpg', 'VU_Omega 3 Power_5.jpg'],
    category: 'Sức khỏe tim mạch',
    description: 'Omega 3 Power với hàm lượng EPA/DHA cao từ dầu cá nguyên chất, hỗ trợ giảm cholesterol xấu, tăng cholesterol tốt, bảo vệ tim mạch.',
    ingredients: 'Fish Oil (1000mg), EPA (360mg), DHA (240mg), Vitamin E',
    usage: 'Uống 1-2 viên x 2 lần/ngày, sau bữa ăn',
    note: 'Bảo quản nơi mát, tránh ánh sáng trực tiếp',
    rating: 4.7,
    numReviews: 312,
    stock: 180,
    inStock: true
  },

  {
    name: 'Mỡ Máu Tâm Bình hỗ trợ ổn định mỡ máu',
    brand: 'Tâm Bình',
    price: 185000,
    originalPrice: 220000,
    image: 'VU_Mo Mau Tam Binh_1.jpg',
    images: ['VU_Mo Mau Tam Binh_1.jpg', 'VU_Mo Mau Tam Binh_2.jpg', 'VU_Mo Mau Tam Binh_3.jpg', 'VU_Mo Mau Tam Binh_4.jpg'],
    category: 'Sức khỏe tim mạch',
    description: 'Mỡ Máu Tâm Bình với thành phần thảo dược, hỗ trợ giảm mỡ máu, cholesterol, triglyceride, phòng ngừa xơ vữa động mạch.',
    ingredients: 'Hà thủ ô đỏ, Đan sâm, Trần bì, Nhân trần, Quyết minh',
    usage: 'Uống 2-3 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Dùng liên tục 2-3 tháng. Kết hợp ăn uống lành mạnh, tập thể dục',
    rating: 4.5,
    numReviews: 201,
    stock: 160,
    inStock: true
  },

  // 32. Sức khỏe tim mạch - Huyết áp
  {
    name: 'Blood Pressure+++ hỗ trợ ổn định huyết áp',
    brand: 'BP Plus',
    price: 325000,
    originalPrice: 380000,
    image: 'VU_Blood Pressure_1.jpg',
    images: ['VU_Blood Pressure_1.jpg', 'VU_Blood Pressure_3.jpg', 'VU_Blood Pressure_4.jpg', 'VU_Blood Pressure_5.jpg'],
    category: 'Sức khỏe tim mạch',
    description: 'Blood Pressure+++ với Olive Leaf Extract, CoQ10, Magie, hỗ trợ ổn định huyết áp, cải thiện tuần hoàn máu, bảo vệ tim mạch.',
    ingredients: 'Olive Leaf Extract (500mg), CoQ10 (100mg), Magie (200mg), Kali (99mg)',
    usage: 'Uống 1-2 viên x 2 lần/ngày, sau bữa ăn',
    note: 'Không thay thế thuốc điều trị. Theo dõi huyết áp thường xuyên',
    rating: 4.6,
    numReviews: 245,
    stock: 140,
    inStock: true
  },

  {
    name: 'Hạ Áp Ích Nhân hỗ trợ giảm huyết áp cao',
    brand: 'Ích Nhân',
    price: 175000,
    originalPrice: 205000,
    image: 'VU_Hạ Áp Ích Nhân_1.jpg',
    images: ['VU_Hạ Áp Ích Nhân_1.jpg', 'VU_Hạ Áp Ích Nhân_2.jpg', 'VU_Hạ Áp Ích Nhân_3.jpg', 'VU_Hạ Áp Ích Nhân_4.jpg', 'VU_Hạ Áp Ích Nhân_5.jpg', 'VU_Hạ Áp Ích Nhân_6.jpg'],
    category: 'Sức khỏe tim mạch',
    description: 'Hạ Áp Ích Nhân với thảo dược thiên nhiên, hỗ trợ giảm huyết áp cao, cải thiện tuần hoàn máu, giảm căng thẳng thần kinh.',
    ingredients: 'Hạ khô thảo, Cúc hoa, Quyết minh, Đan sâm, Ích mẫu',
    usage: 'Uống 2-3 viên x 3 lần/ngày, sau các bữa ăn',
    note: 'Dùng liên tục 1-2 tháng. Kết hợp chế độ ăn ít muối, tập thể dục',
    rating: 4.4,
    numReviews: 178,
    stock: 170,
    inStock: true
  }
]

// Categories data - 8 danh mục chính
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

    await mongoose.connect(MONGO_URI)

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

