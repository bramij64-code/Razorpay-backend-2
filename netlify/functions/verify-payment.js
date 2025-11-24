// verify-payment.js
const crypto = require('crypto');

exports.handler = async function(event, context) {
  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'No request body' }) };
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid JSON' }) };
    }

    // data should include: razorpay_order_id, razorpay_payment_id, razorpay_signature
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Missing parameters' }) };
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Secret key not configured' }) };
    }

    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } else {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Invalid signature' }) };
    }

  } catch (err) {
    console.error('verify-payment error', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: 'Server error' }) };
  }
};
