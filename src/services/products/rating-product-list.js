const db = require('../../../config/db.config');
const Product = db.product;
const Rating = db.rating;
const User = db.user;
const Type = db.productType;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');

//Get all products
exports.getRatingProductList = async (req, res) => {
  const allType = await Type.findAll({ where: { isDeleted: false } });
  const allRating = await Rating.findAll({ where: { isDeleted: false } });

  await Product.findAll({ where: { isDeleted: false } }).then((data) => {
    const arr = [];
    if (data.length) {
      for (const i of data) {
        const temp = allRating.filter((x) => x.productId === i.productId).map((y) => ({ star: y.star }));
        let star = null;
        let sum = 0;
        if (temp.length) {
          for (const i of temp) {
            sum = sum + i.star;
          }
          star = sum / temp.length;
        }
        const typeName = allType.find((x) => x.id === i.type);
        const obj = {
          amount: i.amount,
          brand: i.brand,
          color: i.color,
          createdAt: i.createdAt,
          description: i.description,
          illustration: i.illustration,
          isDeleted: i.isDeleted,
          price: i.price,
          productId: i.productId,
          productcode: i.productcode,
          productname: i.productname,
          size: i.size,
          type: i.type,
          star: star ? star : 0,
          typeName: typeName.name,
          updatedAt: i.updatedAt,
        };
        arr.push(obj);
      }
      arr.sort(function (a, b) {
        return b.star - a.star;
      });
    }
    return res.send(new OkResult('Get all product success', arr));
  });
};
