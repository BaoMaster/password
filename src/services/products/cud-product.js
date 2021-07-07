const db = require('../../../config/db.config');
const Product = db.product;
const ProductType = db.productType;
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs');
const mail = require('../../../helper/mailForRegister');
const shortId = require('shortid');
const Joi = require('joi');
const { OkResult, BadRequestResult } = require('../../middlewares/_base');

const schema = Joi.object({
  productcode: Joi.string().required(),
  brand: Joi.string().required(),
  price: Joi.number().required(),
  productname: Joi.string().required(),
  amount: Joi.number().required(),
  type: Joi.string().required(),
  description: Joi.string().allow('', null),
  color: Joi.array().allow('', null),
  size: Joi.array().allow('', null),
});

exports.addProduct = (req, res) => {
  const value = schema.validate(req.body);
  if (value.error) {
    res.status(400).send(new BadRequestResult(value.error.details[0].message));
  } else {
    Product.findAll({
      where: { productcode: req.body.productcode },
    })
      .then((pro) => {
        if (pro.length) {
          return res.status(401).send(new BadRequestResult('Your product already have in store'));
        }
        console.log('input', {
          productId: uuidv4(),
          productname: req.body.productname,
          productcode: req.body.productcode,
          brand: req.body.brand,
          type: req.body.type,
          price: req.body.price,
          description: req.body.description,
          illustration: req.body.illustration,
          amount: req.body.amount,
          color: req.body.color,
          size: req.body.size,
        });
        Product.create({
          productId: uuidv4(),
          productname: req.body.productname,
          productcode: req.body.productcode,
          brand: req.body.brand,
          type: req.body.type,
          price: req.body.price,
          description: req.body.description,
          illustration: typeof req.body.illustration !== 'undefined' ? req.body.illustration : [],
          amount: req.body.amount,
          color: req.body.color,
          size: req.body.size,
        })
          .then((data) => {
            if (data) {
              return res.send(new OkResult('Add product successfully'));
            }
          })
          .catch((err) => {
            return res.status(err).json(err);
          });
      })
      .catch((err) => {
        res.status(err.status).send(new BadRequestResult(err.message));
      });
  }
};
exports.updateProduct = async (req, res) => {
  // const value = schema.validate(req.body);
  const allProduct = await Product.findAll({ where: { isDeleted: false, [Op.not]: { productId: req.params.id } } });
  const value = req.body;
  if (value.error) {
    res.status(400).send(new BadRequestResult(value.error.details[0].message));
  } else {
    if (allProduct.find((x) => x.productcode === value.productcode)) {
      return res.send(new BadRequestResult('This product code already have in App'));
    }
    await Product.findAll({
      where: { productId: req.params.id },
    })
      .then((pro) => {
        Product.update(
          {
            type: value.type,
            brand: value.brand,
            productcode: value.productcode,
            price: value.price,
            productname: value.productname,
            description: value.description,
            illustration: value.illustration,
            amount: value.amount,
            size: value.size,
            color: value.color,
          },
          { where: { productId: req.params.id } }
        )
          .then((data) => {
            if (data) {
              return res.send(new OkResult('update product successfully'));
            }
          })
          .catch((err) => {
            return res.status(err).json(err);
          });
      })
      .catch((err) => {
        res.status(err.status).send(new BadRequestResult(err.message));
      });
  }
};
exports.deleteProduct = (req, res) => {
  // const value = schema.validate(req.body);
  User.findOne({ where: { id: req.params.id } }).then((data) => {
    if (data) {
      data.update({ isDeleted: true });
    }
  });
};
