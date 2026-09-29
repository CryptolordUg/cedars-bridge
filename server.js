const express = require('express');
const WebSocket = require('ws');
const app = express();
app.use(express.json());

let DERIV_BALANCE = 0;

app.get('/', (req, res) => {
  res.send('V18 REAL TRADER - Balance: $' + DERIV_BALANCE + ' - Live!');
});

app.post('/webhook', async (req, res) => {
  console.log('WEBHOOK:', req.body);
  const token = process.env.DERIV_TOKEN;
  if (!token) return res.json({ error: 'Add DERIV_TOKEN in Render Environment!' });
  const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
  ws.on('open', () => { ws.send(JSON.stringify({ authorize: token })); });
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    console.log('DERIV:', data);
    if (data.authorize) {
      DERIV_BALANCE = data.authorize.balance;
      ws.send(JSON.stringify({
        buy: 1, price: 1,
        parameters: { amount: 1, basis: "stake", contract_type: "CALL", currency: "USD", duration: 1, duration_unit: "m", symbol: "R_75" }
      }));
    }
    if (data.buy) {
      console.log('TRADE PLACED! ID:', data.buy.contract_id);
      ws.close();
      res.json({ status: 'Trade placed', contract_id: data.buy.contract_id, balance: DERIV_BALANCE });
    }
    if (data.error) {
      console.error('ERROR:', data.error);
      ws.close();
      res.json({ error: data.error });
    }
  });
});

app.post('/', (req, res) => { res.redirect(307, '/webhook'); });
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('V18 running on ' + PORT));
