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
exports.ratingProduct = async (req, res) => {
  const findUser = await User.findOne({ where: { isDeleted: false, username: req.body.userName } });
  if (!findUser || findUser.length < 1) {
    return res.send(new BadRequestResult('Your account has been removed from the system', null, 444));
  }
  const ratingId = req.params.id;
  const value = req.body;
  console.log('ratingId', ratingId);
  try {
    await Rating.findOne({
      where: { ratingId, isDeleted: false },
    }).then(async (itemFind) => {
      if (itemFind.isRating === true) {
        return res.send(new BadRequestResult('You have already rated this product'));
      } else {
        await itemFind.update({
          star: value.star,
          comment: value.comment,
          isRating: true,
        });
        return res.send(new OkResult('Rating product successfully'));
      }
    });
  } catch (error) {
    return res.send(new BadRequestResult('Rating product error'));
  }
};
