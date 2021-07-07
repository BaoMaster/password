const db = require('../../../config/db.config');
const User = db.user;
const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mail-for-forgot-password');
var generator = require('generate-password');
var crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

var random = generator.generate({
  length: 10,
  numbers: true,
});
function sendCode(email, username, code) {
  mail.send(email, username, code);
}
exports.forgotPassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((users) => {
      if (!users) {
        return res.status(400).json({ statusCode: 400, message: 'Email not found', data: null });
      }
      let email = users.dataValues.email;
      let userName = users.dataValues.username;
      let newPass = bcrypt.hashSync(random, 8);
      var emailEn = jwt.sign(email, 'secretKey');
      console.log('new', random);
      users.update({ password: newPass });
      console.log('emailAfter', emailEn);
      var bytes = jwt.verify(emailEn, 'secretKey');
      // sendCode(email, userName, emailEn);

      console.log('emailGiai', bytes);

      res.status(200).send({
        statusCode: 200,
        message: 'Forgot password link is sended to your email',
        data: null,
      });
    })
    .catch((err) => {
      console.log('e', err);
      return res.status(501).send({ statusCode: 500, message: err, data: null });
    });
};
