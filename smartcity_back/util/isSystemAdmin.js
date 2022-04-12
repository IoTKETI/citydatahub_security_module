'use strict'

const DB = require('./queries');

module.exports = {
  token : ()=>{ // reserve

  },
  session : (user, cb)=>{
    DB.ByQuery("SELECT ROLE_TYPE FROM ROLE WHERE ROLE_NAME=\'"+user.role+"'",(err,result)=>{
      if(err)
        return cb(err, false);
      else{
        if(result.rows[0].role_type =='system')
          return cb(null, true)
        else
          return cb(err, false);
      }
    })
  },
  role : (roleName)=>{

  }

}