import PayOSLib from '@payos/node';
console.log('Default export:', PayOSLib);
try {
    const { PayOS } = PayOSLib;
    console.log('Destructured PayOS:', PayOS);
} catch (e) {
    console.log('Error destructuring:', e.message);
}
