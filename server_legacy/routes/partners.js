const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { type } = req.query; // 'repair' or 'ngo'

  const partners = {
    repair: [
      { id: 1, name: 'TechFix Solutions', location: '123 Main St, Springfield', estimatedCost: '4,000 - 12,000', contact: '555-0101', rating: 4.8 },
      { id: 2, name: 'Gadget Rescue', location: '456 Oak Ave, Springfield', estimatedCost: '3,000 - 10,000', contact: '555-0102', rating: 4.5 },
      { id: 3, name: 'Screen Savers', location: '789 Pine Ln, Springfield', estimatedCost: '5,000 - 15,000', contact: '555-0103', rating: 4.2 }
    ],
    ngo: [
      { id: 101, name: 'GreenEarth Electronics', location: 'Springfield Community Center', needs: 'Laptops, Mobiles', rating: 4.9 },
      { id: 102, name: 'Digital Literacy Foundation', location: 'Downtown Springfield', needs: 'Working PCs, Tablets', rating: 4.7 },
      { id: 103, name: 'Recycle for Good', location: 'Westside Drop-off', needs: 'All electronics (even broken)', rating: 4.6 }
    ]
  };

  if (type === 'ngo') {
    return res.json({ success: true, data: partners.ngo });
  }
  
  // default to repair
  res.json({ success: true, data: partners.repair });
});

module.exports = router;
