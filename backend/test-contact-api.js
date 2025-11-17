#!/usr/bin/env node

/**
 * Contact API Test Script
 * Chạy: node test-contact-api.js
 */

import http from 'http';

const API_URL = 'http://localhost:5000';
const ADMIN_TOKEN = ''; // Được fill bằng token từ login

// Helper function to make requests
function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test scenarios
async function runTests() {
  console.log('🧪 Contact API Test Suite');
  console.log('='.repeat(50));

  try {
    // ✅ Test 1: Gửi liên hệ (Public)
    console.log('\n1️⃣  TEST: Gửi liên hệ mới (POST /api/contact)');
    const contactData = {
      name: 'Lê Văn C',
      email: 'levvan.c@gmail.com',
      phone: '0923456789',
      subject: 'Hỏi về giao hàng',
      message: 'Bao lâu thì giao hàng đến Hà Nội?'
    };

    const sendResponse = await makeRequest('POST', '/api/contact', contactData);
    console.log('Status:', sendResponse.status);
    console.log('Response:', JSON.stringify(sendResponse.data, null, 2));
    
    const contactId = sendResponse.data.data?._id;
    if (contactId) {
      console.log('✅ Contact ID:', contactId);
    }

    // ✅ Test 2: Login admin
    console.log('\n2️⃣  TEST: Login admin (POST /api/auth/login)');
    const loginData = {
      email: 'admin@healthycare.com',
      password: '123456'
    };

    const loginResponse = await makeRequest('POST', '/api/auth/login', loginData);
    console.log('Status:', loginResponse.status);
    console.log('Token:', loginResponse.data.data?.token?.substring(0, 20) + '...');
    
    const adminToken = loginResponse.data.data?.token;
    if (!adminToken) {
      console.log('❌ Không thể lấy token');
      return;
    }

    // ✅ Test 3: Lấy danh sách liên hệ
    console.log('\n3️⃣  TEST: Lấy danh sách liên hệ (GET /api/contact)');
    const listResponse = await makeRequest('GET', '/api/contact', null, adminToken);
    console.log('Status:', listResponse.status);
    console.log('Số liên hệ:', listResponse.data.count);
    console.log('Danh sách:');
    listResponse.data.data?.slice(0, 3).forEach((c, i) => {
      console.log(`  ${i + 1}. [${c.status}] ${c.name} - ${c.subject}`);
    });

    // ✅ Test 4: Lấy thống kê liên hệ
    console.log('\n4️⃣  TEST: Lấy thống kê (GET /api/contact/stats/count)');
    const statsResponse = await makeRequest(
      'GET',
      '/api/contact/stats/count',
      null,
      adminToken
    );
    console.log('Status:', statsResponse.status);
    console.log('Stats:', statsResponse.data.data);

    // ✅ Test 5: Xem chi tiết liên hệ
    if (contactId) {
      console.log('\n5️⃣  TEST: Xem chi tiết liên hệ (GET /api/contact/:id)');
      const detailResponse = await makeRequest(
        'GET',
        `/api/contact/${contactId}`,
        null,
        adminToken
      );
      console.log('Status:', detailResponse.status);
      console.log('Tên:', detailResponse.data.data?.name);
      console.log('Email:', detailResponse.data.data?.email);
      console.log('Status được cập nhật:', detailResponse.data.data?.status);
    }

    // ✅ Test 6: Trả lời liên hệ
    if (contactId) {
      console.log('\n6️⃣  TEST: Trả lời liên hệ (PUT /api/contact/:id/reply)');
      const replyData = {
        reply: 'Cảm ơn bạn đã liên hệ. Chúng tôi giao hàng miễn phí cho các đơn hàng trên 500k, giao trong 2-3 ngày làm việc.'
      };
      const replyResponse = await makeRequest(
        'PUT',
        `/api/contact/${contactId}/reply`,
        replyData,
        adminToken
      );
      console.log('Status:', replyResponse.status);
      console.log('Contact status:', replyResponse.data.data?.status);
      console.log('Reply:', replyResponse.data.data?.reply);
    }

    // ✅ Test 7: Đóng liên hệ
    if (contactId) {
      console.log('\n7️⃣  TEST: Đóng liên hệ (PUT /api/contact/:id/close)');
      const closeResponse = await makeRequest(
        'PUT',
        `/api/contact/${contactId}/close`,
        {},
        adminToken
      );
      console.log('Status:', closeResponse.status);
      console.log('Contact status:', closeResponse.data.data?.status);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Tất cả test hoàn thành!');
    console.log('\n📝 Ghi chú:');
    console.log('- Contact được lưu vào MongoDB');
    console.log('- Admin có thể xem danh sách, filter, xem chi tiết');
    console.log('- Admin có thể trả lời và đóng liên hệ');
    console.log('- Status tự động cập nhật khi xem và trả lời');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Chạy tests
runTests();
