const express = require('express');
const cors = require('cors');
const https = require('https');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>res.send('Cedars Bridge Online ✅ V16 FIXED - ' + new Date().toISOString()));

app.get('/sol-balance', (req,res)=>{
  const wallet = req.query.wallet || "6XQv1XJ5EceCa2q6uGrnrsx8KSnLRSvXe7TMCFF6F1b";
  const postData = JSON.stringify({jsonrpc:"2.0",id:1,method:"getBalance",params:[wallet]});
  const options = {
    hostname: 'api.mainnet-beta.solana.com',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {'Content-Type':'application/json','Content-Length': Buffer.byteLength(postData)}
  };
  const rpcReq = https.request(options, (rpcRes)=>{
    let data = '';
    rpcRes.on('data', (c)=> data+=c);
    rpcRes.on('end', ()=>{
      try{
        const j = JSON.parse(data);
        res.json({sol: (j.result.value/1e9), wallet, lamports: j.result.value});
      }catch(e){res.json({sol:0, error:e.message})}
    });
  });
  rpcReq.on('error', (e)=>res.json({sol:0, error:e.message}));
  rpcReq.write(postData);
  rpcReq.end();
});

app.post('/trade', (req,res)=>{ console.log(req.body); res.json({success:true, data:req.body}); });

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log('LIVE '+PORT));
