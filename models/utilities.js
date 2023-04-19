const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

async function emailUser(code, userEmail) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "isabell24@ethereal.email", // generated ethereal user
      pass: "mEw81jkPpRkBeCNBaW", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Horizons" isabell24@ethereal.email', // sender address
    to: userEmail, // list of receivers
    subject: "Your Authentication Code", // Subject line
    text: `Please see your authentication code: ${code}`,
  });

  //console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

emailUser().catch(console.error);

async function encryptPassword(password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword; // This is the encrypted password
  } catch (error) {
    console.error(error);
  }
}

async function comparePasswords(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function generateCode() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

async function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

async function reformatDate(dateString) {
  const date = new Date(dateString);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const formattedDate = year + "-" + month + "-" + day;
  return formattedDate;
}

module.exports = { encryptPassword, comparePasswords, generateCode, emailUser, isEmpty, reformatDate };
