'use strict';

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const DB = require('../util/queries');
const UID = require('../util/generateUid');
const serverInfo = require('../server_conf');
const regExp = require('../regExp');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const authMiddleware = require('../util/authMiddleware');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

//search account info
router.route('/searchId')
  .get((req,res)=>{
    res.render('accounts/search/searchId');
  })

  .post((req,res,next)=>{
    try{
      if(req.body.method =='email'){
        DB.getInfoByValue("USERS","EMAIL",req.body.value,(err,result,resCount)=>{
        if(err)
          return res.status(500).send();
        else if(resCount<1){
          return res.status(404).send();
        }
        else {
          let respond = (result.user_id_pk).slice(0,(result.user_id_pk.length*2/3)) + '***';
          return res.status(200).json(respond);
        }
      })
    }
    else if(req.body.method =='phone'){
      DB.getInfoByValue("USERS","PHONE",req.body.value,(err,result,resCount)=>{
        if(err)
          return res.status(500).send();
        else if(resCount<1){
          return res.status(404).send();
        }
        else {
          let respond = (result.user_id_pk).slice(0,(result.user_id_pk.length*2/3)) + '***';
          return res.status(200).json(respond);
        }
      })
    }
    else
      return res.status(400).send();
    }
    catch(e){
      return res.status(400).send();
    }
  })

router.route('/searchPwd')
  .get((req,res)=>{
    return res.status(200).render('accounts/search/searchPwd');
  })

  .post((req,res,next)=>{
    if(!req.body.userId || !req.body.userEmail){
      return res.status(400).send();
    }
    else {
      let userId = req.body.userId;
      let userEmail = req.body.userEmail;
      let method = 'EMAIL' //only supported email

      DB.ByQuery("SELECT * FROM USERS WHERE USER_ID_PK="+"\'"+userId+"\' AND EMAIL=\'"+userEmail+"\'",(err,user,resCount)=>{
        if(err){
          return res.status(500).send();
        }
        else if(!resCount)
          return res.status(404).send();
        else{
          DB.ByQuery("SELECT * FROM USERS INNER JOIN VERICODE on (USERS.USER_ID_PK=VERICODE.VERICODE_FK1) WHERE USERS.USER_ID_PK="+"\'"+userId+"\' AND USERS.EMAIL=\'"+userEmail+"\'",(err,result,resCount)=>{
            if(err){
              return res.status(500).send();
            }
            else{
              let verifyCode = UID.getUid(32);

              ////////////////////////////////
              //////////mailing info//////////
              ////////////////////////////////

              let transporter = nodemailer.createTransport({
                service : 'gmail',
                auth : {
                  user : serverInfo.emailAccountId,
                  pass : serverInfo.emailAccountPwd
                }
              });
              let mailOptions = {
                from : serverInfo.emailAccountId,
                to : userEmail,
                subject : '???????????????. ??????????????? ????????????????????? ???????????? ?????? ?????? ???????????????.',
                html : "<h1>Hello SmartCity!</h1></p>"+"<h3>???????????????. ??????????????? ????????????????????? ????????? ???????????? ?????? ????????? ???????????????. 15??? ?????? ??????????????????.</h3></p>"+"<h3> ????????? ???????????? ???????????? ???????????? ????????? ??????????????????. ????????? ?????? ?????? ????????? ??????????????? ????????????.</h3>"+
                        "<a href=\'http://"+serverInfo.serverip+serverInfo.serverport+"/accounts/resetPwd?email="+userEmail+"&verifyCode="+verifyCode+"\'>??? ?????? ???????????? ??????????????? ????????? ?????????.</a>"
              };

              ////////////////////////////////
              //////////verifycode info///////
              ////////////////////////////////

              let timeFormatOptions = {
                  year : 'numeric',
                  month : '2-digit',
                  day : '2-digit',
                  hour : '2-digit',
                  minute : '2-digit',
                  second : '2-digit'
              }

              const extendTime = 15; //15 minutes
              let codeExpireTime = new Date();
              codeExpireTime.setMinutes(codeExpireTime.getMinutes()+extendTime);
              codeExpireTime = codeExpireTime.toLocaleString('ko-KR', timeFormatOptions);
              if(resCount){
                DB.ByQuery('UPDATE VERICODE SET VERICODE_FK2=\''+userEmail+'\', VERICODE=\''+verifyCode+'\', METHOD=\'EMAIL\', EXPIRE_TIME=\''+codeExpireTime+'\' WHERE VERICODE_FK1=\''+userId+'\'',(err,result)=>{
                  if(err)
                    return res.status(500).send();
                  else {
                    transporter.sendMail(mailOptions,(err,info)=>{
                      if(err){
                        res.status(500).send();
                      }
                      else {
                        res.status(200).send();
                      }
                    })
                  }
                });
              }
              else{
                DB.ByQuery('INSERT INTO VERICODE(VERICODE_FK1, VERICODE_FK2, VERICODE, METHOD, EXPIRE_TIME) VALUES (\''+userId+'\',\''+userEmail+'\',\''+verifyCode+'\','+'\''+method+'\',\''+codeExpireTime+'\')',(err,result)=>{
                  if(err)
                    return res.status(500).send();
                  else {
                    transporter.sendMail(mailOptions,(err,info)=>{
                      if(err){
                        res.status(500).send();
                      }
                      else {
                        res.status(200).send();
                      }
                    })
                  }
                });
              }
            }
          })
        }
      })
    }
  })

  router.route('/resetPwd')
  .get((req,res,next)=>{
    if(!req.query.email || !req.query.verifyCode)
      return res.status(400).render('error/wrongAccess');
    else{
      let userEmail = req.query.email;
      let verifyCode = req.query.verifyCode;
      DB.ByQuery("SELECT EXPIRE_TIME FROM VERICODE WHERE VERICODE_FK2=\'"+userEmail+"\' AND VERICODE=\'"+verifyCode+"\'",(err,result,resCount)=>{
        if(err){
          return res.status(500).send();
        }
        else if(!resCount){
          return res.status(404).render('error/wrongAccess');
        }
        else{
        let timeFormatOptions = {
          year : 'numeric',
          month : '2-digit',
          day : '2-digit',
          hour : '2-digit',
          minute : '2-digit',
          second : '2-digit'
        }

        let expireTime = (result.rows[0].expire_time).toLocaleString('ko-KR',timeFormatOptions);
        let nowTime = new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toLocaleString('ko-KR',timeFormatOptions);

        if(nowTime>expireTime){
          return res.status(404).render('error/wrongAccess');
        }
        else
          return res.render('accounts/search/resetPwd');
        }
      })
    }
  })

  .post((req,res,next)=>{
    if(!req.body.userPwd || !req.body.userPwdConfirm || !req.body.userEmail || !req.body.verifyCode ){
      return res.status(400).render('error/wrongAccess');
    }

    if(req.body.userPwd != req.body.userPwdConfirm || !regExp.userPwdReg.test(req.body.userPwd))
      return res.status(400).send();

    else{
      let userPwd = req.body.userPwd;
      let userEmail = req.body.userEmail;
      let verifyCode = req.body.verifyCode;

      DB.ByQuery("SELECT EXPIRE_TIME FROM VERICODE WHERE VERICODE_FK2=\'"+userEmail+"\' AND VERICODE=\'"+verifyCode+"\'",(err,result,resCount)=>{
        if(err){
          return res.status(500).send();
        }
        else if(!resCount){
          return res.status(404).send();
        }
        else{
          let timeFormatOptions = {
            year : 'numeric',
            month : '2-digit',
            day : '2-digit',
            hour : '2-digit',
            minute : '2-digit',
            second : '2-digit'
          }

          let expireTime = (result.rows[0].expire_time).toLocaleString('ko-KR',timeFormatOptions);
          let nowTime = new Date(moment().format('YYYY-MM-DD HH:mm:ss')).toLocaleString('ko-KR',timeFormatOptions);
          if(nowTime>expireTime){
            return res.status(404).send();
          }
          else{
            DB.ByQuery("DELETE FROM VERICODE WHERE VERICODE_FK2=\'"+userEmail+"\' AND VERICODE=\'"+verifyCode+"\'",(err,result,resCount)=>{
              if(err)
                return res.status(500).send();
              else if(resCount){
                bcrypt.hash(userPwd, saltRounds, (err, hash)=>{
                  if(err)
                    return res.status(500).send();
                  else{
                    DB.ByQuery("UPDATE USERS SET PASSWORD=\'"+hash+"\' WHERE EMAIL=\'"+userEmail+"\'",(err,result)=>{
                      if(err)
                        return res.status(500).send();
                      else
                        return res.status(200).send();
                      })
                    }
                  })
                }
              else
                return res.status(404).send();
            })
          }
        }
      })
    }
  })

//register account

router.route('/signup/joinAdminMember')
  .get(
    authMiddleware.sessionSystemAdminAuth(),
    (req,res,next)=>{
    DB.ByQuery('SELECT * FROM ROLE',(err,result)=>{
      return res.render('accounts/signup/joinMember',{roles : result.rows});
    })
  })

router.route('/signup/joinMemberStep1')
  .get((req,res)=>{
    return res.render('accounts/signup/agreement');
  })

router.route('/signup/joinMemberStep2')
  .get((req,res,next)=>{
    if(req.query.termsService != 'on'  || req.query.termsPrivacy != 'on')
      return next(createError(400));
    else
      return res.render('accounts/signup/joinUserMember');
  })

router.route('/joinMemberStep3')
  .get((req,res)=>{
    return res.render('signup/complete');
})



router.route('/Users')
  .get(authMiddleware.hasAdminToken(),(req,res,next)=>{
    try{
      DB.ByQuery("SELECT * FROM USERS WHERE role = 'Marketplace_User' OR role = 'Analytics_User'",(err,result)=>{
        if(err)
          return res.status(500).json;
        else{
          return res.status(200).json({
            result
          })
        }
      })
    }
    catch(e){
      return res.status(400).send();
    }
  })

router.route('/sysUsers')
  .get(authMiddleware.hasAdminToken(),(req,res,next)=>{
    try{
      DB.ByQuery("SELECT * FROM USERS WHERE role !='Marketplace_User' AND role != 'Analytics_User'",(err,result)=>{
        if(err)
          return res.status(500).json;
        else{
          return res.status(200).json({
            result
          })
        }
      })
    }
    catch(e){
      return res.status(400).send();
    }
  })

router.route('/roles')
  .get(authMiddleware.hasAdminToken(),(req,res,next)=>{
    DB.ByQuery('SELECT * FROM ROLE',(err,roles)=>{
      if(err)
        return next(createError(500));
      else
        return res.status(200).json({
          roles
        })
      });
    })

router.route('/roles/registration')
  .get(
    authMiddleware.sessionSystemAdminAuth(),
    (req,res)=>{
        return res.render('users/role/roleInfo',{roleInfo : null});
  })

router.route('/roles/:roleId')
  .get(authMiddleware.sessionSystemAdminAuth(),(req,res,next)=>{
    DB.ByQuery('SELECT * FROM ROLE WHERE ROLE_ID_PK=\''+ req.params.roleId+'\'',(err,roles)=>{
      if(err)
        return next(createError(500));
      else
        return res.render('users/role/roleInfo',{ roleInfo : roles.rows[0] });
    });
  })

module.exports = router;