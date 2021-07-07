const uuid = require('uuidv4');

module.exports = (sequelize, Sequelize) => {
  const Permission = sequelize.define('permissions', {
    permissions: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
    },
    role: {
      type: Sequelize.STRING,
    },
  });
  return Permission;
};
