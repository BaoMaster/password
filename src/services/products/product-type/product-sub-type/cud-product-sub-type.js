const db = require("../../../../../config/db.config");
const ProductSubType = db.productSubType;
const { OkResult, BadRequestResult } = require("../../../../middlewares/_base");
const { v4: uuidv4 } = require("uuid");

exports.addProductSubType = (req, res) => {
  const newId = uuidv4();
  const obj = { id: newId, subName: req.body.productSubTypeName };
  ProductSubType.create(obj)
    .then((pro) => {
      return res.send(new OkResult("Add product sub type successfully", pro));
    })
    .catch((err) => {
      res.status(err).json({ status: "fail", message: err });
    });
};
exports.updateProductSubType = (req, res) => {
  ProductSubType.update(
    { name: req.body.productSubTypeName },
    { where: { id: req.params.id } }
  )
    .then((pro) => {
      return res.send(new OkResult("Update product sub type successfully"));
    })
    .catch((err) => {
      res.status(err).json({ status: "fail", message: err });
    });
};
exports.deleteProductSubType = (req, res) => {
  ProductSubType.update({ isDeleted: true }, { where: { id: req.params.id } })
    .then((pro) => {
      return res.send(new OkResult("Deleted product sub type successfully"));
    })
    .catch((err) => {
      res.status(err).json({ status: "fail", message: err });
    });
};
