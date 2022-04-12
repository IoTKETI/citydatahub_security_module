'use strict';

const pg = require('pg');
const serverInfo = require('../server_conf');

//postgreSQL setup
const config = {
  host : serverInfo.dbHost,
  database : serverInfo.dbName,
  user : serverInfo.dbUserId,
  password : serverInfo.dbUserPwd,
  port : serverInfo.dbPort
};

const client = new pg.Client(config);

client.connect(err => {
    if (err){
      console.log('Database connection error');
      throw err;
    }
    else {
      console.log('Database connected..');
    }
  });

  var users = (a,b,c,d,e,f,cb)=>{

    client.query('INSERT INTO USERS(USER_ID_PK, PASSWORD, NICKNAME, NAME,\
        PHONE, EMAIL, EMAIL_VERIFY, ROLE, USER_STATE) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [a,b,c,d,e,f, false, 'ma','A'],(err,res)=>{
        });
    }

for(let i =1; i<9; i++){
    
    var userId = 'cityhub0'+String(i);
    var userPwd = userId;
    var userNickname = 'test'+String(i);
    var userName = 'test';
    var userPhonenumber = '01012341234';
    var userEmail = 'test@test.com';
    users(userId, userPwd, userNickname, userName, userPhonenumber, userEmail,(err,res)=>{
        });

}