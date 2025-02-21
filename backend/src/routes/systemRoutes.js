const express = require('express');
const router = express.Router();
const { getSystemMetrics } = require('../services/systemService');

router.get('/metrics', async (req, res) => {
  try {
    const data = await getSystemMetrics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system metrics' });
  }
});

module.exports = router;
