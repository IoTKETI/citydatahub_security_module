const nodemailer = require("nodemailer");
const serverInfo = require("../server_conf.json");

const config = {
  service: "gmail",
  auth: {
    user: serverInfo.emailAccountId,
    pass: serverInfo.emailAccountPwd,
  },
};

module.exports = {
  sendMail: (mailOptions) => {
    return new Promise((resolve, reject) => {
      try {
        let transporter = nodemailer.createTransport(config);

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(err);
          } else {
            console.log(info);
            resolve(true);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
};
