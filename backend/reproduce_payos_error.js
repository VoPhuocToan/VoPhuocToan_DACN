import fetch from 'node-fetch';

const API_URL = 'http://localhost:5000';

async function run() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@test.com', password: '123456' })
        });
        const loginData = await loginRes.json();
        if (!loginData.success) {
            console.error('Login failed:', loginData);
            return;
        }
        const token = loginData.token;
        console.log('Login successful, token obtained.');

        // 1.5 Get a product
        console.log('Fetching products...');
        const productsRes = await fetch(`${API_URL}/api/products`);
        const productsData = await productsRes.json();
        if (!productsData.success || productsData.data.length === 0) {
            console.error('No products found');
            return;
        }
        const product = productsData.data[0];
        console.log('Using product:', product._id);

        // 2. Create Order
        console.log('Creating order...');
        const orderRes = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                orderItems: [{
                    product: product._id,
                    name: product.name,
                    image: product.images?.[0] || 'test.jpg',
                    price: product.price,
                    quantity: 1
                }],
                shippingAddress: {
                    fullName: 'Test User',
                    phone: '0123456789',
                    address: '123 Test St',
                    city: 'Test City',
                    district: 'Test District',
                    ward: 'Test Ward'
                },
                paymentMethod: 'payos',
                itemsPrice: product.price,
                shippingPrice: 0,
                totalPrice: product.price
            })
        });
        const orderData = await orderRes.json();
        if (!orderData.success) {
            console.error('Order creation failed:', orderData);
            return;
        }
        const orderId = orderData.data._id;
        console.log('Order created:', orderId);

        // 3. Create PayOS Link
        console.log('Creating PayOS link...');
        const payosRes = await fetch(`${API_URL}/api/payment/payos/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                orderId: orderId,
                amount: product.price,
                description: `Thanh toan DH ${orderId.slice(-6)}`
            })
        });
        
        console.log('PayOS Status:', payosRes.status);
        const payosData = await payosRes.json();
        console.log('PayOS Response:', payosData);

    } catch (error) {
        console.error('Error:', error);
    }
}

run();
