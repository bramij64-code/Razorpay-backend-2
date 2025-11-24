const Razorpay = require("razorpay");

exports.handler = async (event) => {
  const { amount } = JSON.parse(event.body);

  const razorpay = new Razorpay({
    key_id: process.env.rzp_test_RijubWMRKaDIPB,
    key_secret: process.env.BwUK1BbSywE3PZ07yHt741r0,
  });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "txn_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);

    return {
      statusCode: 200,
      body: JSON.stringify(order),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
