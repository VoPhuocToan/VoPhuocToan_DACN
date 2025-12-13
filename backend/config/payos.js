import PayOSLib from '@payos/node';

const { PayOS } = PayOSLib;

if (!process.env.PAYOS_CLIENT_ID || !process.env.PAYOS_API_KEY || !process.env.PAYOS_CHECKSUM_KEY) {
  console.error('❌ PayOS configuration missing in .env file');
}

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export default payOS;
