const db = require('../../../config/db.config');
const Order = db.order;
const Product = db.product;
const Type = db.productType;

const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');
const Rating = db.rating;
const User = db.user;
const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');
const orderStatus = require('../../entities/enum');
const { Op } = require('sequelize');

//Rating product
exports.getOrderbyUserId = async (req, res) => {
  const customerId = req.params.id;
  console.log(111, customerId);
  const findUser = await User.findOne({ where: { isDeleted: false, id: customerId } });
  console.log(222, findUser);
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  try {
    const orderData = await Order.findAll({
      where: {
        customerId,
        isDeleted: false,
      },
    });
    const productData = await Product.findAll({ where: { isDeleted: false } });
    const arr = [];
    if (orderData) {
      for (const i of orderData) {
        if (i.paymentMethods === 'PAYPAL' && !i.isPaid) {
        } else {
          const arrProduct = [];
          for (const it of i.productInfo) {
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
          const obj = {
            orderId: i.orderId,
            customerId: i.customerId,
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
          arr.push(obj);
        }
      }
    }
    return res.send(new OkResult('Get order by id Success', arr));
  } catch (err) {
    console.log('e', err);
    return res.send(new BadRequestResult('Get order data error'));
  }
};

exports.GetOrderWaitingVerify = async (req, res) => {
  const findUser = await User.findOne({ where: { isDeleted: false, id: req.params.id } });
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  console.log(' orderStatus.waiting', orderStatus.waiting);
  const data = await Order.findAll({
    where: {
      isDeleted: false,
      status: orderStatus.waiting,
      customerId: req.params.id,
    },
  });
  const productData = await Product.findAll({ where: { isDeleted: false } });

  const arr = [];
  if (data) {
    for (const i of data) {
      const arrProduct = [];
      if (i.paymentMethods === 'PAYPAL' && !i.isPaid) {
      } else {
        for (const it of i.productInfo) {
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
        const obj = {
          orderId: i.orderId,
          customerId: i.customerId,
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
        arr.push(obj);
      }
    }
  }
  return res.send(new OkResult('Get waiting order Success', arr));
};
exports.GetOrderDelivering = async (req, res) => {
  const findUser = await User.findOne({ where: { isDeleted: false, id: req.params.id } });
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  const data = await Order.findAll({
    where: {
      isDeleted: false,
      status: orderStatus.delivering,
      customerId: req.params.id,
    },
  });
  const productData = await Product.findAll({ where: { isDeleted: false } });
  const arr = [];
  if (data) {
    for (const i of data) {
      const arrProduct = [];
      if (i.paymentMethods === 'PAYPAL' && !i.isPaid) {
      } else {
        for (const it of i.productInfo) {
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
        const obj = {
          orderId: i.orderId,
          customerId: i.customerId,
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
        arr.push(obj);
      }
    }
  }
  return res.send(new OkResult('Get delivering order Success', arr));
};
exports.GetOrderDelivered = async (req, res) => {
  const findUser = await User.findOne({ where: { isDeleted: false, id: req.params.id } });
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  const data = await Order.findAll({
    where: {
      isDeleted: false,
      status: orderStatus.delivered,
      customerId: req.params.id,
    },
  });
  const productData = await Product.findAll({ where: { isDeleted: false } });
  const arr = [];
  if (data) {
    for (const i of data) {
      const arrProduct = [];
      if (i.paymentMethods === 'PAYPAL' && !i.isPaid) {
      } else {
        for (const it of i.productInfo) {
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
        const obj = {
          orderId: i.orderId,
          customerId: i.customerId,
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
        arr.push(obj);
      }
    }
  }
  return res.send(new OkResult('Get delivered order Success', arr));
};
exports.GetPurchasedProduct = async (req, res) => {
  const findUser = await User.findOne({ where: { isDeleted: false, id: req.params.id } });
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  const allOrder = await Order.findAll({
    where: {
      isDeleted: false,
      status: orderStatus.delivered,
      customerId: req.params.id,
    },
  });
  const arrProduct = [];
  if (allOrder.length) {
    for (const i of allOrder) {
      if (i.paymentMethods === 'PAYPAL' && !i.isPaid) {
      } else {
        for (const it of i.productInfo) {
          if (arrProduct.includes(it.productId)) {
          } else {
            arrProduct.push(it.productId);
          }
        }
      }
    }
  }
  const purchasedProduct = [];
  if (arrProduct.length) {
    for (const i of arrProduct) {
      await Product.findOne({ where: { isDeleted: false, productId: i } }).then(async (data) => {
        ////////////////////////////////
        const arrRating = [];
        const rating = await Rating.findAll({
          where: { isDeleted: false, isRating: true, productId: i },
        });
        console.log(11111, rating.length);
        const userInfo = await User.findAll({ where: { isDeleted: false } });
        console.log(1111112);
        for (const i of rating) {
          const user = userInfo.find((x) => x.id === i.userId);
          console.log('user', user);
          const obj = {
            date: i.updatedAt,
            star: i.star.toFixed(1),
            comment: i.comment,
            userName: user.username,
          };
          arrRating.push(obj);
        }
        const typeName = await Type.findOne({ where: { isDeleted: false, id: data.type }, attributes: ['name'] });
        const dataOut = {
          productId: data.productId,
          brand: data.brand,
          productname: data.productname,
          productcode: data.productcode,
          size: data.size,
          color: data.color,
          type: data.type,
          typeName: typeName.name,
          productcode: data.productcode,
          illustration: data.illustration,
          description: data.description,
          price: data.price,
          amount: data.amount,
          isDeleted: data.isDeleted,
          rating: arrRating,
        };
        ////////////////////////////////////
        purchasedProduct.push(dataOut);
      });
    }
  }
  return res.send(new OkResult('Get Purchased Product success', purchasedProduct));
};
