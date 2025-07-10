const express = require('express');
const app = express();

require('dotenv').config();
app.use(express.json());

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
  console.log(`The server running on ${PORT}`);
})

app.get("/api", (req, res)=>{
  res.send("API TEST")
})