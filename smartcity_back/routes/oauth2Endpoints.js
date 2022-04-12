const express = require('express');
const router = express.Router();
const oauth2 = require('./oauth2');
const path = require('path');
router.use(express.static(path.join(__dirname, '../public')));

router.get('/authorize',
  (req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.returnUrl = req.originalUrl;
      req.session.save(()=>{
        next();
      });
    }
    else
      next();
  },oauth2.authorization);
router.post('/decision', oauth2.decision);
router.post('/token', oauth2.token);

module.exports = router;
