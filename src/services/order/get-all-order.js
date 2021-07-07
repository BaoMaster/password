const db = require('../../../config/db.config');
const Order = db.order;
const User = db.user;
const Product = db.product;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');
const { log } = require('debug');

//Rating product
exports.getAllOrder = async (req, res) => {
  try {
    const userInfo = await User.findAll();
    const productData = await Product.findAll({ where: { isDeleted: false } });
    const orderData = await Order.findAll({
      where: { isDeleted: false },
    });
    const data = [];
    if (orderData.length) {
      for (const i of orderData) {
        const arrProduct = [];
        for (const it of i.productInfo) {
          if (it.productId) {
            const product = productData.find((x) => x.productId === it.productId);
            const objProduct = {
              productId: product.productId,
              brand: product.brand,
              productname: product.productname,
              type: product.type,
              subType: product.subType,
              description: product.description,
              illustration: product.illustration,
              price: product.price,
              amount: it.amount,
              size: it.size,
              color: it.color,
            };
            arrProduct.push(objProduct);
          }
        }
        console.log('info', i);
        const user = userInfo.find((x) => x.id === i.customerId);
        console.log('user1', user);
        const obj = {
          orderId: i.orderId,
          customerId: i.customerId,
          customerName: user.username,
          total: i.total,
          paymentMethods: i.paymentMethods,
          status: i.status,
          isPaid: i.isPaid,
          address: i.address,
          phone: i.phone,
          note: i.note,
          isDeleted: i.isDeleted,
          productInfo: arrProduct,
          createdAt: i.createdAt,
        };
        data.push(obj);
      }
    }
    return res.send(new OkResult('Get order by id Success', data));
  } catch (err) {
    console.log('2', err);
    return res.send(new BadRequestResult('Get order data error'));
  }
};
