const express = require('express');
const router = express.Router();

router.post('/checkout', (req, res) => {
  const { plan } = req.body;
  
  // Mock checkout flow
  if (plan === 'Premium') {
    res.json({
      success: true,
      data: {
        message: 'Redirecting to payment gateway for Premium Plan',
        checkoutUrl: 'https://mock-payment-gateway.example.com/checkout/12345'
      }
    });
  } else {
    res.json({
      success: true,
      data: {
        message: 'Free plan activated successfully.'
      }
    });
  }
});

module.exports = router;
