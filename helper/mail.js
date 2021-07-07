const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
);

module.exports.send = (email, orderid, username, total) => {
  const mailOptions = {
    from: "ShoppingApp <any@pvt.com>",
    to: email,
    subject: `New Invoice For Order #${orderid}`,
    text: "For clients with plaintext support only",
    html: `<h3>Dear ${username},</h3>
    <br>
    <p>Thanks for supporting our store.</p> 
    <p>To view your invoice from ShoppingApp for $${total}, or to download a PDF copy for your record please <a href="http://localhost:3030/shop/download/${orderid}">CLick here</a></p>
    <br>
    <p>Thank you so much, best regards</p>
    <p>Info</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ' ${info.response}`);
    }
  });
};
