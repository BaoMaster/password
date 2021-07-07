const db = require('../../../config/db.config');
const Order = db.order;
const User = db.user;
const Product = db.product;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');

//Rating product
exports.getOrderbyId = async (req, res) => {
  const orderId = req.params.id;
  try {
    const userInfo = await User.findAll({ where: { isDeleted: false } });
    const orderData = await Order.findOne({
      where: {
        orderId,
        isDeleted: false,
        // , [Op.and]: [{ isPaid: false }, { paymentMethods: { [Op.not]: 'PAYPAL' } }]
      },
    });
    const productData = await Product.findAll({ where: { isDeleted: false } });

    if (orderData) {
      const arrProduct = [];
      for (const it of orderData.productInfo) {
        const product = productData.find((x) => x.productId === it.productId);
        const objProduct = {
          productId: product.productId,
          brand: product.brand,
          productname: product.productname,
          type: product.type,
          subType: product.subType,
          description: product.description,
          illustration: product.illustration,
          price: it.price,
          amount: it.amount,
          size: it.size,
          color: it.color,
        };
        arrProduct.push(objProduct);
      }
      const user = userInfo.find((x) => x.id === orderData.customerId);
      const obj = {
        orderId: orderData.orderId,
        customerId: orderData.customerId,
        customerName: user.username,
        total: orderData.total,
        paymentMethods: orderData.paymentMethods,
        status: orderData.status,
        isPaid: orderData.isPaid,
        address: orderData.address,
        phone: orderData.phone,
        note: orderData.note,
        isDeleted: orderData.isDeleted,
        productInfo: arrProduct,
        createdAt: orderData.createdAt,
      };
      return res.send(new OkResult('Get order by id Success', obj));
    } else {
      return res.send(new BadRequestResult('Get order data error'));
    }
  } catch (err) {
    return res.send(new BadRequestResult('Get order data error'));
  }
};
