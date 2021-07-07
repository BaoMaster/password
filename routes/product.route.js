const express = require('express');
const router = express.Router();
const controller = require('../src/services/product');
const multer = require('multer');
const path = require('path');
const Resize = require('../config/resize');
const CUDProduct = require('../src/services/products/cud-product');
const GetProduct = require('../src/services/products/get-product');
const GetProductRating = require('../src/services/products/rating-product-list');
const GetProductCheap = require('../src/services/products/cheap-poduct-list');
const SearchProduct = require('../src/services/products/search-product');
const GetProductType = require('../src/services/products/product-type/get-product-type');
const CUDProductType = require('../src/services/products/product-type/cud-product-type');
const GetProductDubType = require('../src/services/products/product-type/product-sub-type/get-product-sub-type');
const CUDProductDUbType = require('../src/services/products/product-type/product-sub-type/cud-product-sub-type');
const RatingProduct = require('../src/services/rating/rating-product');
const RatingList = require('../src/services/rating/get-product-rating-by-userId');
const CreateOrder = require('../src/services/order/create-order');

//***************Product routes*******************

//CUD products
router.post('/api/add-product', CUDProduct.addProduct);
router.put('/api/update-product/:id', CUDProduct.updateProduct);
router.delete('/api/delete-product/:id', CUDProduct.deleteProduct);
//Get products
router.get('/api/get-all-product', GetProduct.getAllProduct);
router.get('/api/get-product-by-id/:id', GetProduct.getProductById);
router.post('/api/rating-product-list', GetProductRating.getRatingProductList); //get product list rating
router.post('/api/cheap-product-list', GetProductCheap.getCheapProductList); //get product list cheap
router.get('/api/get-product-each-type', GetProduct.getProductEachType);
router.get('/api/get-product-by-type/:id', GetProduct.getProductOneType);
//Search products
router.post('/api/search-product', SearchProduct.searchProductByName);
//Rating products
router.post('/api/rating-product/:id', RatingProduct.ratingProduct);
//Get Rating products
router.get('/api/rating-list-by-user-id/:id', RatingList.getRatingByUserId);

//**************Product's type routes********************
//Get product's type
router.get('/api/get-product-type', GetProductType.getProductType);
//CUD product's type
router.post('/api/add-product-type', CUDProductType.addProductType);
router.put('/api/update-product-type/:id', CUDProductType.updateProductType);
router.delete('/api/delete-product-type/:id', CUDProductType.deleteProductType);

//**************Product's sub type routes********************
//Get product's sub type
router.get('/api/get-product-sub-type', GetProductDubType.getProductSubType);
//CUD product's sub type
router.post('/api/add-product-sub-type', CUDProductDUbType.addProductSubType);
router.put('/api/update-product-sub-Subtype/:id', CUDProductDUbType.updateProductSubType);
router.delete('/api/delete-product-sub-type/:id', CUDProductDUbType.deleteProductSubType);

//Etc...
router.post('/api/addtocart', controller.addToCart);
router.delete('/api/removefromcart', controller.removeFromCart);
const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
router.post('/post', upload.single('image'), async function (req, res) {
  const imagePath = path.join(__dirname, '../public/images/product');
  const fileUpload = new Resize(imagePath);
  if (!req.file) {
    res.status(401).json({ error: 'Please provide an image' });
  }
  const filename = await fileUpload.save(req.file.buffer);
  return res.status(200).json({ name: filename });
});
module.exports = router;
