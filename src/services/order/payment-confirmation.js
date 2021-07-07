const db = require("../../../config/db.config");
const Order = db.order;
const ProductType = db.productType;
const { v4: uuidv4 } = require("uuid");

const bcrypt = require("bcryptjs");
const mail = require("../../../helper/mailForRegister");
const shortId = require("shortid");
const Joi = require("joi");
const { OkResult, BadRequestResult } = require("../../middlewares/_base");

//Rating product
exports.paymentConfirm = (req, res) => {
  const input = req.body;
  Order.findOne({
    where: { orderId: input.orderId },
  }).then((data) => {
    if (data) {
      data.update({ isPaid: true, status: "delivering" });
      return res.send(new OkResult("Payment success"));
    } else {
      return res.send(new BadRequestResult("Can not find order"));
    }
  });
};
