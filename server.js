app.get('/sol-balance', async (req, res) => {
  try {
    const wallet = req.query.wallet || "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b";
    const r = await fetch("https://api.mainnet-beta.solana.com", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [wallet] })
    });
    const j = await r.json();
    res.json({ sol: j.result.value / 1e9, wallet });
  } catch(e){
    res.json({ sol: 0, error: e.message });
  }
});

app.get('/trade' // <- your existing code starts here
