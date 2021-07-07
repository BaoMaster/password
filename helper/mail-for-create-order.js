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
    html: `
    <div style="text-align: left;">
<h2>Cảm ơn Quý khách đã mua hàng!</h2>

    <p >Xin chào ${username}, đơn hàng <b>${code}</b> của Quý khách đã được ghi nhận thành công.</p>
    <p>Để đảm bảo quyền lợi khách hàng, Quý khách vui lòng lưu ý một số điểm như sau:</p> 
    <p>
    - Email này có giá trị xác nhận Quý khách đã đặt hàng thành công.</p>
       <p>
    - Quý khách vui lòng KIỂM TRA SẢN PHẨM trước khi nhận hàng.</p>
    <br>
    <p>Thank you so much, best regards</p>
    </div>
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
