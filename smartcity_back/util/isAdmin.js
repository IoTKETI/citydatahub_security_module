'use strict';

const jwt = require('../JWT/jwt_function');
const jwtOption = require('../JWT/jwt_conf');
const DB = require('./queries');

module.exports = {
  token : (tok)=>{ // reserve

  },
  session : (user)=>{
    DB.ByQuery('SELECT * FROM ROLE',(err,result)=>{
      if(err)
        return false;
      else{
      }
    })
  },
  id : (userId)=>{

  },
    role : (roleName,cb)=>{
      DB.ByQuery("SELECT ROLE_TYPE FROM ROLE WHERE ROLE_NAME='"+roleName+"'",(err,result)=>{
        if(err)
          cb(err, false);
        else{
        }
      })
    }
}