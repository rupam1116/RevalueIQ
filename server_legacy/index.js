const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const analysisRoute = require('./routes/analysis');
const advisorRoute = require('./routes/advisor');
const partnersRoute = require('./routes/partners');
const paymentRoute = require('./routes/payment');

app.use('/api/analyze', analysisRoute);
app.use('/api/advisor', advisorRoute);
app.use('/api/partners', partnersRoute);
app.use('/api/payment', paymentRoute);

// Base route
app.get('/', (req, res) => {
  res.send('ReValueIQ API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
