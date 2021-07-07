const db = require("../../../../../config/db.config");
const ProductSubType = db.productSubType;
const { OkResult, BadRequestResult } = require("../../../../middlewares/_base");

exports.getProductSubType = (req, res) => {
  ProductSubType.findAll({
    attributes: ["id", "subName"],
    where: { isDeleted: false },
  })
    .then((pro) => {
      return res.send(new OkResult("Get product sub type successfully", pro));
    })
    .catch((err) => {
      res.status(err).json({ status: "fail", message: err });
    });
};
