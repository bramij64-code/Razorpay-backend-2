// create-order.js
const Razorpay = require('razorpay');

exports.handler = async function(event, context) {
  try {
    // Guard: ensure we have a body
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No request body' }) };
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON in request body' }) };
    }

    const amount = Number(data.amount);
    if (!amount || amount <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid amount' }) };
    }

    // Use env vars (set these in Netlify UI)
    const key_id = process.env.rzp_test_RijubWMRKaDIPB;
    const key_secret = process.env.BwUK1BbSywE3PZ07yHt741r0;
    if (!key_id || !key_secret) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Razorpay keys not configured' }) };
    }

    const instance = new Razorpay({ key_id, key_secret });

    // Razorpay needs amount in paise
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await instance.orders.create(options);

    return {
      statusCode: 200,
      body: JSON.stringify({ id: order.id, amount: order.amount, currency: order.currency })
    };

  } catch (err) {
    console.error('create-order error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', details: err.message || err }) };
  }
};
