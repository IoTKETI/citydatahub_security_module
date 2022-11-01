'use strict';

const msg = require('../Msg.json');
const jwt = require('../JWT/jwt_function');
const jwtOption = require('../JWT/jwt_conf');
const DB = require('./queries');
const util =require('util');
const {logger} = require('./logger');

module.exports = {
  hasOwnToken : ()=>{ // Is it in the DB
    return async (req,res,next)=>{
      if(!req.headers.authorization || !await jwt.verify(req.headers.authorization.split(' ')[1],jwtOption.options)){
        logger.error(`[hasOwnToken] Error ${msg.errormsg.token.description}`)
        res.status(401).json(msg.errormsg.token);
      }
      else {
        const user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);

        DB.getInfoByValue('USERS','USER_ID_PK',user.payload.userId,(err,value,cnt)=>{
          if(err){
            logger.error(`[hasOwnToken][DB Error] Error ${msg.errormsg.dbError.description}`)
            res.status(500).json(msg.errormsg.dbError);
          }
          else if(!cnt){
            logger.error(`[hasOwnToken] Error ${msg.errormsg.unauthorized.description}`)
            res.status(401).json(msg.errormsg.unauthorized);
          }
          else
          {
            next();
          }
        });
      }
    }
  },
  sessionAuth : ()=>{
    return (req,res,next)=>{
      if(!req.user){
        logger.error(`[sessionAuth] Error error/wrongAccess`)
        return res.status(401).render('error/wrongAccess');
        //return res.status(401).send();
      }
      else next(); //필요시 여기서 추가적인 세션 인증가능
    }
  },
  sessionSystemAdminAuth : ()=>{
    return (req,res,next)=>{
      if(!req.user){
        logger.error(`[sessionSystemAdminAuth] Error error/wrongAccess`)
        return res.status(401).render('error/wrongAccess');
        //return res.status(401).send();
      }
      else if(req.user.role !='System_Admin'){
        logger.error(`[sessionSystemAdminAuth] Error userRole Check`)
        return res.status(403).render('error/wrongAccess');
      }
      else next(); //필요시 여기서 추가적인 세션 인증가능
    }
  },
  hasAdminToken : ()=>{
    return async (req,res,next)=>{
      if(!req.headers.authorization || !await jwt.verify(req.headers.authorization.split(' ')[1],jwtOption.options)){
        logger.error(`[hasAdminToken] Error ${msg.errormsg.token.description}`)
        res.status(401).json(msg.errormsg.token);
      }
      else {
        let jwtToken = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
        jwtToken = jwtToken.payload;
        if(jwtToken.type == 'c') return next(); // all clients are treated like admin (N2M)
        DB.getInfoByValue('USERS', 'USER_ID_PK',jwtToken.userId, (err, user, cnt)=>{ // need to add more scenario
          DB.ByQuery("SELECT * FROM ROLE WHERE ROLE_TYPE='admin' OR ROLE_TYPE='system'", (err2, roleTable, cnt2)=>{
            if(err || err2){
              logger.error(`[hasAdminToken][getInfoByValue] Error ${msg.errormsg.dbError.description}`)
              return res.status(500).json(msg.errormsg.dbError);
            }
            else if(!cnt || !cnt2){
              logger.error(`[hasAdminToken][getInfoByValue] Error ${msg.errormsg.unauthorized.description}`)
              return res.status(401).json(msg.errormsg.unauthorized);
            }
            else{
              for(let i=0; i<cnt2; i++){
                if(jwtToken.role == roleTable.rows[i].role_name) return next();
              }
              logger.error(`[hasAdminToken][getInfoByValue] Error ${msg.errormsg.unauthorized.description}`)
              return res.status(403).json(msg.errormsg.unauthorized);
            }
          })
        });
      }
    }
  },
  checkPwd : ()=>{
    return (req,res,next)=>{
      if(!req.body.loginPwd){
        logger.error(`[checkPwd][user/checkPwd] Error Passwords do not match`)
        return res.render('user/checkPwd',{url : req.originalUrl});
      }
      else {
        if(req.body.loginPwd == req.user.password){
          next();
        }
        else {
          logger.error(`[checkPwd][user/checkPwd] Error Passwords do not match`)
          return res.status(403).render('error/wrongAccess');
        };
      }
    }
  }
}