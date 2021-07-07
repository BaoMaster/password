const db = require("../../../config/db.config");
const Account = db.account;
const bcrypt = require("bcryptjs");
const mail = require("../../../helper/mailForRegister");
const shortId = require("shortid");
const { Op } = require("sequelize");
const { OkResult, BadRequestResult } = require("../../middlewares/_base");

exports.getAllAccount = (req, res) => {
  Account.findAll({
    where: { isDeleted: false, userId: req.params.id },
  }).then((data) => {
    return res.send(new OkResult("Get All Account Success", data));
  });
};

exports.getOneAccount = (req, res) => {
  Account.findOne({
    where: { isDeleted: false, accountId: req.params.id },
  }).then((data) => {
    return res.send(new OkResult("Get One Account Success", data));
  });
};
