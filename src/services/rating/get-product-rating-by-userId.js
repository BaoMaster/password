const db = require('../../../config/db.config');
const Product = db.product;
const Rating = db.rating;
const User = db.user;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');

//Rating product
exports.getRatingByUserId = async (req, res) => {
  const userId = req.params.id;
  const findUser = await User.findOne({ where: { isDeleted: false, id: userId } });
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  try {
    const data = [];
    const ratingData = await Rating.findAll({
      where: { userId, isDeleted: false, isRating: false },
    });
    const productInfo = await Product.findAll({ where: { isDeleted: false } });
    if (ratingData.length > 0) {
      for (const i of ratingData) {
        const product = productInfo.find((x) => x.productId === i.productId);
        const obj = {
          ratingId: i.ratingId,
          orderId: i.orderId,
          productId: i.productId,
          productName: product.productname,
          illustration: product.illustration,
          price: product.price,
          userId: i.userId,
          order: i.order,
          star: i.star,
          comment: i.comment,
          isRating: i.isRating,
          isDeleted: i.isDeleted,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
        };
        data.push(obj);
      }
    }
    return res.send(new OkResult('Get rating data by userId Success', data));
  } catch (err) {
    return res.send(new BadRequestResult('Get rating data error'));
  }
};
