const db = require("../../../config/db.config");
const User = db.user;
const bcrypt = require("bcryptjs");
const mail = require("../../../helper/mailForRegister");
const shortId = require("shortid");
const {
  OkResult,
  BadRequestResult,
} = require("../../../src/middlewares/_base");

exports.register = (req, res) => {
  function sendCode(email, username, code) {
    mail.send(email, username, code);
  }

  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (user) {
        // return res.status(409).json({ name: 'Username already exist' });
        return res
          .status(400)
          .send(new BadRequestResult("Username already exist"));
      }
      User.findOne({
        where: {
          email: req.body.email,
        },
      }).then((users) => {
        if (users) {
          return res
            .status(400)
            .send(new BadRequestResult("Email already exist"));
        } else {
          const code = shortId.generate();
          User.create({
            codeforverify: code,
            username: req.body.username,
            dayOfBirth: req.body.dayOfBirth,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            role: req.body.role,
            avatar: req.body.avatar,
            password: bcrypt.hashSync(req.body.password, 8),
            question1: req.body.question1,
            answer1: req.body.answer1,
            question2: req.body.question2,
            answer2: req.body.answer2,
          })
            .then((user) => {
              // sendCode(user.email, user.username, code);

              res.status(200).send({
                statusCode: 200,
                message: "Register account successfully",
                data: null,
              });
            })
            .catch((err) => {
              res.status(500).send("Fail, Error=>" + err);
            });
        }
      });
    })
    .catch((err) => {
      return res.send({ messErr: err });
    });
};
