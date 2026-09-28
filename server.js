const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let logs = [];

app.get('/', (req,res)=> res.send('Cedars Bridge Online'));
app.get('/status', (req,res)=> res.json({online:true, trading: process.env.TRADING_ENABLED==='true', time: new Date().toISOString(), logs: logs.slice(-5)}));
app.get('/feed', (req,res)=> res.json(logs.slice(-50)));

setInterval(()=>{
  const msg = `${new Date().toISOString()} - DEMO SIGNAL check - NO ORDER (TRADING_ENABLED=${process.env.TRADING_ENABLED})`;
  console.log(msg);
  logs.push(msg);
  if(logs.length>200) logs.shift();
}, 30000);

app.listen(PORT, ()=> console.log(`Listening on ${PORT}`));
