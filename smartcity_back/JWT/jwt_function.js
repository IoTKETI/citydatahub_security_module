'use strict'

const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const jose = require('node-jose');
const type = require('../server_conf.json').token_type;

if(type=='JWE'){
   module.exports = {
      sign: async (payload, $Options) => {
         let publicKEY = fs.readFileSync('./keys/public.pem', 'utf8');
         payload.aud = $Options.aud;
         payload.iss = $Options.iss;
         payload.iat = Math.round(new Date().getTime()/1000);
         payload.exp = Math.round(new Date().getTime()/1000+3600);

         let encryptionKey = await jose.JWK.asKey(publicKEY, "pem", { alg: "RSA-OAEP-256" });

         let contentAlg = "A256GCM";
         let options =
            {
               contentAlg: contentAlg,
               compact: true,
               fields:
                  {

                  }
            };

         const encryptedData = await jose.JWE.createEncrypt(options, encryptionKey).update(JSON.stringify(payload)).final();
         return encryptedData;
      },

      verify: (token, $Options) => {
         return true;
      },

      decode: async (token) => {
         let privateKey = fs.readFileSync('./keys/private.pem', 'utf8');
         let decryptionKey = await jose.JWK.asKey(privateKey, 'pem', { alg: 'RSA-OAEP-256', enc: 'A256GCM' });
         let decryptedData = await jose.JWE.createDecrypt(decryptionKey).decrypt(token);
         decryptedData.payload = JSON.parse(decryptedData.plaintext.toString());
         delete decryptedData.plaintext;
         return decryptedData;
      }

   }

}else if(type=='JWS'){

   module.exports = {
      sign: (payload, $Options) => {
         let privateKEY =  fs.readFileSync('./keys/private.pem','utf8');
         let signOptions = {
            issuer:  $Options.iss,
            audience:  $Options.aud,
            expiresIn:  '1h',
            algorithm:  "RS256"
            //     algorithm:  "HS256"
         };
         return jwt.sign(payload, privateKEY, signOptions);

      },
      verify: (token, $Option) => {
         let publicKEY =  fs.readFileSync('./keys/public.pem','utf8');
            let verifyOptions = {
            issuer:  $Option.iss,
            algorithm:  "RS256"
         };
         try{
            return jwt.verify(token, publicKEY, verifyOptions);
         }catch (err){
            console.log(err);
            return false;
         }
      },
      decode: (token, key) => {
          return jwt.decode(token, {complete: true});
          //returns null if token is invalid
         }
      }
}