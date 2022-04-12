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

const query ="SELECT \
tc.constraint_name, tc.table_name, kcu.column_name, \
ccu.table_name AS foreign_table_name,\
ccu.column_name AS foreign_column_name FROM \
information_schema.table_constraints AS tc \
JOIN information_schema.key_column_usage AS kcu\
  ON tc.constraint_name = kcu.constraint_name\
JOIN information_schema.constraint_column_usage AS ccu\
  ON ccu.constraint_name = tc.constraint_name\
WHERE constraint_type = 'FOREIGN KEY'";


client.query(query,(err, res)=>{
    if(err)console.log(err);
    else console.log(res);
});