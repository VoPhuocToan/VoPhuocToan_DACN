import OpenAI from 'openai'
import asyncHandler from '../utils/asyncHandler.js'
import Product from '../models/Product.js'

// @desc    Chat with AI
// @route   POST /api/chat
// @access  Public
export const chatWithAI = asyncHandler(async (req, res) => {
  console.log('📨 Chat request received')
  console.log('Request body:', req.body)
  
  const { messages } = req.body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.log('❌ Invalid messages')
    return res.status(400).json({
      success: false,
      message: 'Vui lòng gửi tin nhắn'
    })
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.log('❌ OpenAI API key not configured')
    return res.status(500).json({
      success: false,
      message: 'OpenAI API key chưa được cấu hình'
    })
  }

  console.log('✅ API key found, calling OpenAI...')

  try {
    const openai = new OpenAI({
      apiKey: apiKey
    })

    const systemPrompt = `
Bạn là AI trợ lý tư vấn THỰC PHẨM CHỨC NĂNG cho nhà thuốc HealthyCare.

GIỚI HẠN BẮT BUỘC:
1. CHỈ ĐƯỢC:
- Tư vấn thực phẩm chức năng
- Giải thích công dụng, cách dùng, liều lượng
- Gợi ý sản phẩm có trong CSDL (thông qua việc trả về JSON để hệ thống tìm kiếm)
- Tìm kiếm, so sánh sản phẩm theo giá, công dụng, mức bán chạy
2. KHÔNG ĐƯỢC:
- Tư vấn bệnh, chẩn đoán y khoa (thay thế bác sĩ)
- Nói chuyện ngoài lề (chính trị, game, lập trình, đời sống...)
- Đưa ra sản phẩm không có trong CSDL (không được bịa tên sản phẩm)
- Nếu người dùng hỏi sai chủ đề -> Từ chối lịch sự và hướng lại đúng phạm vi.

PHÂN LOẠI INTENT (Ý ĐỊNH):
- "suggest_product": Tìm sản phẩm, lọc sản phẩm (giá, bán chạy, danh mục), so sánh sản phẩm.
- "advice": Tư vấn sử dụng (uống lúc nào, ai không nên dùng...), giải thích công dụng.
- "refuse": Câu hỏi ngoài phạm vi (bệnh lý, chính trị, game...).

CẤU TRÚC JSON TRẢ VỀ (BẮT BUỘC CHO MỌI CÂU TRẢ LỜI):
{
  "intent": "suggest_product" | "advice" | "refuse",
  "message": "Nội dung trả lời (Tuân thủ công thức: Xác nhận nhu cầu -> Gợi ý -> Thông tin -> Hành động)",
  "search_params": {
    "keywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3"],
    "category": "Tên danh mục nếu có (Ví dụ: Vitamin & Khoáng chất, Hỗ trợ tiêu hóa, Sức khỏe tim mạch, Hỗ trợ xương khớp, Hỗ trợ làm đẹp)",
    "sort": "price_asc" | "price_desc" | "best_selling" | null
  }
}

VÍ DỤ:
User: "đau lưng mua gì"
AI:
{
  "intent": "suggest_product",
  "message": "Chào bạn, với tình trạng đau lưng, bạn có thể tham khảo các sản phẩm hỗ trợ xương khớp. Dưới đây là một số gợi ý phù hợp:",
  "search_params": {
    "keywords": ["xương khớp", "đau lưng", "glucosamine"],
    "category": "Hỗ trợ xương khớp",
    "sort": null
  }
}

User: "tìm vitamin C giá rẻ nhất"
AI:
{
  "intent": "suggest_product",
  "message": "Dưới đây là các sản phẩm Vitamin C có giá tốt nhất tại HealthyCare:",
  "search_params": {
    "keywords": ["vitamin C"],
    "category": "Vitamin & Khoáng chất",
    "sort": "price_asc"
  }
}

User: "bệnh ung thư có chữa được không"
AI:
{
  "intent": "refuse",
  "message": "Xin lỗi, tôi chỉ là trợ lý ảo tư vấn về thực phẩm chức năng và không thể đưa ra lời khuyên về các bệnh lý nghiêm trọng như ung thư. Bạn vui lòng tham khảo ý kiến bác sĩ chuyên khoa để được chẩn đoán và điều trị chính xác.",
  "search_params": null
}

LƯU Ý:
- Luôn trả về JSON hợp lệ.
- "keywords": Chọn 3-5 từ khóa sát nhất với nhu cầu để tìm trong database.
- "message": Ngắn gọn, súc tích, lịch sự.
`

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.3,
      max_tokens: 500,
    })

    const assistantMessage = completion.choices[0].message.content || 'Xin lỗi, tôi không thể trả lời câu hỏi này.'

    console.log('✅ OpenAI response received')
    console.log('Response length:', assistantMessage.length)

    let aiResponse = null
    let suggestProducts = []
    let displayContent = ''

    // 1. Try to parse the whole message as JSON
    try {
      aiResponse = JSON.parse(assistantMessage)
      displayContent = aiResponse.message || 'Tôi đã tìm thấy một số sản phẩm phù hợp:'
    } catch (e) {
      // 2. If failed, try to extract JSON from text
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[0]
          aiResponse = JSON.parse(jsonStr)
          displayContent = aiResponse.message || 'Tôi đã tìm thấy một số sản phẩm phù hợp:'
        } catch (parseError) {
          console.log('❌ Failed to parse extracted JSON:', parseError.message)
          displayContent = assistantMessage // Fallback to raw text
        }
      } else {
        displayContent = assistantMessage // No JSON found
      }
    }

    if (aiResponse && aiResponse.intent === 'suggest_product' && aiResponse.search_params) {
      const { keywords, category, sort } = aiResponse.search_params

      console.log('🔍 AI Intent: suggest_product')
      console.log('🔍 Search Params:', aiResponse.search_params)

      // Build query conditions
      const query = { isActive: true }
      const orConditions = []
      
      if (keywords && Array.isArray(keywords) && keywords.length > 0) {
        keywords.forEach(kw => {
           orConditions.push({ name: { $regex: kw, $options: 'i' } })
           orConditions.push({ description: { $regex: kw, $options: 'i' } })
           orConditions.push({ category: { $regex: kw, $options: 'i' } })
           orConditions.push({ usage: { $regex: kw, $options: 'i' } })
        })
      }

      if (category) {
        // If category is specific, prioritize it or filter by it
        // Here we add it to OR conditions to be flexible, or AND if strict.
        // Let's use AND if provided to narrow down, but AI might guess wrong category name.
        // Safer to use regex on category field in OR or separate AND.
        // Let's try to be smart: if category matches one of our known categories, use it strictly?
        // For now, let's add it to the OR conditions with high priority or just regex match.
        orConditions.push({ category: { $regex: category, $options: 'i' } })
      }

      if (orConditions.length > 0) {
        query.$or = orConditions
      }

      // Sort options
      let sortOption = {}
      if (sort === 'price_asc') sortOption = { price: 1 }
      else if (sort === 'price_desc') sortOption = { price: -1 }
      else if (sort === 'best_selling') sortOption = { sold: -1 } // Assuming 'sold' field exists, or 'views'
      else sortOption = { views: -1 } // Default to popular

      suggestProducts = await Product.find(query)
        .sort(sortOption)
        .limit(5)
      
      console.log('🔍 Found products:', suggestProducts.length)

      if (suggestProducts.length === 0) {
        displayContent += '\n\n(Hiện tại HealthyCare chưa có sản phẩm nào hoàn toàn phù hợp với các tiêu chí tìm kiếm này. Bạn có thể thử từ khóa khác nhé.)'
      }
    } else if (aiResponse && aiResponse.intent === 'refuse') {
       // Just return the message
    } else if (aiResponse && aiResponse.intent === 'advice') {
       // Just return the message
    }

    res.json({
      success: true,
      data: {
        role: 'assistant',
        content: displayContent,
        products: suggestProducts.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          image: p.image
        }))
      }
    })

  } catch (error) {
    console.error('❌ OpenAI Error:')
    console.error('Error message:', error.message)
    console.error('Error details:', error)
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kết nối với AI. Vui lòng thử lại sau.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})



