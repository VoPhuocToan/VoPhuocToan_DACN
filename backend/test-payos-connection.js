import dotenv from 'dotenv';
import PayOSLib from '@payos/node';

dotenv.config();

const { PayOS } = PayOSLib;

console.log('Checking PayOS Config...');
console.log('PAYOS_CLIENT_ID:', process.env.PAYOS_CLIENT_ID ? 'Found' : 'Missing');
console.log('PAYOS_API_KEY:', process.env.PAYOS_API_KEY ? 'Found' : 'Missing');
console.log('PAYOS_CHECKSUM_KEY:', process.env.PAYOS_CHECKSUM_KEY ? 'Found' : 'Missing');

if (!process.env.PAYOS_CLIENT_ID || !process.env.PAYOS_API_KEY || !process.env.PAYOS_CHECKSUM_KEY) {
    console.error('❌ Missing PayOS environment variables');
    process.exit(1);
}

const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY
);

console.log('PayOS.paymentRequests Keys:', Object.keys(payOS.paymentRequests));
let proto = Object.getPrototypeOf(payOS.paymentRequests);
while (proto) {
    console.log('PaymentRequests Prototype Keys:', Object.getOwnPropertyNames(proto));
    proto = Object.getPrototypeOf(proto);
}





async function testCreatePaymentLink() {
    try {
        console.log('Attempting to create a test payment link...');
        const orderCode = Number(String(Date.now()).slice(-13));
        const paymentData = {
            orderCode: orderCode,
            amount: 2000,
            description: 'Test PayOS Connection',
            returnUrl: 'http://localhost:5000/success',
            cancelUrl: 'http://localhost:5000/cancel',
            items: [
                {
                    name: 'Test Product',
                    quantity: 1,
                    price: 2000
                }
            ]
        };

        console.log('Payment Data:', paymentData);
        // Try using payOS.paymentRequests.create
        const paymentLink = await payOS.paymentRequests.create(paymentData);
        console.log('✅ Payment Link Created Successfully!');
        console.log('Checkout URL:', paymentLink.checkoutUrl);
    } catch (error) {

        console.error('❌ Error creating payment link:');
        console.error(error);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testCreatePaymentLink();
