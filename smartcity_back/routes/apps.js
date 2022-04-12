'use strict';

const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const login = require('connect-ensure-login');
const DB = require('../util/queries');
const jwt = require('../JWT/jwt_function');
const authMiddleware = require('../util/authMiddleware');
const isSystemAdmin = require('../util/isSystemAdmin');
const isAdmin = require('../util/isAdmin');

router.route('/registration')
  .get(login.ensureLoggedIn(),(req,res)=>{
    return res.render('apps/appRegistration');
  })

router.route('/sysClients')
  .get(authMiddleware.hasAdminToken(),(req,res,next)=>{
    DB.ByQuery('SELECT * FROM APPLICATION',(err,apps)=>{
      if(err)
        return next(createError(500));
      else
        return res.status(200).json({
          apps
        })
  });
})


router.route('/clients')
  .get(authMiddleware.hasOwnToken(), async (req,res,next)=>{
    let user = await jwt.decode(req.headers.authorization.split(' ')[1], req.cookies.userId);
    user = user.payload;
    DB.getClientsByValue('APPLICATION','APPLICATION_FK1',user.userId,(err,apps)=>{
      return res.status(200).json({
        apps
      })
    });
  })

router.route('/:applicationId')
  .get(authMiddleware.sessionAuth(),(req,res,next)=>{
    try{
      DB.getClientsByValue('APPLICATION','APPLICATION_ID_PK',req.params.applicationId,(err1, app, appCnt)=>{
        DB.getClientsByValue('APPLICATION','APPLICATION_ID_PK',req.params.applicationId,(err2, sysApp, sysCnt)=>{
          if(err1 || err2){
            return next(createError(500));
          }
          else if(appCnt || sysCnt){
            let targetApp;
            let isSysApp;
            appCnt ? targetApp = app[0] : targetApp = sysApp[0];
            appCnt ? isSysApp = false : isSysApp = true;
            isSystemAdmin.session(req.user,(err,isSystemAdmin)=>{
              if(err)
                return next(createError(500));
              else if(!isSystemAdmin && req.user.user_id_pk != targetApp.application_fk1){
                return next(createError(403));
              }
              else{
                let application = {
                  applicationId : targetApp.application_id_pk,
                  applicationSecret : targetApp.application_secret,
                  applicationName : targetApp.application_name,
                  redirectUri : targetApp.redirect_uri,
                  scope : targetApp.scope,
                  applicationOwner : targetApp.application_fk1
                }
                return res.render('apps/appDetail',{ isSysApp : isSysApp, appInfo:application });
              }
            })
          }
          else{
            return next(createError(404));
          }
        })
      })
    }
    catch(e){
      return res.status(400).send();
    }
  })


module.exports = router;