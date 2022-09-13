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

  // Query for table structure required at project initialization
  let query =
  // CREATE EXTENSION pgcrypto; \
  "DROP TABLE IF EXISTS TOKEN;\
  DROP TABLE IF EXISTS SESSION;\
  DROP TABLE IF EXISTS USER_APP_MAP;\
  DROP TABLE IF EXISTS AUTHCODE;\
  DROP TABLE IF EXISTS APPLICATION;\
  DROP TABLE IF EXISTS KEYSTORE;\
  DROP TABLE IF EXISTS VERIFICATIONTOKEN;\
  DROP TABLE IF EXISTS VERICODE;\
  DROP TABLE IF EXISTS USERS;\
  DROP TABLE IF EXISTS ROLE;\
  CREATE TABLE ROLE(\
  ROLE_ID_PK varchar(8) PRIMARY KEY,\
  ROLE_NAME varchar(30) UNIQUE,\
  ROLE_TYPE varchar(12) NOT NULL,\
  description varchar(100)\
  );\
  CREATE TABLE USERS(\
  USER_ID_PK varchar(20) PRIMARY KEY,\
  PASSWORD varchar(60) not null,\
  NICKNAME varchar(20) UNIQUE not null,\
  NAME varchar(20) not null,\
  PHONE varchar(11) UNIQUE not null,\
  EMAIL varchar(30) UNIQUE not null,\
  EMAIL_VERIFY boolean not null,\
  ROLE varchar(30) not null,\
  USER_STATE varchar(1) not null,\
  CONSTRAINT users_constraint1 FOREIGN KEY(ROLE) REFERENCES ROLE(ROLE_NAME) ON UPDATE CASCADE ON DELETE CASCADE\
  );\
  CREATE TABLE APPLICATION(\
  APPLICATION_ID_PK varchar(20) PRIMARY KEY,\
  APPLICATION_FK1 varchar(20) not null,\
  APPLICATION_NAME varchar(30) not null,\
  APPLICATION_SECRET varchar(32) not null,\
  REDIRECT_URI varchar(200) not null,\
  SCOPE varchar(100) not null,\
  IS_TRUSTED boolean not null,\
  CONSTRAINT application_constraint1 FOREIGN KEY(APPLICATION_FK1) REFERENCES USERS(USER_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE\
  );\
  CREATE TABLE VERICODE(\
  VERICODE_FK1 varchar(20) not null,\
  VERICODE_FK2 varchar(30) not null,\
  VERICODE varchar(32) not null,\
  METHOD varchar(5) not null,\
  EXPIRE_TIME timestamp(0) NOT NULL,\
  CONSTRAINT vericode_constraint1 FOREIGN KEY(VERICODE_FK1) REFERENCES USERS(USER_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE\
  );\
  CREATE TABLE USER_APP_MAP(\
  USER_APP_MAP_FK1 varchar(20) not null,\
  USER_APP_MAP_FK2 varchar(20) not null,\
  USER_NUMBER varchar(10) not null,\
  IS_AUTHORIZED boolean not null,\
  CONSTRAINT user_app_map_constraint1 FOREIGN KEY(USER_APP_MAP_FK1) REFERENCES APPLICATION(APPLICATION_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE,\
  CONSTRAINT user_app_map_constraint2 FOREIGN KEY(USER_APP_MAP_FK2) REFERENCES USERS(USER_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE,\
  CONSTRAINT user_app_map_constraint3 PRIMARY KEY(USER_APP_MAP_FK1,USER_APP_MAP_FK2)\
  );\
  CREATE TABLE TOKEN(\
  TOKEN_FK1 varchar(20) not null,\
  TOKEN_FK2 varchar(20),\
  TOKEN varchar(900) not null,\
  ISSUED_AT varchar(13) not null,\
  REFRESH_TOKEN varchar(128),\
  EXPIRE_TIME varchar(13) not null,\
  REXPIRE_TIME varchar(13),\
  CONSTRAINT token_constraint1 FOREIGN KEY(TOKEN_FK1) REFERENCES APPLICATION(APPLICATION_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE,\
  CONSTRAINT token_constraint2 FOREIGN KEY(TOKEN_FK2) REFERENCES USERS(USER_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE\
  );\
  CREATE TABLE AUTHCODE(\
  AUTHCODE_FK1 varchar(20) not null,\
  AUTHCODE_FK2 varchar(20) not null,\
  CODE varchar(32) not null,\
  REDIRECT_URI varchar(200) not null,\
  CONSTRAINT authcode_constraint1 FOREIGN KEY(AUTHCODE_FK1) REFERENCES APPLICATION(APPLICATION_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE,\
  CONSTRAINT authcode_constraint2 FOREIGN KEY(AUTHCODE_FK2) REFERENCES USERS(USER_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE\
  );\
  CREATE TABLE SESSION(\
  SID varchar NOT NULL,\
  SESS JSON NOT NULL,\
  EXPIRE TIMESTAMP(6) NOT NULL,\
  CONSTRAINT SESSION_CONSTRAINT1 PRIMARY KEY(SID) NOT DEFERRABLE INITIALLY IMMEDIATE\
  )WITH (OIDS=FALSE);\
  CREATE TABLE KEYSTORE(\
  USER_ID_PK varchar(20) PRIMARY KEY,\
  PUB_KEY varchar(500) not null,\
  PRI_KEY varchar(2000) not null,\
  CONSTRAINT keystore_constraint1 FOREIGN KEY(USER_ID_PK) REFERENCES USERS(USER_ID_PK) ON UPDATE CASCADE ON DELETE CASCADE\
  );";

  query += serverInfo.program_type === 'admin' ? "INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('xGvsF8TK','Security_Admin','admin','');\
    INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('4WrRh22n','Service_Admin','admin','');\
    INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('8cH53Cz7','Connectivity_Admin','admin','');\
    INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('9zQhqY9x','Infra_Admin','admin','');\
    INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('TRKjYSeX','Analytics_Admin','admin','');" : 
    "INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('FgV40CZ8','Marketplace_User','general','');\
    INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('2Dda1TZa', 'DataCoreUI_Admin', 'general', '');\
    INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('Ze3eAs7U', 'DataCoreUI_User', 'general', '');\
    INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('MwwoWNJ','Analytics_User','general','');";
  
  query += `INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ('1DSFJ3J8','System_Admin','admin','');
    INSERT INTO USERS(USER_ID_PK, PASSWORD, NICKNAME, NAME, PHONE, EMAIL, EMAIL_VERIFY, ROLE, USER_STATE) VALUES ('admin','$2b$10$tI5pZFK5bosaqUY65LcKzOOgl9cJXg/0tGpvN53X7.BAqk7ttz1uu','admin','admin','01012545678','admin@test.com','f','System_Admin','A');
    INSERT INTO application(application_id_pk, application_fk1,application_name,application_secret,redirect_uri,scope,is_trusted) VALUES ('3eRofhrl6wPWauX2u0GT', 'admin', 'react', 'yFu9svjeJvCY3PLkkpFYF1CvWo7McL7F', '${serverInfo.default_url}', 'read', 't');`

  query += `INSERT INTO USERS(USER_ID_PK, PASSWORD, NICKNAME, NAME, PHONE, EMAIL, EMAIL_VERIFY, ROLE, USER_STATE) VALUES ('coreadmin','$2b$10$tI5pZFK5bosaqUY65LcKzOOgl9cJXg/0tGpvN53X7.BAqk7ttz1uu','coreadmin','coreadmin','01012545679','admin1@test.com','f','DataCoreUI_Admin','A');`
  query += `INSERT INTO USERS(USER_ID_PK, PASSWORD, NICKNAME, NAME, PHONE, EMAIL, EMAIL_VERIFY, ROLE, USER_STATE) VALUES ('coreuser','$2b$10$tI5pZFK5bosaqUY65LcKzOOgl9cJXg/0tGpvN53X7.BAqk7ttz1uu','coreuser','coreuser','01012545670','user@test.com','f','DataCoreUI_User','A');`
  // query += `INSERT INTO application(application_id_pk, application_fk1,application_name,application_secret,redirect_uri,scope,is_trusted) VALUES ('3eRofhrl6wPWauX2u0GT', 'admin', 'react', 'yFu9svjeJvCY3PLkkpFYF1CvWo7McL7F', '${serverInfo.default_url}', 'read', 't');`
  

    client.query(query,(err, res)=>{
        if(err)console.log(err);
        else console.log('Success!');
});