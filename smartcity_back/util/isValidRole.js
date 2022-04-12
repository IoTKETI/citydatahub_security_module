'use strict'
const DB = require('./queries');

module.exports = (role,cb)=>{
  DB.ByQuery('SELECT * FROM ROLE',(err,roles)=>{
    if(err)
      return cb(false,null);
    else{
      for(let i in roles.rows){
        if(roles.rows[i].role_id_pk == role){
          return cb(true,roles.rows[i].role_name);
        }
      }
      return cb(false,null);
    }
  });
}