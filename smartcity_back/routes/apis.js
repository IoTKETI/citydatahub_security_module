'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const { readFileSync } = require('fs');
const DB = require('../util/queries');
const jwt = require('../JWT/jwt_function');
const UID = require('../util/generateUid');
const authMiddleware = require('../util/authMiddleware');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const msg = require('../Msg.json');
const regExp = require('../regExp');
const isValidRole = require('../util/isValidRole');
const isSystemAdmin = require('../util/isSystemAdmin');
const {logger} = require("../util/logger");

router.use(express.static(path.join(__dirname, '../public')));

router.route('/applications')
  .post(authMiddleware.hasOwnToken(), async (req,res,next)=>{ //create   // --- SEC-03
    try{
      let clientId = UID.getUid(20); 
      let clientSecret = UID.getUid(32);
      let scope = 'read';
      let trust;
      let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
      user = user.payload;
      if(user.role.indexOf("Admin")!==-1){
        trust = 't';
      } else {
        trust = 'f';
      }
      if(regExp.charCntReg.test(req.body.applicationName) || !regExp.appNameReg.test(req.body.applicationName) || !regExp.urlReg.test(req.body.redirectUri)){
        logger.error(`[/applications][appName|redirectUri check] 400 Error ${msg.errormsg.appUriFormat.description}`)
        return res.status(400).send(msg.errormsg.appUriFormat);
      }

      if(req.body.redirectUri[req.body.redirectUri.length-1]=='/'){
        req.body.redirectUri = req.body.redirectUri.substring(0,req.body.redirectUri.length-1);
      }

      let clientInfo = {
        'applicationId' : clientId,
        'applicationSecret' : clientSecret,
        'application_fk1' : user.userId,
        'applicationName': req.body.applicationName,
        'redirectUri' : req.body.redirectUri,
        'scope' : scope,
        'isTrusted' : trust
      };

      DB.insertClient(clientInfo, (err, result)=>{
        if(err){
          logger.error(`[/applications][insertClient] 500 Error ${err.message}`)
          return res.status(500).json(msg.errormsg.dbError);
        }
        else {
          return res.status(200).json({
            appId : clientId,
            appSec : clientSecret
          })
        }
      });
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  }).get(authMiddleware.hasOwnToken(), async (req,res,next)=>{
    let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
    user = user.payload;
    if(user.role!="System_Admin"){
    DB.getClientsByValue('APPLICATION','APPLICATION_FK1',user.userId,(err,apps)=>{
      	return res.status(200).json({
        apps
      })
    });
  }else{
DB.ByQuery('SELECT * FROM APPLICATION',(err,apps)=>{
      if(err){
        logger.error(`[/applications][ByQuery] Method:get 500 Error ${err.message}`)
        return next(createError(500));
      }
      else
        return res.status(200).json({
          apps
        })
  });
}})

router.route('/applications/:applicationId')
  .get(authMiddleware.hasOwnToken(), async (req,res,next)=>{ //retrieve // --- SEC-05
    try{
      let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
      user = user.payload;
      DB.getInfoByValue('APPLICATION','APPLICATION_ID_PK',req.params.applicationId,(err,result,Cnt)=>{
        if(err){
          logger.error(`[/applications/:applicationId][getInfoByValue] 500 Error ${msg.errormsg.dbError.description}`)
          return res.status(500).json(msg.errormsg.dbError);
        }
        else if(result.application_fk1 != user.userId){
          logger.error(`[/applications/:applicationId][getInfoByValue] 403 Error ${msg.errormsg.appIdCheck.description}`)
          return res.status(403).json(msg.errormsg.appIdCheck);
        }
        else{
          let application = {
            applicationId : result.application_id_pk,
            applicationSecret : result.application_secret,
            applicationName : result.application_name,
            redirectUri : result.redirect_uri,
            scope : result.scope,
            applicationOwner : result.application_fk1
          }
          return res.status(200).json(application);
        }
      });
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })
  .patch(authMiddleware.hasOwnToken(), async (req,res,next)=>{
    try{
      let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
      user = user.payload;
      DB.getInfoByValue('APPLICATION','APPLICATION_ID_PK',req.params.applicationId,(err,result,Cnt)=>{
      if(err){
        logger.error(`[/applications/:applicationId][getInfoByValue] 500 Error ${msg.errormsg.dbError.description}`)
        return res.status(500).json(msg.errormsg.dbError);
      }
      else if(result.application_fk1 != user.userId){
        logger.error(`[/applications/:applicationId][getInfoByValue] 403 Error ${msg.errormsg.appIdCheck.description}`)
        return res.status(403).json(msg.errormsg.appIdCheck);
      }})

      let query = "UPDATE APPLICATION SET ";
      if(req.body.applicationName && req.body.redirectUri)
        query+=("application_name =\'" + req.body.applicationName+ "\'"+",redirect_uri= \'"+req.body.redirectUri+"\'");
      else if(req.body.applicationName)
        query+=("application_name =\'"+req.body.applicationName+"\'");
      else if(req.body.redirectUri)
        query+=("redirect_uri= \'"+req.body.redirectUri+"\'");
      query+=' where application_id_pk =\''+req.params.applicationId+"\'";
      DB.ByQuery(query,(err,result)=>{
        if(err){
          logger.error(`[/applications/:applicationId][ByQuery] Method:patch 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else{
          return res.status(200).send();
        }
      })
    }catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

  .delete(authMiddleware.hasOwnToken(), async (req,res,next)=>{ // --- SEC-07
    try{
      let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
      user = user.payload;
      let query;
      if(user.role=='System_Admin')
      {
        query = "DELETE FROM APPLICATION WHERE APPLICATION_ID_PK=\'"+req.params.applicationId+"\'";
      }
      else
      {
        query="DELETE FROM APPLICATION WHERE APPLICATION_ID_PK=\'"+req.params.applicationId+"\' AND APPLICATION_FK1=\'"+user.userId+"\'";
      }
      DB.ByQuery(query,(err,result)=>{
        if(err){
          logger.error(`[/applications/:applicationId][ByQuery] Method:delete 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else
          return res.status(200).send();
      })
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

router.route('/user')
  .get(authMiddleware.hasOwnToken(), async (req,res,next)=>{
    try{
      let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
      DB.getInfoByValue('USERS','USER_ID_PK',user.payload.userId,(err, userInfo, cnt)=>{
        if(err){
          logger.error(`[/user][getInfoByValue] 500 Error ${msg.errormsg.dbError.description}`)
          return res.status(500).json(msg.errormsg.dbError);
        }
        else if(!cnt){
          logger.error(`[/user][getInfoByValue] 404 Error ${msg.errormsg.notExistUser.description}`)
          return res.status(404).json(msg.errormsg.notExistUser);
        }
        else{
          let user = new Object;
          user.userId = userInfo.user_id_pk;
          user.nickname = userInfo.nickname;
          user.name = userInfo.name;
          user.email = userInfo.email;
          user.phone = userInfo.phone;
          return res.status(200).json(user);
        }
      });
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

router.route('/users')
  .post((req,res,next)=>{ //create  // --- SEC-08
    try{
      if(regExp.charCntReg.test(req.body.userId) && regExp.charCntReg.test(req.body.userNickname) && regExp.charCntReg.test(req.body.userName)){
        logger.error(`[/users][userId|Nickname|userName Check] 400 Error ${msg.errormsg.dbError.description}`)
        return res.status(400).send(msg.errormsg.dbError);
      }
      else if(!regExp.userIdReg.test(req.body.userId)){
        logger.error(`[/users][userId Check] 400 Error ${msg.errormsg.joinIdCheck.description}`)
        return res.status(400).send(msg.errormsg.joinIdCheck);
      }
      else if(!regExp.userNicknameReg.test(req.body.userNickname)){
        logger.error(`[/users][userNickname Check] 400 Error ${msg.errormsg.joinNicknameCheck.description}`)
        return res.status(400).send(msg.errormsg.joinNicknameCheck);
      }
      else if(!regExp.userPwdReg.test(req.body.userPwd)){
        logger.error(`[/users][userPwd Check] 400 Error ${msg.errormsg.joinPwCheck.description}`)
        return res.status(400).send(msg.errormsg.joinPwCheck);
      }
      else if(!regExp.userNameReg.test(req.body.userName)){
        logger.error(`[/users][userName Check] 400 Error ${msg.errormsg.joinNameCheck.description}`)
        return res.status(400).send(msg.errormsg.joinNameCheck);
      }
      else if(!regExp.userEmailReg.test(req.body.userEmail)){
        logger.error(`[/users][userEmail Check] 400 Error ${msg.errormsg.joinEmailCheck.description}`)
        return res.status(400).send(msg.errormsg.joinEmailCheck);
      }
      else if(!regExp.userPhoneReg.test(req.body.userPhone)){
        logger.error(`[/users][userPhone Check] 400 Error ${msg.errormsg.joinPhoneCheck.description}`)
        return res.status(400).send(msg.errormsg.joinPhoneCheck);
      }
      else if(req.body.userRole != undefined){
        isValidRole(req.body.userRole,(isValid, role)=>{
          if(!isValid){
            logger.error(`[/users][userRole Check] 400 Error ${msg.errormsg.dbError.description}`)
            return res.status(400).send(msg.errormsg.dbError);
          }
          else{
            req.body.userRole = role;
            bcrypt.hash(req.body.userPwd, saltRounds, function(err, hash){
            if(err){
              logger.error(`[/users][userPwd Check] 500 Error ${err.message}`)
              return res.status(500).send();
            }
            else{
              req.body.userPwd = hash;
              DB.insertAdminUser(req.body, (err, result)=>{
                if(err){
                  logger.error(`[/users][insertAdminUser] 500 Error ${msg.errormsg.existUser.description}`)
                  return res.status(500).json(msg.errormsg.existUser);
                }
                else
                    return res.status(200).json(msg.successmsg.addUser);
              });
            }
          })
        }
      });
    }
    else {
      bcrypt.hash(req.body.userPwd, saltRounds, function(err, hash){
        if(err){
          logger.error(`[/users][userPwd Check] 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else{
          req.body.userPwd = hash;
          DB.insertUser(req.body, (err, result)=>{
            if(err){
              logger.error(`[/users][insertUser] 500 Error ${msg.errormsg.existUser.description}`)
              return res.status(500).json(msg.errormsg.existUser);
            }
            else
              return res.status(200).json(msg.successmsg.addUser);
            });
          }
        })
      }
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

  .get(authMiddleware.hasAdminToken(),(req,res,next)=>{ //retrieve // --- SEC-09
    try{
      DB.getUserlist('USERS', (err,list,count)=>{
        if(err){
          logger.error(`[/users][getUserlist] 500 Error ${msg.errormsg.dbError.description}`)
          return res.status(500).json(msg.errormsg.dbError);
        }
        else{
         
          let userList = new Object;
          userList.totalCount = count;
          for(let i=0; i<count; i++){
            userList[i] = {
              'userId' : list[i].userid,
              'nickname' : list[i].nickname,
              'name' : list[i].name,
              'email' : list[i].email,
              'phone' : list[i].phone
            }
          }
          userList = list
	  
         return res.status(200).json(userList);
        }
      });
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

  router.route('/changePwd/:userId')
    .patch(authMiddleware.hasOwnToken(),(req,res,next)=>{
      let query = "UPDATE users SET ";
      if(!regExp.userPwdReg.test(req.body.userPwd)){
        logger.error(`[/changePwd/:userId][userPwd Check] 400 Error`)
        return res.status(400).send();
      }
      else{
        bcrypt.hash(req.body.userPwd, saltRounds,function(err,hash){
        if(err){
          logger.error(`[/changePwd/:userId][userPwd Check] 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else{
          query+="PASSWORD = \'"+hash+"\'";
          query+=" WHERE user_id_pk = \'"+req.params.userId+"\'";
          DB.ByQuery(query,(err,result)=>{
            if(err){
              logger.error(`[/changePwd/:userId][ByQuery] Method:patch 500 Error ${err.message}`)
              return res.status(500).send();
            }
            else{
              return res.status(200).send();
            }
          })
        }
      })
    }
  });

router.route('/users/:userId')
  .get(authMiddleware.hasOwnToken(), async (req,res,next)=>{ //retrieve  // --- SEC-10
    let payload = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
    payload= payload.payload;
    DB.getUserInfo('USERS', 'USER_ID_PK',req.params.userId,(err, user)=>{
      if(err){
        logger.error(`[/users/:userId][getUserInfo] 500 Error ${msg.errormsg.dbError.description}`)
        return res.status(500).json(msg.errormsg.dbError);
      }
      else if(!user){
        logger.error(`[/users/:userId][getUserInfo] 404 Error ${msg.errormsg.notExistUser.description}`)
        return res.status(404).json(msg.errormsg.notExistUser);
      }
      else{
        let respond = new Object;
        respond.userId = user.user_id_pk;
        respond.nickname = user.nickname;
        respond.name = user.name;
        respond.email = user.email;
        respond.phone = user.phone;
        respond.role = user.role;
        return res.status(200).json(respond);
      }
    });
  })
  .patch(authMiddleware.hasOwnToken(),(req,res,next)=>{
    try{
      var concat = false;
      let query = "UPDATE users SET";
      if(req.body.nickname)
      {
        query+=" nickname=\'"+req.body.nickname+"\'";
        concat = true;
      }
      if(req.body.email)
      {
        if(concat){
          query+=",";
        }
        query+="email=\'"+req.body.email+"\'";
        concat = true;
      }
      if(req.body.phone)
      {
        if(concat)
          query+=",";
        query+="phone=\'"+req.body.phone+"\'";
      }
      query+=" WHERE user_id_pk=\'"+req.params.userId+"\'";
      DB.ByQuery(query,(err,result)=>{
        if(err){
          logger.error(`[/users/:userId][ByQuery] Method:patch 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else if(result.rowCount !==1){
          logger.error(`[/users/:userId][ByQuery] Method:patch 400 Error ${msg.errormsg.updateUserId.description}`)
          return res.status(400).send(msg.errormsg.updateUserId);
        }else
          return res.status(200).send();
      })
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

  .delete(authMiddleware.hasAdminToken(), async (req,res,next)=>{
    try{
      let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
      user = user.payload;
      let query="DELETE FROM USERS WHERE user_id_pk=\'"+req.params.userId+"\'";
      DB.ByQuery(query,(err,result)=>{
        if(err){
          logger.error(`[/users/:userId][ByQuery] Method:delete 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else if(result.rowCount !==1){
          logger.error(`[/users/:userId][ByQuery] Method:delete 400 Error ${msg.errormsg.updateUserId.description}`)
          return res.status(400).send(msg.errormsg.updateUserId);
        }else
          return res.status(200).send();
      })
    }
    catch(e){
      logger.error(e)
      return res.status(404).send();
    }
  })

router.route('/role')
    // .get(authMiddleware.sessionSystemAdminAuth(),(req,res)=>{
  .get((req,res)=>{
    DB.ByQuery('SELECT role_id_pk as roleId, role_name as roleName FROM ROLE',(err,result)=>{
      if(err){
        logger.error(`[/role][ByQuery] Method:get 500 Error ${err.message}`)
        return res.status(500).send();
      }
      else
        return res.status(200).json(result.rows);
    })
  })

  .post(authMiddleware.sessionSystemAdminAuth(),(req,res)=>{
    if(!req.body.roleName || !req.body.roleType){
      logger.error(`[/role][roleName|roleType Check] 400 Error`)
      return res.status(400).send();
    }
    else if(!regExp.roleNameReg.test(req.roleName)){
      logger.error(`[/role][roleName Check] 400 Error`)
      return res.status(400).send();
    }
    else{
      let roleId = UID.getUid(8);
      req.body.roleId = roleId;
      DB.insertRole(req.body,(err,result)=>{
        if(err){
          if(err.code == 23505){
            logger.error(`[/role][insertRole] 409 Error code: ${err.code}`)
            return res.status(409).send();
          }
          else
          logger.error(`[/role][insertRole] 500 Error code: ${err.code}`)
            return res.status(500).send();
        }
        else{
          return res.status(200).send();
        }
      })
    }
  })

router.route('/role/:roleId')
  .patch((req,res,next)=>{
    try{
      let query = "UPDATE ROLE SET ";
      let paramCnt = Object.keys(req.body).length;
      if(paramCnt<1){
        logger.error(`[/role/:roleId][Param Check] 400 Error`)
        return res.status(400).send();
      }
      if(req.body.roleType){
        query += "ROLE_TYPE=\'"+req.body.roleType+"\' ";
        if(--paramCnt>0)
          query += ", ";
      }
      if(req.body.roleName){
        if(!regExp.roleNameReg.test(req.body.roleName)){
          logger.error(`[/role/:roleId][roleName Check] 400 Error`)
          return res.status(400).send();
        }
        query += "ROLE_NAME=\'"+req.body.roleName+"\' ";
        if(--paramCnt>0)
          query += ", ";
      }
      if(req.body.roleDesc=='' || req.body.roleDesc){
        query += "DESCRIPTION=\'"+req.body.roleDesc+"\' ";
        if(--paramCnt>0)
          query += ", ";
      }
      query += "WHERE ROLE_ID_PK=\'"+req.params.roleId+"\'";
      DB.ByQuery(query,(err,result)=>{
        if(err){
          logger.error(`[/role/:roleId][ByQuery] Method:patch 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else
          return res.status(200).send();
      })
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

  .delete(authMiddleware.sessionSystemAdminAuth(),(req,res)=>{
    try{
      let query = "DELETE FROM ROLE WHERE ROLE_ID_PK=\'"+req.params.roleId+"\'";
      DB.ByQuery(query,(err,result)=>{
        if(err){
          logger.error(`[/role/:roleId][ByQuery] Method:delete 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else
          return res.status(200).send();
      })
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })

router.route('/changeRole')
  .post((req,res,next)=>{ //userId, RoleName
    try{
      if(!req.body.userId || !req.body.RoleName){
        logger.error(`[/changeRole][userId|RoleName Check] 400 Error`)
        return res.status(400).send();
      }
      DB.ByQuery("UPDATE USERS SET ROLE=\'"+req.body.RoleName+"\' WHERE USER_ID_PK=\'"+req.body.userId+"\'",(err,result)=>{
        if(err){
          logger.error(`[/changeRole][ByQuery] 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else
          return res.status(200).send();
      })
    }
    catch(e){
      logger.error(e)
      return res.status(400).send();
    }
  })


router.route('/checkInfo')
  .get((req,res)=>{
    try{
      let queryColumn;
      if(!req.query){
        logger.error(`[/checkInfo][error/wrongAccess] 400 Error`)
        return res.status(400).render('error/wrongAccess');
      }
      else if(req.query.type == 'userId'){
        queryColumn = 'USER_ID_PK';
      }
      else if(req.query.type == 'userNickname'){
        queryColumn = 'NICKNAME';
      }
      else if(req.query.type == 'userEmail'){
        queryColumn = 'EMAIL';
      }
      else if(req.query.type == 'userPhone'){
        queryColumn = 'PHONE';
      }
      else if(req.query.type == 'userRole'){
        queryColumn = 'ROLE';
      }
      DB.getInfoByValue("USERS",queryColumn,req.query.value,(err,result,resCount)=>{
        if(err){
          logger.error(`[/checkInfo][getInfoByValue] 500 Error ${err.message}`)
          return res.status(500).send();
        }
        else(resCount)
          return res.status(200).json(resCount);
        })
      }
      catch(e){
        logger.error(e)
        res.status(400).send();
      }
  })

  router.route('/checkRole')
    .get((req,res)=>{
      try{
        let queryColumn;
        if(!req.query){
          logger.error(`[/checkRole][error/wrongAccess] 400 Error `)
          return res.status(400).render('error/wrongAccess');
        }
        DB.getInfoByValue("role","role_name",req.query.value,(err,result,resCount)=>{
          if(err){
            logger.error(`[/checkRole][getInfoByValue] 500 Error ${err.message}`)
            return res.status(500).send();
          }
          else(resCount)
            return res.status(200).json(resCount);
        })
      }
      catch(e){
        logger.error(e)
        res.status(400).send();
      }
    })


router.route('/login')
  .post((req,res,next)=>{
    passport.authenticate('login',(err,user)=>{
      if(err){//DB error
        logger.error(`[/login][DB Error] 500 Error ${err.message}`)
        return next(createError(500));
      }
      else if(!user){ //logion failed
        logger.error(`[/login][DB Error] 400 Error: Logion failed `)
        return res.render('login',{error : '로그인에 실패했습니다.'});
      }
      else{
        let returnUrl = req.session.returnUrl;
        delete req.session.returnUrl;
        delete req.session.authorize;
        req.logIn(user,(err)=>{
          if(err){
            logger.error(`[/login] Error: 400 Logion failed`)
            next(err);
          }
          else{
            if(!returnUrl){
              if(!req.session.returnTo){
                return res.redirect('/');
              }
              else{
                return res.redirect(req.session.returnTo);
              }
            }
            else{
              return res.redirect(returnUrl);
            }
          }
        })
      }
    })(req,res,next);
  })


router.route('/logout') //운영자가 다른 계정 로그아웃시킬 시나리오
  .get((req,res,next)=>{
    try{
      req.session.save(()=>{
        delete req.session.passport;
        delete req.user;
        return res.redirect('/');
      })
    }
    catch(e){
      logger.error(e)
      return res.redirect('/');
    }
  })
  .post(authMiddleware.hasOwnToken(), async (req,res,done)=>{
    try{
      var token_data = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
      token_data = token_data.payload;
      var id = token_data.userId;
      if(token_data.aud!='3eRofhrl6wPWauX2u0GT'){
        let query = "DELETE FROM SESSION WHERE SESS ->'passport'->>'user' like \'"+id+"\'";
        DB.ByQuery(query,(err,result)=>{
          if(err)
          {
            logger.error(`[/logout][ByQuery] 500 Error ${err.message}`)
            return res.status(500).send();
          }
          else{
            DB.deleteToken(token_data.aud,token_data.userId,(err,result)=>{
              if(err){
                logger.error(`[/logout][deleteToken] 500 Error ${err.message}`)
                return res.status(500).json(msg,erromsg.logout);
              }
              else if(!result)
              {
                logger.error(`[/logout][deleteToken] 404 Error ${err.message}`)
                return res.status(404).json();
              }
              else
              {
                return res.status(200).json(msg.successmsg.logout);
              }
            });
          }
        })
      }
    }
    catch(e){
      logger.error(e)
      return res.redirect('/');
    }
    if(!req.body.userId){
      logger.error(`[/logout][userId Check] 400 Error ${msg.errormsg.parameter.description}`)
      return res.status(400).json(msg.errormsg.parameter);
    }
    var token_data = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
    token_data = token_data.payload;

    DB.deleteToken(token_data.aud,token_data.userId,(err,result)=>{
      if(err){
        logger.error(`[/logout][deleteToken] 500 Error ${msg.errormsg.logout.description}`)
        return res.status(500).json(msg.errormsg.logout.description);
      }
      else if(!result)
      {
        logger.error(`[/logout][deleteToken] 404 Error`)
        return res.status(404).json();
      }
      else
      {
        return res.status(200).json(msg.successmsg.logout);
      }
    });
  })

router.get('/publickey',(req,res,next)=>{
  try{
    const publicKey = readFileSync('./keys/public.pem');
    let respond = new Object;
    respond.publickey = publicKey.toString();
    return res.status(200).json(respond);
  }
  catch(e){
    logger.error(e)
    res.status(400).send();
  }
});

module.exports = router;
