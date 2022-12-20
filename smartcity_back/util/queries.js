"use strict";

const pg = require("pg");
var UID = require("./generateUid");
const serverInfo = require("../server_conf.json");
/**
 @param {String} qry
 @api private
*/

//postgreSQL setup

const config = {
  user: serverInfo.dbUserId,
  host: serverInfo.dbHost,
  database: serverInfo.dbName,
  password: serverInfo.dbUserPwd,
  port: serverInfo.dbPort,
};

const client = new pg.Client(config);

client.connect((err) => {
  if (err) {
    throw err;
  } else {
  }
});

module.exports = {
  _ByQuery: (query, param) => {
    return new Promise((resolve, reject) => {
      client.query(query, param, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
        return res;
      });
    });
  },
  ByQuery: (query, cb) => {
    client.query(query, (err, res) => {
      if (err) {
        cb(err, null);
      } else cb(null, res, res.rowCount);
    });
  },
  getCountByValue: (table, column, value, cb) => {
    client.query(
      "SELECT COUNT(*) FROM " + table + " WHERE " + column + "=$1",
      [value],
      (err, res) => {
        if (err) cb(err, null);
        else cb(null, res.rows[0].count);
      }
    );
  },
  getUserlist: (table, cb) => {
    client.query(
      "SELECT user_id_pk as userId, nickname, name, email, phone  FROM " +
        table,
      (err, res) => {
        if (err) cb(err, null);
        else cb(null, res.rows, res.rowCount);
      }
    );
  },
  getInfoByValue: (table, column, value, cb) => {
    client.query(
      "SELECT * FROM " + table + " WHERE " + column + "=$1",
      [escape(value)],
      (err, res) => {
        try {
          if (err) cb(err, null);
          if (res.rowCount == 1) {
            cb(null, res.rows[0], res.rowCount);
          } else cb(null, res.rows, res.rowCount);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  getAppList: (value, cb) => {
    client.query(
      "SELECT * FROM APPLICATION WHERE APPLICATION_FK1=$1",
      [escape(value)],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else cb(null, res.rows);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  getUserInfo: (table, column, value, cb) => {
    client.query(
      "SELECT user_id_pk, nickname, name, email, phone,role FROM " +
        table +
        " WHERE " +
        column +
        "=$1",
      [value],
      (err, res) => {
        if (err) cb(err, null);
        else cb(null, res.rows[0]);
      }
    );
  },
  getToken: (appId, userId, cb) => {
    client.query(
      "SELECT * FROM TOKEN WHERE TOKEN_FK1=($1) AND TOKEN_FK2=($2)",
      [appId, userId],
      (err, res) => {
        if (err) cb(err, null);
        else if (!res.rowCount) {
          cb(null, false);
        } else cb(null, res.rows[0]);
      }
    );
  },
  getRefreshToken: (appId, refresh_token, cb) => {
    client.query(
      "SELECT * FROM TOKEN WHERE TOKEN_FK1=($1) AND REFRESH_TOKEN=($2)",
      [appId, refresh_token],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else cb(null, res.rows[0], res.rowCount);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  getCodeById: (table, column1, column2, value1, value2, cb) => {
    client.query(
      "SELECT * FROM " +
        table +
        " WHERE " +
        column1 +
        "=$1 AND " +
        column2 +
        "=$2",
      [value1, value2],
      (err, res) => {
        if (err) cb(err, null);
        else cb(null, res.rows[0]);
      }
    );
  },
  getClientsByValue: (table, column, value, cb) => {
    client.query(
      "SELECT * FROM " + table + " WHERE " + column + "=($1)",
      [value],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else {
            cb(null, res.rows, res.rowCount);
          }
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  getMapInfo: (appId, userId, cb) => {
    client.query(
      "SELECT * FROM USER_APP_MAP WHERE USER_APP_MAP_FK1=($1) AND USER_APP_MAP_FK2=($2)",
      [appId, userId],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else cb(null, res.rows, res.rowCount);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  getKeyStore: (userId, cb) => {
    client.query(
      "SELECT USERS.USER_ID_PK, USERS.ROLE, PUB_KEY, PRI_KEY \
      FROM USERS LEFT JOIN KEYSTORE ON USERS.USER_ID_PK = KEYSTORE.USER_ID_PK WHERE USERS.USER_ID_PK =($1)",
      [userId],
      (err, res) => {
        try {
          if (err) {
            cb(err, null);
          } else {
            cb(null, res.rows[0], res.rowCount);
          }
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  getConvertKeyStore: (userId, cb) => {
    client.query(
      `SELECT USERS.USER_ID_PK, USERS.ROLE, PUB_KEY, CONVERT_FROM(DECRYPT(DECODE(SUBSTRING(PRI_KEY, 3), 'hex'), '${userId}', 'aes') ,'utf8')
      FROM USERS LEFT JOIN KEYSTORE ON USERS.USER_ID_PK = KEYSTORE.USER_ID_PK WHERE USERS.USER_ID_PK = '${userId}'`,
      [],
      (err, res) => {
        try {
          if (err) {
            cb(err, null);
          } else {
            cb(null, res.rows[0], res.rowCount);
          }
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  insertKey: (req, cb) => {
    client.query(
      "INSERT INTO KEYSTORE(USER_ID_PK, PUB_KEY, PRI_KEY) \
      VALUES ($1, $2, $3)",
      [req.userId, req.pub_key, req.pri_key],
      (err, res) => {
        try {
          if (err) cb(err, false);
          else cb(null, true);
        } catch (e) {
          cb(err, false);
        }
      }
    );
  },
  insertConvertKey: (req, cb) => {
    client.query(
      "INSERT INTO KEYSTORE(USER_ID_PK, PUB_KEY, PRI_KEY) \
      VALUES ($1, $2, ENCRYPT($3, $1, $4))",
      [req.userId, req.pub_key, req.pri_key, "aes"],
      (err, res) => {
        try {
          if (err) cb(err, false);
          else cb(null, true);
        } catch (e) {
          cb(err, false);
        }
      }
    );
  },
  insertUser: (req, cb) => {
    client.query(
      "INSERT INTO USERS(USER_ID_PK, PASSWORD, NICKNAME, NAME,\
      PHONE, EMAIL, EMAIL_VERIFY, ROLE, USER_STATE) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        req.userId,
        req.userPwd,
        req.userNickname,
        req.userName,
        req.userPhone,
        req.userEmail,
        false,
        "Marketplace_User",
        "A",
      ],
      (err, res) => {
        try {
          if (err) cb(err, false);
          else cb(null, true);
        } catch (e) {
          cb(err, false);
        }
      }
    );
  },
  insertAdminUser: (req, cb) => {
    client.query(
      "INSERT INTO USERS(USER_ID_PK, PASSWORD, NICKNAME, NAME,\
      PHONE, EMAIL, EMAIL_VERIFY, ROLE, USER_STATE) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [
        req.userId,
        req.userPwd,
        req.userNickname,
        req.userName,
        req.userPhone,
        req.userEmail,
        false,
        req.userRole,
        "A",
      ],
      (err, res) => {
        try {
          if (err) cb(err, false);
          else cb(null, true);
        } catch (e) {
          cb(err, false);
        }
      }
    );
  },
  insertRole: (req, cb) => {
    client.query(
      "INSERT INTO ROLE(ROLE_ID_PK, ROLE_NAME, ROLE_TYPE, DESCRIPTION) VALUES ($1,$2,$3,$4)",
      [req.roleId, req.roleName, req.roleType, req.roleDesc],
      (err, res) => {
        // ing...
        try {
          if (err) cb(err, false);
          else cb(null, true);
        } catch (e) {
          cb(err, false);
        }
      }
    );
  },
  insertMapinfo: (clientId, userId, cb) => {
    let userNum = UID.getUid(10);
    client.query(
      "INSERT INTO USER_APP_MAP(USER_APP_MAP_FK1, USER_APP_MAP_FK2, USER_NUMBER, IS_AUTHORIZED) VALUES ($1,$2,$3,$4)",
      [clientId, userId, userNum, "t"],
      (err, res) => {
        try {
          if (err) cb(err, false);
          else cb(null, true);
        } catch (e) {
          cb(err, false);
        }
      }
    );
  },
  insertClient: (req, cb) => {
    client.query(
      "INSERT INTO APPLICATION(APPLICATION_ID_PK, APPLICATION_FK1, APPLICATION_NAME, APPLICATION_SECRET, REDIRECT_URI, SCOPE, IS_TRUSTED) VALUES\
    ($1,$2,$3,$4,$5,$6,$7)",
      [
        req.applicationId,
        req.application_fk1,
        req.applicationName,
        req.applicationSecret,
        req.redirectUri,
        req.scope,
        req.isTrusted,
      ],
      (err, res) => {
        try {
          if (err) cb(err, false);
          else cb(null, true);
        } catch (e) {
          cb(err, false);
        }
      }
    );
  },
  insertAuthCode: (req, cb) => {
    client.query(
      "INSERT INTO AUTHCODE(AUTHCODE_FK1, AUTHCODE_FK2, CODE, REDIRECT_URI) VALUES\
      ($1,$2,$3,$4)",
      [req.clientId, req.userId, req.code, req.redirectUri],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else cb(null, req.code);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  insertToken: (req, cb) => {
    client.query(
      "INSERT INTO TOKEN(TOKEN_FK1, TOKEN_FK2, TOKEN, ISSUED_AT, REFRESH_TOKEN, EXPIRE_TIME, REXPIRE_TIME) VALUES\
      ($1,$2,$3,$4,$5,$6,$7)",
      [
        req.token_fk1,
        req.token_fk2,
        req.token,
        req.issued_at,
        req.refresh_token,
        req.expire_time,
        req.rexpire_time,
      ],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else cb(null, req.token);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  insertTokenforRefresh: (req, cb) => {
    client.query(
      "UPDATE TOKEN SET TOKEN=($1), ISSUED_AT=($2), EXPIRE_TIME=($3) WHERE REFRESH_TOKEN=($4)",
      [req.token, req.issued_at, req.expire_time, req.refreshToken],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else cb(null, req.token);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  deleteInfoByValue: (table, column, value, cb) => {
    client.query(
      "DELETE FROM " + table + " WHERE " + column + "=$1",
      [value],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else cb(null, res);
        } catch (e) {
          cb(err, null);
        }
      }
    );
  },
  deleteAuthCode: (appId, userId, cb) => {
    client.query(
      "DELETE FROM AUTHCODE WHERE AUTHCODE_FK1=($1) AND AUTHCODE_FK2=($2)",
      [escape(appId), escape(userId)],
      (err, res) => {
        try {
          if (err) cb(err, null);
          else if (!res.rowCount) cb(null, false);
          else cb(null, true);
        } catch (e) {
          cb(e, null);
        }
      }
    );
  },
  deleteToken: (appId, userId, cb) => {
    client.query(
      "DELETE FROM TOKEN WHERE TOKEN_FK1=($1) AND TOKEN_FK2=($2)",
      [appId, userId],
      (err, res) => {
        if (err) cb(err, null);
        else if (!res.rowCount) {
          cb(null, false);
        } else cb(null, true);
      }
    );
  },
  deleteClientToken: (appId, cb) => {
    client.query(
      "DELETE FROM TOKEN WHERE TOKEN_FK1=($1) AND TOKEN_FK2 IS NULL",
      [appId],
      (err, res) => {
        if (err) cb(err, null);
        else if (!res.rowCount) {
          cb(null, false);
        } else cb(null, true);
      }
    );
  },
  deleteSession: (id, cb) => {
    client.query(
      "DELETE FROM SESSION WHERE sess->'passport'->>'user'='" + id + "'",
      (err, res) => {
        if (err) {
          cb(err, null);
        } else if (!res.rowCount) {
          cb(null, false);
        } else cb(null, true);
      }
    );
  },
  updateUserPassword: (param, code, cb) => {
    //supported email-verification only
    client.query(
      "UPDATE USERS SET PASSWORD=($1) WHERE EMAIL=($2)",
      [],
      (err, res) => {}
    );
  },
};
