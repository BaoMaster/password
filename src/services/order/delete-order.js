const db = require('../../../config/db.config');
const Order = db.order;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');

//Rating product
exports.deleteOrder = (req, res) => {
  const orderId = req.params.id;
  Order.findOne({
    where: { orderId: orderId },
  }).then((data) => {
    if (data) {
      data.update({ isDeleted: true });
      return res.send(new OkResult('Delete order successfully'));
    } else {
      return res.send(new BadRequestResult('Can not find order'));
    }
  });
};
