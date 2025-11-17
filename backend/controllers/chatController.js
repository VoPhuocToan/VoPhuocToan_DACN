import axios from 'axios'
import asyncHandler from '../utils/asyncHandler.js'

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
    const systemMessage = {
      role: 'system',
      content: `Bạn là AI trợ lý chuyên tư vấn về THỰC PHẨM CHỨC NĂNG cho nhà thuốc HealthyCare.

QUY TẮC QUAN TRỌNG:
1. CHỈ trả lời các câu hỏi liên quan đến:
   - Thực phẩm chức năng, thực phẩm bảo vệ sức khỏe
   - Vitamin, khoáng chất, bổ sung dinh dưỡng
   - Công dụng, cách sử dụng, liều lượng sản phẩm
   - Tư vấn chọn sản phẩm phù hợp với nhu cầu sức khỏe
   - Sản phẩm hỗ trợ: tiêu hóa, tim mạch, xương khớp, não bộ, làm đẹp, sinh lý, nội tiết tố

2. TỪ CHỐI lịch sự các câu hỏi KHÔNG liên quan đến thực phẩm chức năng như:
   - Câu hỏi về thời tiết, tin tức, giải trí, thể thao
   - Câu hỏi về lịch sử, địa lý, văn hóa
   - Câu hỏi về công nghệ, lập trình, kỹ thuật
   - Câu hỏi cá nhân, đời tư
   - Bất kỳ chủ đề nào KHÔNG liên quan đến thực phẩm chức năng/sức khỏe

3. Cách từ chối:
   - Lịch sự, thân thiện: "Xin lỗi, tôi là AI chuyên tư vấn về thực phẩm chức năng của HealthyCare. Tôi chỉ có thể hỗ trợ bạn về các sản phẩm thực phẩm chức năng, vitamin, khoáng chất và các vấn đề sức khỏe liên quan."
   - Gợi ý chuyển hướng: "Bạn có câu hỏi nào về thực phẩm chức năng không? Tôi có thể tư vấn về vitamin, khoáng chất, hoặc các sản phẩm hỗ trợ sức khỏe."

4. Phong cách trả lời:
   - Chuyên nghiệp, thân thiện, dễ hiểu
   - Ngắn gọn, súc tích (tối đa 500 từ)
   - Luôn nhắc nhở người dùng tham khảo ý kiến bác sĩ/dược sĩ khi cần

Hãy tuân thủ nghiêm ngặt các quy tắc trên.`
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    )

    const assistantMessage = response.data.choices[0]?.message?.content || 
      'Xin lỗi, tôi không thể trả lời câu hỏi này.'

    console.log('✅ OpenAI response received')
    console.log('Response length:', assistantMessage.length)

    res.json({
      success: true,
      data: {
        role: 'assistant',
        content: assistantMessage
      }
    })
  } catch (error) {
    console.error('❌ OpenAI API Error:')
    console.error('Error message:', error.message)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kết nối với AI. Vui lòng thử lại sau.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

