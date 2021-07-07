var express = require("express");
var router = express.Router();
const controller = require("../src/services/user");
const multer = require("multer");
const path = require("path");

const Resize = require("../config/resize");

// const authJwt = require("../verifyJwtToken");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("index from nodejs server");
});
router.post("/api/register", controller.register);
router.post("/api/login", controller.login);
router.post("/api/forgotpassword", controller.forgotPassword);
router.post("/api/resend", controller.reSend);
router.post("/api/verify", controller.verify);
router.get("/api/getone/:id", controller.getOne);
router.get("/api/getuserbyid/:id", controller.getUserById);

router.get("/api/getall", controller.getAll);
router.put("/api/update/:id", controller.update);
router.delete("/api/delete/:id", controller.delete);
router.post("/api/permission", controller.determinePermissions);

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

module.exports = router;
