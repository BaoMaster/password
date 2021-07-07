const db = require("../../../config/db.config");
const User = db.user;
const bcrypt = require("bcryptjs");
const {
  OkResult,
  BadRequestResult,
} = require("../../../src/middlewares/_base");
const mail = require("../../../helper/mailForRegister");

exports.verifyCode = (req, res) => {
  User.findOne({
    where: { email: req.body.email },
  })
    .then((data) => {
      if (data) {
        if (
          data.answer1 === req.body.answer1 &&
          data.answer2 === req.body.answer2
        ) {
          return res.send(new OkResult(null, null));
        } else {
          return res.send(new BadRequestResult("Wrong answer", null));
        }
      } else {
        return res.send(new BadRequestResult("Email can't find", null));
      }
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
