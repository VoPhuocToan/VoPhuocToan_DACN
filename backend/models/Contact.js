import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Vui lòng nhập email hợp lệ'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Vui lòng nhập chủ đề'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung tin nhắn'],
      minlength: 10
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new'
    },
    reply: {
      type: String,
      default: null
    },
    repliedAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

export default mongoose.model('Contact', contactSchema);
