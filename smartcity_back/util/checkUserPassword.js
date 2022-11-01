'use strict';

var express = require('express');
var DB = require('../util/queries');
const {logger} = require('../util/logger')

module.exports = ()=>{
  return (req,res,next)=>{
    if(!req.body.loginPwd){
        res.render('check_password');
    }
    else {
      if(req.body.loginPwd == req.user.password){
        next();
      }
      else {
        logger.error(`[checkUserPassword] 401 Error Passwords do not match`)
        return res.status(401).send();
      };
    }
  }
}