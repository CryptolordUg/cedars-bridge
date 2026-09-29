const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Cedars Bridge Online ✅ - V16 Ready');
});

// NEW - REAL SOL BALANCE (V16 needs this)
app.get('/sol-balance', async (req, res) => {
  try {
    const wallet = req.query.wallet || "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b";
    const rpcRes = await fetch("https://api.mainnet-beta.solana.com", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [wallet]
      })
    });
    const data = await rpcRes.json();
    const lamports = data.result? data.result.value : 0;
    const sol = lamports / 1e9;
    res.json({ sol: sol, wallet: wallet, lamports: lamports });
  } catch (e) {
    res.json({ sol: 0, error: e.message });
  }
});

// YOUR EXISTING TRADE ENDPOINT (kept)
app.post('/trade', async (req, res) => {
  try {
    console.log("TRADE:", req.body);
    // Your Deriv logic here - keeping it simple so it always returns success
    res.json({ success: true, message: "Trade received", data: req.body });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/trade', (req, res) => {
  res.json({ status: "Use POST /trade" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Bridge LIVE on ${PORT}`));
