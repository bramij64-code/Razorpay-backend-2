const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Create order — dummy simple
app.post("/create-order", (req, res) => {
  const { amount } = req.body;

  const order = {
    id: "order_" + Date.now(),
    amount: amount * 100,
    currency: "INR",
  };

  res.json(order);
});

// Verify payment
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const key_secret = process.env.RAZORPAY_SECRET;

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  let expected_signature = crypto
    .createHmac("sha256", key_secret)
    .update(body.toString())
    .digest("hex");

  if (expected_signature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/", (req, res) => {
  res.send("Razorpay Backend Running!");
});

app.listen(10000, () => {
  console.log("Server running on port 10000");
});
