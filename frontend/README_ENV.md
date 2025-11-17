# Cấu hình OpenAI API Key

Để sử dụng tính năng Chatbox AI, bạn cần cấu hình OpenAI API Key.

## Các bước thực hiện:

1. **Tạo file `.env` trong thư mục `frontend/`**

2. **Thêm API Key vào file `.env`:**
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Lấy OpenAI API Key:**
   - Truy cập: https://platform.openai.com/api-keys
   - Đăng nhập hoặc tạo tài khoản OpenAI
   - Tạo API key mới
   - Copy API key và dán vào file `.env`

4. **Khởi động lại dev server:**
   ```bash
   npm run dev
   ```

## Lưu ý:
- File `.env` đã được thêm vào `.gitignore` để bảo mật API key
- Không commit file `.env` lên Git
- API key sẽ được sử dụng từ phía client (browser)
- Nên cân nhắc tạo proxy server để bảo mật API key tốt hơn trong production

