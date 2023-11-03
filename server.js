const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(express.json());

app.use(cors());

app.get('/stock/:ticker', async (req, res) => {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${req.params.ticker}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'An error occurred while fetching stock data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
