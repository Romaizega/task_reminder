const express = require('express');
const router = express.Router();
require('dotenv').config();

router.get("/chat-ids", (req, res) => {
  const chatIds = [
    { name: "Empty", id: process.env.TG_ID_LEV },
    { name: "Roman", id: process.env.TG_ID_ROMAN },
    { name: "Tatiana", id: process.env.TG_ID_TATIANA },
    { name: "Lev", id: process.env.TG_ID_LEV },
    { name: "Leonid", id: process.env.TG_ID_LEONID },

  ];
  res.json(chatIds);
});

module.exports = router;