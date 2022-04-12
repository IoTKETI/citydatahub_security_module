'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const DB = require('../util/queries');
const bcrypt = require('bcrypt');



passport.serializeUser((user, done)=>{
  return done(null, user.user_id_pk);
});

passport.deserializeUser((user_id_pk, done) => {
  DB.getInfoByValue('USERS', 'USER_ID_PK', user_id_pk, (err, user)=>{
    if(err){
      return done(err);
    }
    return done(err, user);
  });
});

passport.use('login', new LocalStrategy({
  usernameField : 'loginId',
  passwordField : 'loginPwd',
  passReqToCallback : true
  },
  function(req, loginId, loginPwd, done){
    DB.getInfoByValue('USERS', 'USER_ID_PK', loginId, (err, user)=>{
      if(err){
        console.log(err);
        return done(err);
      }
      if(!user){
        console.log('!user');
        return done(null, false);
      }
      bcrypt.compare(loginPwd, user.password, function(err, result){
        if(!result){
          return done(null, false);
        }
        else
        {
          return done(null, user);
        }
      });
    });
  }
));

function verifyClient(clientId, clientSecret, done) {
  DB.getInfoByValue('APPLICATION','APPLICATION_ID_PK', clientId,(err,client)=>{
    if(err)
      return done(err);
    if(!client)
      return done(null, false);
    if(client.application_secret !== clientSecret){
      return done(null, false);
    }
    return done(null, client);
  });
}

passport.use(new BasicStrategy(verifyClient));
passport.use(new ClientPasswordStrategy(verifyClient));