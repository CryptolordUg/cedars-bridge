const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
function pickVenue(symbol){symbol=symbol.toUpperCase();if(symbol.includes('BTC')||symbol.includes('ETH')||symbol.includes('SOL')||symbol.endsWith('USDT')){return 'binance';}return 'mt5';}
app.get('/',(req,res)=>{res.send('Cedars of Wealth Bridge running');});
app.post('/trade',async(req,res)=>{const{symbol,action,volume}=req.body;if(!symbol||!action){return res.status(400).json({status:'error'});}const venue=pickVenue(symbol);console.log(`Auto-routing ${action} ${symbol} -> ${venue}`);res.json({status:'ok',symbol,action,volume,result:{venue,status:'paper',routed:true}});});
app.listen(PORT,()=>{console.log(`Running on ${PORT}`);});
