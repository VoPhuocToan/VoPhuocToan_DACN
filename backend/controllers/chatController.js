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

NHIỆM VỤ:
- Tư vấn sản phẩm đúng nhu cầu sức khỏe
- Khi người dùng có ý định MUA hoặc TÌM SẢN PHẨM → phân tích nhu cầu

QUY TẮC QUAN TRỌNG:
- Nếu người dùng hỏi "mua gì", "dùng gì", "có thuốc gì", "tư vấn cho tôi" -> BẮT BUỘC TRẢ VỀ JSON.
- KHÔNG trả lời bằng lời dẫn khi trả về JSON. Chỉ trả về JSON thuần túy.

CÁCH TRẢ LỜI:
1. Nếu là câu hỏi thông tin chung (không hỏi mua) → trả lời bình thường (text)
2. Nếu là câu hỏi mua / gợi ý sản phẩm → CHỈ trả về JSON theo mẫu:

{
  "intent": "suggest_product",
  "muc_dich": "Mục đích sử dụng (ngắn gọn)",
  "doi_tuong": "Đối tượng sử dụng",
  "van_de_suc_khoe": "Từ khóa chính (ví dụ: Xương khớp, Gan, Mắt, Não, Tim mạch, Vitamin, Đề kháng, Da, Tóc...)",
  "tu_khoa": ["keyword1", "keyword2"]
}

VÍ DỤ:
User: "đau lưng mua gì"
AI:
{
  "intent": "suggest_product",
  "muc_dich": "Giảm đau lưng",
  "doi_tuong": "Người lớn",
  "van_de_suc_khoe": "Xương khớp",
  "tu_khoa": ["đau lưng", "xương khớp", "glucosamine"]
}

LƯU Ý:
- "van_de_suc_khoe" nên dùng các từ khóa chung như: Xương khớp, Gan, Mắt, Não, Tim mạch, Vitamin, Đề kháng, Da, Tóc... để dễ tìm kiếm trong cơ sở dữ liệu.
- "tu_khoa": Liệt kê 3-5 từ khóa quan trọng nhất để tìm kiếm sản phẩm.
- KHÔNG tự bịa tên sản phẩm
- KHÔNG tư vấn ngoài lĩnh vực thực phẩm chức năng
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
    let displayContent = assistantMessage

    // 1. Try to parse the whole message as JSON
    try {
      aiResponse = JSON.parse(assistantMessage)
      displayContent = 'Tôi đã tìm thấy một số sản phẩm phù hợp với nhu cầu của bạn:'
    } catch (e) {
      // 2. If failed, try to extract JSON from text
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const jsonStr = jsonMatch[0]
          aiResponse = JSON.parse(jsonStr)
          
          // Remove the JSON part from the message to show only text
          displayContent = assistantMessage.replace(jsonStr, '').trim()
          if (!displayContent) {
            displayContent = 'Tôi đã tìm thấy một số sản phẩm phù hợp với nhu cầu của bạn:'
          }
        } catch (parseError) {
          console.log('❌ Failed to parse extracted JSON:', parseError.message)
        }
      }
    }

    if (aiResponse?.intent === 'suggest_product') {
      const { muc_dich, doi_tuong, van_de_suc_khoe, tu_khoa } = aiResponse

      console.log('🔍 AI Intent: suggest_product')
      console.log('🔍 AI Data:', aiResponse)

      // Build query conditions
      const orConditions = []
      
      // Helper to add regex conditions for multiple fields
      const addCondition = (term, fields) => {
        if (term) {
          fields.forEach(field => {
            orConditions.push({ [field]: { $regex: term, $options: 'i' } })
          })
        }
      }

      addCondition(muc_dich, ['category', 'name', 'description'])
      addCondition(doi_tuong, ['description', 'usage', 'name'])
      addCondition(van_de_suc_khoe, ['description', 'usage', 'ingredients', 'name'])

      if (tu_khoa && Array.isArray(tu_khoa)) {
        tu_khoa.forEach(kw => {
           addCondition(kw, ['name', 'description', 'category', 'usage', 'ingredients'])
        })
      }

      console.log('🔍 Query Conditions:', JSON.stringify(orConditions, null, 2))

      // Fallback if no conditions match (though regex usually matches something or empty string matches all)
      // If all fields are empty, we might return random products or none.
      // But let's stick to the logic.
      
      if (orConditions.length > 0) {
          suggestProducts = await Product.find({
            $or: orConditions
          }).limit(5)
          console.log('🔍 Found products:', suggestProducts.length)
      }
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



