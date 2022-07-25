const selfsigned = require('selfsigned');
const fs = require('fs');

function generateKey() {
    return new Promise( async (resolve, reject) => {
        let pems = selfsigned.generate(null, {
            keySize: 2048, // the size for the private key in bits (default: 1024)
            algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
            extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
            pkcs7: true, // include PKCS#7 as part of the output (default: false)
            clientCertificate: true, // generate client cert signed by the original key (default: false)
            clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
        });
        resolve(pems);
    })
}
generateKey().then( async (pem) => {
    fs.writeFile(`./keys/private.pem`, pem.private, (err) => {
        if (err)
            console.error(err);
    })
    fs.writeFile(`./keys/public.pem`, pem.public, (err) => {
        if (err)
            console.error(err);
    })
})