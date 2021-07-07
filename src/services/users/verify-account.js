const db = require('../../../config/db.config');
const User = db.user;
const { OkResult, BadRequestResult } = require('../../../src/middlewares/_base');

exports.verify = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
      // codeforverify: req.body.code,
    },
  })
    .then((user) => {
      if (user !== null) {
        if (user.codeforverify === req.body.code) {
          // return res.json(user);
          if (user.idverify === false) {
            user.update({ idverify: true });
            return res.json({
              status: 200,
              message: 'Your account has been successfully verified',
              data: null,
            });
          } else {
            return res.json({
              status: 200,
              message: 'Your account has been verified',
              data: null,
            });
          }
        } else {
          return res.send(new BadRequestResult('Wrong verify code', null));
        }
      } else {
        return res.status(400).send({
          statusCode: 400,
          message: 'Can not find email',
          data: null,
        });
      }
    })
    .catch((err) => {
      return res.send({ ERR: err.message });
    });
};
