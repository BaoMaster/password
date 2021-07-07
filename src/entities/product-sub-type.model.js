module.exports = (sequelize, Sequelize) => {
  const ProductSubType = sequelize.define("product-sub-type", {
    id: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
    },
    subName: {
      type: Sequelize.STRING,
      required: true,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return ProductSubType;
};
