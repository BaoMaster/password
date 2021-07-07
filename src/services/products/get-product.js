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
exports.getAllProduct = async (req, res) => {
  const allType = await Type.findAll({ where: { isDeleted: false } });
  await Product.findAll({ where: { isDeleted: false } }).then((data) => {
    const arr = [];
    if (data.length) {
      for (const i of data) {
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
          typeName: typeName.name,
          updatedAt: i.updatedAt,
        };
        arr.push(obj);
      }
    }
    return res.send(new OkResult('Get all product success', arr));
  });
};

//Get product by product's Id
exports.getProductById = (req, res) => {
  Product.findOne({
    where: { isDeleted: false, productId: req.params.id },
  }).then(async (data) => {
    if (data) {
      const arrRating = [];
      const rating = await Rating.findAll({
        where: { isDeleted: false, isRating: true, productId: req.params.id },
      });
      const userInfo = await User.findAll({ where: { isDeleted: false } });
      for (const i of rating) {
        const user = userInfo.find((x) => x.id === i.userId);
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
      console.log(1122, dataOut);
      return res.send(new OkResult('Get product by id success', dataOut));
    } else {
      return res.send(new BadRequestResult('Product not found'));
    }
  });
};

//Get product by each product's type
exports.getProductEachType = (req, res) => {
  ProductType.findAll({ where: { isDeleted: false } }).then(async (data) => {
    let arr = [];
    if (data) {
      for (const it of data) {
        const dataProduct = await Product.findAll({
          where: { isDeleted: false, type: it.id },
        });
        if (dataProduct) {
          const obj = {
            productTypeId: it.id,
            productTypeName: it.name,
            product: dataProduct,
          };
          arr.push(obj);
        }
      }
    }
    return res.send(new OkResult('Get product by type success', arr));
  });
};

//Get product by one type
exports.getProductOneType = async (req, res) => {
  const allType = await Type.findAll({ where: { isDeleted: false } });
  const allRating = await Rating.findAll({ where: { isDeleted: false } });

  await Product.findAll({ where: { isDeleted: false, type: req.params.id } }).then((data) => {
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
    }
    return res.send(new OkResult('Get all product success', arr));
  });
};
