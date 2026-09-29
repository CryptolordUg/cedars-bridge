const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>res.send('Cedars Bridge Online ✅ V16 FIXED - ' + new Date().toISOString()));

app.get('/sol-balance', async (req,res)=>{
  try{
    const wallet = req.query.wallet || "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b";
    const r = await fetch("https://api.mainnet-beta.solana.com",{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({jsonrpc:"2.0",id:1,method:"getBalance",params:[wallet]})
    });
    const j = await r.json();
    res.json({sol: (j.result.value/1e9), wallet, time: new Date().toISOString()});
  }catch(e){res.json({sol:0,error:e.message})}
});

app.post('/trade', (req,res)=>{
  console.log("TRADE:", req.body);
  res.json({success:true, message:"Trade received V16", data:req.body});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log('V16 BRIDGE LIVE '+PORT));
