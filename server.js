const express = require('express');
const cors = require('cors');
const https = require('https');
const WebSocket = require('ws');
const app = express();
app.use(cors());
app.use(express.json());

// CONFIG - PUT YOUR DERIV TOKEN HERE
const DERIV_TOKEN = process.env.DERIV_TOKEN || "YOUR_DERIV_API_TOKEN_HERE";
const APP_ID = 1089; // public app_id, keep

app.get('/', (req,res)=>res.send('Cedars Bridge V17 REAL TRADING LIVE ✅ ' + new Date().toISOString()));

// REAL SOL BALANCE - KEEPING YOUR WALLET
app.get('/sol-balance', (req,res)=>{
  const wallet = req.query.wallet || "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b";
  const postData = JSON.stringify({jsonrpc:"2.0",id:1,method:"getBalance",params:[wallet]});
  const options = {
    hostname: 'api.mainnet-beta.solana.com', port: 443, path: '/', method: 'POST',
    headers: {'Content-Type':'application/json','Content-Length': Buffer.byteLength(postData)}
  };
  const rpcReq = https.request(options, (rpcRes)=>{
    let data = '';
    rpcRes.on('data', c=> data+=c);
    rpcRes.on('end', ()=>{
      try{
        const j = JSON.parse(data);
        res.json({sol: (j.result.value/1e9), wallet, lamports: j.result.value, real: true});
      }catch(e){res.json({sol:0, error:e.message})}
    });
  });
  rpcReq.on('error', e=>res.json({sol:0, error:e.message}));
  rpcReq.write(postData);
  rpcReq.end();
});

// REAL TRADE EXECUTOR
app.post('/trade', async (req,res)=>{
  const { market, action, amount, duration } = req.body;
  console.log("REAL TRADE REQUEST:", req.body);

  // If no Deriv token set, return demo mode
  if(!DERIV_TOKEN || DERIV_TOKEN.includes("YOUR_DERIV")){
    return res.json({ success: true, mode: "DEMO - Add DERIV_TOKEN in Render Env", received: req.body, wallet: "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b" });
  }

  try{
    const ws = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${APP_ID}`);

    ws.on('open', ()=> ws.send(JSON.stringify({ authorize: DERIV_TOKEN })));

    ws.on('message', (msg)=>{
      const data = JSON.parse(msg);
      if(data.msg_type === 'authorize'){
        // Buy contract - example: Rise/Fall
        const buyParams = {
          buy: 1,
          price: amount || 1,
          parameters: {
            amount: amount || 1,
            basis: "stake",
            contract_type: action === "BUY" || action === "CALL"? "CALL" : "PUT",
            currency: "USD",
            duration: duration || 5,
            duration_unit: "m",
            symbol: market || "R_100"
          }
        };
        ws.send(JSON.stringify(buyParams));
      }
      if(data.msg_type === 'buy'){
        res.json({ success: true, real: true, contract: data.buy, wallet: "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b" });
        ws.close();
      }
      if(data.error){
        res.json({ success: false, error: data.error.message, wallet: "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b" });
        ws.close();
      }
    });

    ws.on('error', e=> res.json({success:false, error:e.message}));

  }catch(e){ res.json({success:false, error:e.message}); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log('V17 REAL TRADING LIVE '+PORT));
