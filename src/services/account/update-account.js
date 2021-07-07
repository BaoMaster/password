const db = require("../../../config/db.config");
const Account = db.account;
const Product = db.product;
const Rating = db.rating;
const ProductType = db.productType;
const { v4: uuidv4 } = require("uuid");
const User = db.user;

const bcrypt = require("bcryptjs");
const mail = require("../../../helper/mailForRegister");
const shortId = require("shortid");
const Joi = require("joi");
const { OkResult, BadRequestResult } = require("../../middlewares/_base");

exports.updateAccount = async (req, res) => {
  const input = req.body;
  const accountId = req.params.id;
  const obj = {
    website: input.website,
    account: input.account,
    password: input.password,
    note: input.note,
  };

  await Account.update(obj, { where: { isDeleted: false, accountId } }).then(
    async (result) => {
      if (result) {
        return res.send(new OkResult("Update account success"));
      } else {
        return res.send(new BadRequestResult("Update account error"));
      }
    }
  );
};
