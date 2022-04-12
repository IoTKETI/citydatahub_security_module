'use strict';

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const login = require('connect-ensure-login');
const DB = require('../util/queries');
const authMiddleware = require('../util/authMiddleware');
const isSystemAdmin = require('../util/isSystemAdmin');
const isAdmin = require('../util/isAdmin');

router.route('/:userId')
  .get(login.ensureLoggedIn(),(req,res,next)=>{
  console.log('admin');
  try{
    isSystemAdmin.session(req.user,(err,isSystemAdmin)=>{
    if(err)
      return next(createError(500));
    else if(!isSystemAdmin && req.user.user_id_pk != req.params.userId){
      return next(createError(403));
    }
    else{ // TODO : Delete one
      if(req.query.aType == 'true'){
        DB.getInfoByValue('USERS','USER_ID_PK',req.params.userId,(err,result)=>{
          if(err)
            return next(createError(500));
          else{
            let user = new Object;
            user.userId = result.user_id_pk;
            user.nickname = result.nickname;
            user.userName = result.name;
            user.userEmail = result.email;
            user.userPhone = result.phone;
            user.userRole = result.role;
            return res.render('users/userInfo',{ isSystemAdmin : isSystemAdmin, userInfo: user});
          }
        })
      }
      else{
        DB.getInfoByValue('USERS','USER_ID_PK',req.params.userId,(err,result)=>{
          if(err)
            return next(createError(500));
          else{
            let user = new Object;
            user.userId = result.user_id_pk;
            user.nickname = result.nickname;
            user.userName = result.name;
            user.userEmail = result.email;
            user.userPhone = result.phone;
            user.userRole = result.role;
            return res.render('users/userInfo',{ isSystemAdmin : isSystemAdmin, userInfo: user});
          }
        })
      }
    }
  })
}
  catch(e){
    return next(createError(400));
  }
})

router.route('/:userId/changePwd')
  .get(login.ensureLoggedIn(),(req,res,next)=>{
    try{
      isSystemAdmin.session(req.user,(err,isSystemAdmin)=>{
        if(err)
          return next(createError(500));
        else if(!isSystemAdmin && req.user.user_id_pk != req.params.userId){
          return next(createError(403));
        }
        else
          return res.status(200).render('users/changePwd',{isSystemAdmin : isSystemAdmin, userId : req.params.userId});
      })
    }
    catch(e){
      return next(createError(400));
    }
  })

module.exports = router;
