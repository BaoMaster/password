const db = require('../../../config/db.config');
const User = db.user;
const shortId = require('shortid');
const jwt_decode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OkResult, BadRequestResult } = require('../../../src/middlewares/_base');

shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
exports.login = (req, res) => {
  generateAccessToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: 200,
    });
  };
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      console.log(1, user);
      if (!user) {
        return res.send(new BadRequestResult('User not found', null));
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.send(new BadRequestResult('Password incorrect', null));
      }

      var token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '24h', // expires in 24 hours
        }
      );
      const accessToken = generateAccessToken(user.id, user.role);

      var decode = jwt_decode(token);
      return res.status(200).send({
        statusCode: 200,
        message: 'Login successfully !',
        data: {
          auth: true,
          status: 'success',
          username: user.username,
          phoneNumber: user.phoneNumber,
          address: user.address,
          access_token: token,
          refresh_token: token,
          permission: user.permission,
          decode: decode,
          idverify: user.idverify,
        },
      });
    })
    .catch((err) => {
      res.status(500).send('Error -> ' + err);
    });
};
