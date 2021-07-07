const db = require('../../../config/db.config');
const Order = db.order;
const Product = db.product;
const Rating = db.rating;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');
const User = db.user;

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mail-for-create-order');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');

exports.updateOrder = async (req, res) => {
  function sendCode(email, username, code) {
    mail.send(email, username, code);
  }
  const input = req.body;
  console.log('re', input);
  const orderId = req.params.id;
  try {
    const findOrder = await Order.findOne({
      where: { isDeleted: false, orderId },
    });
    const findUser = await User.findOne({ where: { isDeleted: false, id: findOrder.customerId } });
    if (findOrder) {
      await Order.update(input, { where: { isDeleted: false, orderId } }).then(async () => {
        // if (input.isPaid === true) {
        //   const amountResult = []; //Hàm update amount sản phẩm
        //   for (const i of findOrder.productInfo) {
        //     const obj = {
        //       productId: i.productId,
        //       amount: i.amount,
        //     };
        //     amountResult.push(obj);
        //   }
        //   if (amountResult.length > 0) {
        //     for (const it of amountResult) {
        //       await Product.update({ amount: it.amount }, { where: { isDeleted: false, productId: it.productId } });
        //     }
        //   }
        // }
        if (findOrder.status !== 'delivered' && input.status === 'delivered') {
          sendCode(findUser.email, findUser.username, findOrder.orderId);

          for (const i of input.productInfo) {
            const findRating = await Rating.findAll({
              where: {
                isDeleted: false,
                isRating: false,
                productId: i.productId,
              },
            });
            if (findRating.length > 0) {
              for (const it of findRating) {
                await Rating.update({ isDeleted: true }, { where: { ratingId: it.ratingId } });
              }
            }
            const rating = {
              productId: i.productId,
              userId: findOrder.customerId,
              orderId: orderId,
              start: 0,
              comment: null,
            };
            await Rating.create(rating);
          }
        }
        if (findOrder.status !== 'canceled' && input.status === 'canceled') {
          const allProduct = await Product.findAll({ where: { isDeleted: false } });
          for (const i of input.productInfo) {
            const findProduct = allProduct.find((x) => x.productId === i.productId);
            const amountLeft = parseInt(findProduct.amount) + parseInt(i.amount);
            await Product.update({ amount: amountLeft }, { where: { isDeleted: false, productId: i.productId } });
          }
        }
        if (findOrder.status === 'canceled' && input.status !== 'canceled') {
          const allProduct = await Product.findAll({ where: { isDeleted: false } });
          for (const i of input.productInfo) {
            const findProduct = allProduct.find((x) => x.productId === i.productId);
            const amountLeft = parseInt(findProduct.amount) - parseInt(i.amount);
            await Product.update({ amount: amountLeft }, { where: { isDeleted: false, productId: i.productId } });
          }
        }
      });
    } else {
      return res.send(new BadRequestResult('Order not found'));
    }
    return res.send(new OkResult('Update order success'));
  } catch (error) {
    console.log('e', error);
    return res.send(new BadRequestResult('Update order error'));
  }
};
