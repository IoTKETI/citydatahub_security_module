'use strict';

const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const login = require('connect-ensure-login');

//using jwt
router.route('/pmain')
  .get((req,res)=>{
    return res.send('this is main');
  })

router.route('/')
  .get((req,res)=>{
    return res.redirect('/main');
  })
router.route('/main')
  .get(login.ensureLoggedIn(),(req,res)=>{
    let isSystemAdmin;
    req.user.role == 'System_Admin' ? isSystemAdmin = true : isSystemAdmin = false
    return res.render('index',{ userId : req.user.user_id_pk, nickname : req.user.nickname, isSystemAdmin : isSystemAdmin });
  })

router.route('/login')
  .get((req,res,next)=>{
    return res.render('login');
  })

module.exports = router;