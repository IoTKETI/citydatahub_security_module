'use strict';

var express = require('express');
var DB = require('../util/queries');

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
        return res.status(401).send();
      };
    }
  }
}