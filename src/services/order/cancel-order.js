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
exports.cancelOrder = (req, res) => {
  const orderId = req.params.id;
  Order.findOne({
    where: { orderId: orderId, status: "waiting-verify" },
  }).then((data) => {
    if (data) {
      data.update({ status: "canceled" });
      return res.send(new OkResult("Canceled order successfully"));
    } else {
      return res.send(new BadRequestResult("Can not find order"));
    }
  });
};
