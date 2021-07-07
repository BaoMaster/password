const db = require("../../../config/db.config");
const User = db.user;
const bcrypt = require("bcryptjs");
const {
  OkResult,
  BadRequestResult,
} = require("../../../src/middlewares/_base");
const mail = require("../../../helper/mailForRegister");
const shortId = require("shortid");

exports.checkAndSendCode = (req, res) => {
  function sendCode(email, username, code) {
    mail.send(email, username, code);
  }
  User.findOne({
    where: { email: req.body.email },
  })
    .then(async (data) => {
      const code = shortId.generate();
      await User.update(
        { codeforverify: code },
        { where: { email: req.body.email, isDeleted: false } }
      );
      if (data) {
        // sendCode(data.email, data.username, code);
        return res.send(new OkResult(null, data));
      } else {
        return res.send(new BadRequestResult("Email can't find", null));
      }
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
