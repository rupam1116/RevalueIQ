const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { productName, brand, condition } = req.body;
  
  setTimeout(() => {
    const conditions = ['Excellent', 'Good', 'Moderate', 'Damaged'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const finalCondition = condition || randomCondition;
    
    let baseValue = Math.floor(Math.random() * (80000 - 5000) + 5000);
    let estimatedPrice = baseValue;
    let repairCost = 0;
    
    if (finalCondition === 'Moderate') {
      estimatedPrice = baseValue * 0.7;
      repairCost = Math.floor(baseValue * 0.15);
    } else if (finalCondition === 'Damaged') {
      estimatedPrice = baseValue * 0.4;
      repairCost = Math.floor(baseValue * 0.4);
    }
    
    const isFraud = Math.random() > 0.9; 

    let circularityRecommendation = 'Sell';
    if (finalCondition === 'Damaged') {
      circularityRecommendation = repairCost < estimatedPrice ? 'Repair' : 'Recycle';
    } else if (estimatedPrice < 15000 && finalCondition !== 'Excellent') {
      // Adjusted donation threshold to generate 'Donate' recommendations sometimes
      circularityRecommendation = 'Donate';
    }
    
    const circularityScore = Math.floor(Math.random() * (100 - 50) + 50);
    // Rough estimate: keeping electronics in loop saves 30-100kg CO2 based on device size.
    const carbonSavingsKg = Math.floor(Math.random() * (120 - 20) + 20);

    res.json({
      success: true,
      data: {
        productName: productName || 'Unknown Device',
        brand: brand || 'Unknown',
        detectedCondition: finalCondition,
        estimatedPrice: estimatedPrice.toFixed(0),
        repairCost: repairCost > 0 ? repairCost.toFixed(0) : null,
        isFraud,
        circularityRecommendation,
        circularityScore,
        carbonSavingsKg
      }
    });
  }, 1500);
});

module.exports = router;
