require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.URL,
  // process.env.DATABASE_NAME,
  // process.env.DATABASE_USERNAME,
  // process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    operatorsAliases: 0,

    pool: {
      max: parseInt(process.env.DATABASE_POOL_MAX),
      min: parseInt(process.env.DATABASE_POOL_MIN),
      acquire: process.env.DATABASE_POOL_ACQUIRE,
      idle: process.env.DATABASE_POOL_IDLE,
    },
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../src/entities/user.model")(sequelize, Sequelize);
db.product = require("../src/entities/product.model")(sequelize, Sequelize);
db.productType = require("../src/entities/product-type.model")(
  sequelize,
  Sequelize
);
db.order = require("../src/entities/product-order")(sequelize, Sequelize);
db.rating = require("../src/entities/rating.model")(sequelize, Sequelize);
db.account = require("../src/entities/manager-account.model")(
  sequelize,
  Sequelize
);

// db.product.belongsTo(db.productType, { foreignKey: "type", as: "productType" });
// db.productType.hasMany(db.product, { foreignKey: "id", as: "product" });

// db.product.hasMany(db.rating, { foreignKey: "productId", as: "productRating" });
// db.rating.belongsTo(db.product, {
//   foreignKey: "productId",
//   as: "ratingProduct",
// });

// db.user.hasMany(db.rating, { foreignKey: "id", as: "userRating" });
// db.rating.belongsTo(db.user, { foreignKey: "userId", as: "ratingUser" });

// db.user.hasMany(db.order, { foreignKey: "id", as: "userOrder" });
// db.order.belongsTo(db.user, { foreignKey: "customerId", as: "ratingUser" });

module.exports = db;
