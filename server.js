const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('V17.1 REAL LIVE 10000 - Cedars Bridge Running!');
});

app.post('/webhook', (req, res) => {
  console.log('=== WEBHOOK RECEIVED ===');
  console.log(req.body);
  
  // Here you will add your Deriv trading logic
  // For now just log it
  
  res.json({ status: 'ok', message: 'Trade signal received', data: req.body });
});

app.post('/', (req, res) => {
  console.log('POST ROOT:', req.body);
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
