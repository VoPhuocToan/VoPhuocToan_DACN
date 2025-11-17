import React, { useState, useRef, useEffect } from 'react'
import './Chatbox.css'

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! Tôi là AI hỗ trợ của HealthyCare chuyên tư vấn về **thực phẩm chức năng**. Tôi có thể giúp bạn:\n\n• Tìm hiểu về các sản phẩm thực phẩm chức năng\n• Tư vấn về công dụng, cách sử dụng, liều lượng\n• Hỗ trợ chọn sản phẩm phù hợp với nhu cầu sức khỏe\n• Giải đáp thắc mắc về vitamin, khoáng chất, bổ sung dinh dưỡng\n\n⚠️ Lưu ý: Tôi chỉ trả lời các câu hỏi liên quan đến thực phẩm chức năng và sức khỏe. Vui lòng hỏi về các chủ đề khác tại bộ phận hỗ trợ khác.\n\nBạn cần hỗ trợ gì về thực phẩm chức năng hôm nay?'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: inputValue.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      
      console.log('Sending request to:', `${apiUrl}/api/chat`)
      console.log('Messages:', [...messages, userMessage])
      
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        throw new Error(errorData.message || 'Lỗi khi gọi API')
      }

      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success && data.data) {
        const assistantMessage = {
          role: data.data.role,
          content: data.data.content
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.message || 'Lỗi không xác định')
      }
    } catch (error) {
      console.error('Chat Error:', error)
      
      let errorMessage = 'Xin lỗi, đã có lỗi xảy ra. '
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage += 'Không thể kết nối đến server. Vui lòng kiểm tra:\n'
        errorMessage += '• Backend server đã được khởi động chưa?\n'
        errorMessage += '• URL API có đúng không? (http://localhost:5000)\n'
        errorMessage += '• Có lỗi CORS không?\n\n'
        errorMessage += 'Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ qua số 1800 6928.'
      } else {
        errorMessage += error.message
        errorMessage += '\n\nVui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ qua số 1800 6928.'
      }
      
      const errorMsg = {
        role: 'assistant',
        content: errorMessage
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`chatbox-wrapper ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className='chatbox-container'>
          <div className='chatbox-header'>
            <div className='chatbox-header-info'>
              <div className='chatbox-avatar'>🤖</div>
              <div>
                <h3>AI Hỗ trợ HealthyCare</h3>
                <span className='chatbox-status'>Đang trực tuyến</span>
              </div>
            </div>
            <button 
              className='chatbox-close-btn'
              onClick={() => setIsOpen(false)}
              aria-label='Đóng chat'
            >
              ✕
            </button>
          </div>

          <div className='chatbox-messages'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className='message-content'>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='message assistant-message'>
                <div className='message-content'>
                  <div className='typing-indicator'>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className='chatbox-input-container'>
            <input
              ref={inputRef}
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Nhập câu hỏi của bạn...'
              className='chatbox-input'
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className='chatbox-send-btn'
              aria-label='Gửi tin nhắn'
            >
              <i className='fi fi-rr-paper-plane'></i>
            </button>
          </div>
        </div>
      ) : (
        <button
          className='chatbox-toggle-btn'
          onClick={() => setIsOpen(true)}
          aria-label='Mở chat'
        >
          <i className='fi fi-br-comment-dots'></i>
          <span className='chatbox-badge'>AI</span>
        </button>
      )}
    </div>
  )
}

export default Chatbox

