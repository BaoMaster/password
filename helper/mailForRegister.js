const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
);

module.exports.send = (email, username, code) => {
  const mailOptions = {
    from: 'Convenient Shopping App <any@pvt.com>',
    to: email,
    subject: `Email account activation`,
    text: 'For clients with plaintext support only',
    html: `<h3>Dear ${username},</h3>
    <br>
    <p>Welcome to Convenient Shopping App</p>
    <p>Your login email is:${email}</p> 
    <p>
    This is your activation Code: <b>${code}</b></p>
    <br>
    <p>Thank you so much, best regards</p>
    `,
  };
  //   shop/download/${orderid}
  transporter.sendMail(mailOptions, (error, info) => {
    console.log('user', process.env.EMAIL_USER);
    console.log('pass', process.env.EMAIL_PASS);
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ' ${info.response}`);
    }
  });
};
