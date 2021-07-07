const db = require('../../../config/db.config');
const User = db.user;
const bcrypt = require('bcryptjs');
const { OkResult, BadRequestResult } = require('../../../src/middlewares/_base');
const mail = require('../../../helper/mailForRegister');

exports.changePassCheck = (req, res) => {
  User.findOne({
    where: { email: req.body.email },
  })
    .then(async (data) => {
      if (data) {
        var passwordIsValid = bcrypt.compareSync(req.body.currentPassword, data.password);

        if (!passwordIsValid) {
          return res.send(new BadRequestResult('Current password is not correct', null));
        }
        const newPass = bcrypt.hashSync(req.body.newPassword, 8);
        await User.update({ password: newPass }, { where: { isDeleted: false, email: req.body.email } }).then(() => {
          return res.send(new OkResult('Change Password success', null));
        });
      } else {
        return res.send(new BadRequestResult("Email can't find", null));
      }
    })
    .catch((err) => {
      return res.status(err).json(err);
    });
};
