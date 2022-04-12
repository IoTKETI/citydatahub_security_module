'use strict'

const DB = require('../util/queries');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

setInterval(()=>{
  DB.ByQuery("DELETE FROM VERICODE WHERE EXPIRE_TIME < NOW()", (err)=>{
    
  })
}, 15 * 60 * 1000); //15min