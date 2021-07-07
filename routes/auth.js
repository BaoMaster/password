var express = require("express");
var router = express.Router();
const service = require("../src/services/user");
const UserLoginService = require("../src/services/users/login");
const UserRegisterService = require("../src/services/users/register");
const UserVerifyService = require("../src/services/users/verify-account");
const UserResetPasswordService = require("../src/services/users/reset-password");
const UserForgotPasswordService = require("../src/services/users/forgot-password");
const GetUser = require("../src/services/users/get-user");
const UpdateUser = require("../src/services/users/update");
const paypal = require("paypal-rest-sdk");
const fs = require("fs");
const { OkResult, BadRequestResult } = require("../src/middlewares/_base");
const CreateOrder = require("../src/services/order/create-order");
const GetOrderById = require("../src/services/order/get-order-by-id");
const GetOrderByUserId = require("../src/services/order/get-order-by-userId");
const GetOrder = require("../src/services/order/get-all-order");
const CancelOrder = require("../src/services/order/cancel-order");
const PaymentConfirm = require("../src/services/order/payment-confirmation");
const UpdateOrder = require("../src/services/order/update-order");
const DeleteUser = require("../src/services/users/delete-user");
const CheckAndSendCode = require("../src/services/users/check-and-send-verify-code");
const VerifyCode = require("../src/services/users/verify-when-forgotpassword");
const ChangePass = require("../src/services/users/change-pass-wher-forgot");
const ChangePassCheck = require("../src/services/users/change-pass-have-check-current");
const DeleteOrder = require("../src/services/order/delete-order");
const GetAccount = require("../src/services/account/get-all-account");
const AddAccount = require("../src/services/account/add-account");
const UpdateAccount = require("../src/services/account/update-account");
const DeleteAccount = require("../src/services/account/delete-account");
const ejs = require("ejs");
const multer = require("multer");
const path = require("path");
const db = require("../config/db.config");
const Product = db.product;

const Resize = require("../config/resize");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AUMFtgyt-BxKIpW02YZTMm2hm43nVoWXmb5-5CNsoe48NRkKRKUkNScNrf5cmdHAG1lkSYJWmQfHbuTi",
  client_secret:
    "EEn-R2c2lrzm-0DSd20J0gW9u7YFhG4Jhtp_BbLev5zi0nDginBuj3Nc1MAqElgrEmu0UzelVY4b0ejP",
});

var total = 0;

router.get("/", function (req, res, next) {
  res.send("index from nodejs server");
});

router.get("/api/get-one/:id", GetUser.getOne);
router.delete("/api/delete/:id", DeleteUser.deleteUser);
router.post("/api/check-email", CheckAndSendCode.checkAndSendCode);
router.post("/api/verify-question", VerifyCode.verifyCode);
router.post("/api/change-pass", ChangePass.changePass);
router.post("/api/change-pass-check", ChangePassCheck.changePassCheck); //change pass have check current password
router.get("/api/get-all/:id", GetUser.getAll);
router.put("/api/update/:id", UpdateUser.update);
router.post("/api/register", UserRegisterService.register);
router.post("/api/resetpassword", UserResetPasswordService.resetPassword);
router.post("/api/login", UserLoginService.login);
router.post("/api/loginadmin", service.loginAdmin);
router.post("/api/forgot-password", UserForgotPasswordService.forgotPassword);
router.post("/api/resend", service.reSend);
router.post("/api/verify", UserVerifyService.verify);
//Create order
router.post("/api/create-order", CreateOrder.createOrder);
//Get order by orderId
router.get("/api/get-order-by-id/:id", GetOrderById.getOrderbyId);
//Delete order by orderId
router.delete("/api/delete-order-by-id/:id", DeleteOrder.deleteOrder);
//Get order by userId
router.get("/api/get-order-by-user-id/:id", GetOrderByUserId.getOrderbyUserId);
//Get all order
router.get("/api/get-order", GetOrder.getAllOrder);
//Cancel order
router.put("/api/cancel-order/:id", CancelOrder.cancelOrder);
//payment-confirm
router.post("/api/payment-confirm", PaymentConfirm.paymentConfirm);
//Get waiting order
router.get(
  "/api/get-waiting-order/:id",
  GetOrderByUserId.GetOrderWaitingVerify
);
//Get waiting order
router.get(
  "/api/get-delivering-order/:id",
  GetOrderByUserId.GetOrderDelivering
);
//Get waiting order
router.get("/api/get-delivered-order/:id", GetOrderByUserId.GetOrderDelivered);
//Get waiting order
router.get(
  "/api/get-purchased-product/:id",
  GetOrderByUserId.GetPurchasedProduct
);
//Get waiting order
router.put("/api/update-order/:id", UpdateOrder.updateOrder);
//// initial();
router.get("/api/get-all-account/:id", GetAccount.getAllAccount);
router.get("/api/get-one-account/:id", GetAccount.getOneAccount);
router.put("/api/update-account/:id", UpdateAccount.updateAccount);
router.delete("/api/delete-account/:id", DeleteAccount.deleteAccount);
router.post("/api/add-account", AddAccount.addAccount);

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
router.post("/post", upload.single("image"), async function (req, res) {
  const imagePath = path.join(__dirname, "../public/images/user");
  console.log("imagePath", imagePath);
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({ error: "Please provide an image" });
  }
  const filename = await fileUpload.save(req.file.buffer);
  return res.status(200).json({ name: filename });
});
router.post("/post-product", upload.single("image"), async function (req, res) {
  const imagePath = path.join(__dirname, "../public/images/product");
  console.log("imagePath", imagePath);
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({ error: "Please provide an image" });
  }
  const filename = await fileUpload.save(req.file.buffer);
  return res.status(200).json({ name: filename });
});
router.post("/api/pay", (req, res) => {
  if (total !== 0) {
    total = 0;
  }
  if (req.body.data.length) {
    for (const it of req.body.data) {
      total += parseFloat(it.price) * it.quantity;
    }
  }
  const reallyTotal = parseFloat(total).toFixed(2);
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      // return_url: 'http://localhost:8080/success',
      // cancel_url: 'http://localhost:8080/cancel',
      return_url: `${process.env.URL_P}success`,
      cancel_url: `${process.env.URL_P}cancel`,
    },
    transactions: [
      {
        item_list: {
          items: req.body.data,
        },
        amount: {
          currency: "USD",
          total: reallyTotal.toString(),
        },
        description: "Buy success.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log("req", req.body.data);
      Product.findAll({ where: { isDeleted: false } }).then((result) => {
        for (const item of req.body.data) {
          const find = result.find((x) => x.productId === item.sku);
          const amountLeft = find.amount + parseInt(item.quantity);
          Product.update(
            { amount: amountLeft },
            { where: { productId: item.sku } }
          );
        }

        return res.send(new BadRequestResult("Thanh toán thất bại"));
      });
      // throw error;
      // console.log('fail');
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          // res.redirect(payment.links[i].href);
          return res.send(new OkResult("Link verify", payment.links[i].href));
        }
      }
    }
  });
});

router.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: reallyTotal.toString(),
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      total = 0;
      if (error) {
        // throw error;
        return res.send(new BadRequestResult("Thanh toán thất bại"));
      } else {
        console.log("Create Payment Response");
        console.log(JSON.stringify(payment));
        // return null;
        return res.send(null);
        // res.send(new OkResult("Check out success", null));
      }
    }
  );
});

// router.get('/cancel', (req, res) => res.send(null));

module.exports = router;
