const db = require('../../../config/db.config');
const Order = db.order;
const Product = db.product;
const Rating = db.rating;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');
const User = db.user;

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');

exports.createOrder = async (req, res) => {
  const input = req.body;
  const arrProduct = [];
  for (const i of input.productInfo) {
    const temp = {
      productId: i.productId,
      price: i.price,
      amount: i.amount,
      size: i.size,
      color: i.color,
      isRating: false,
    };
    arrProduct.push(temp);
  }
  const userInfo = await User.findOne({ where: { id: input.customerId, isDeleted: false } });
  if (!userInfo || userInfo.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  const newId = shortId.generate();

  const obj = {
    orderId: newId,
    productInfo: arrProduct,
    customerId: input.customerId,
    total: input.total,
    paymentMethods: input.paymentMethods,
    status: input.status,
    address: input.address || userInfo.address,
    phone: input.phone || userInfo.phoneNumber,
    note: input.note,
  };
  const product = await Product.findAll({ where: { isDeleted: false } });
  for (const it of obj.productInfo) {
    const checkAmount = product.find((x) => x.productId === it.productId);
    if (checkAmount.amount < it.amount) {
      return res.send(new BadRequestResult(`Product ${checkAmount.productname} does not have enough quantity to fulfill the order `));
    } else {
      const amountLeft = checkAmount.amount - it.amount;
      await Product.update({ amount: amountLeft }, { where: { isDeleted: false, productId: it.productId } });
    }
  }
  await Order.create(obj).then(async (result) => {
    if (result) {
      for (const i of obj.productInfo) {
        await Product.findOne({ where: { productId: i.productId } }).then((data) => {
          data.update({ amount: data.amount - obj.amount });
        });
      }
      return res.send(new OkResult('Create order success', obj.orderId));
    } else {
      return res.send(new BadRequestResult('Create order error'));
    }
  });
};
