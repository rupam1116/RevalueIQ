const express = require('express');
const router = express.Router();

// Mock Generative AI Repair Advisor
router.post('/', (req, res) => {
  const { query, productName } = req.body;
  
  setTimeout(() => {
    let responseText = '';
    
    if (query.toLowerCase().includes('screen') || query.toLowerCase().includes('crack')) {
      responseText = `To repair a cracked screen on a ${productName || 'device'}, you will need a suction cup, a prying tool, and a replacement screen assembly. \n\n1. Heat the edges of the device to soften the adhesive. \n2. Use the suction cup to lift the screen slightly. \n3. Insert the prying tool and carefully slide around the edges. \n4. Disconnect the battery and display cables before fully removing the screen.\n\n*Warning: This requires technical skill. If unsure, consult a local repair shop.*`;
    } else if (query.toLowerCase().includes('battery') || query.toLowerCase().includes('charge')) {
      responseText = `Battery replacement for ${productName || 'your device'}: \n\n1. Power off the device. \n2. Remove the back cover using a heat gun and prying tool. \n3. Disconnect the battery flex cable immediately to prevent short circuits. \n4. Use adhesive remover to safely pull out the old battery. \n5. Install the new battery and reconnect.`;
    } else {
      responseText = `Based on our AI analysis for ${productName || 'this device'}, the reported issue requires diagnosing the internal motherboard components. We recommend running a software diagnostic first, or taking it to one of our certified repair partners listed below for a professional teardown.`;
    }

    res.json({
      success: true,
      data: {
        role: 'assistant',
        content: responseText
      }
    });
  }, 2000); // Simulate API latency
});

module.exports = router;
