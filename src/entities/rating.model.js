module.exports = (sequelize, Sequelize) => {
  const Rating = sequelize.define('rating', {
    ratingId: {
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
    },
    productId: {
      type: Sequelize.UUID,
      required: true,
    },
    userId: {
      type: Sequelize.UUID,
      required: true,
    },
    orderId: {
      type: Sequelize.STRING,
      required: true,
    },
    star: {
      type: Sequelize.FLOAT,
      required: true,
    },
    comment: {
      type: Sequelize.STRING,
      required: true,
    },
    isRating: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
  return Rating;
};
