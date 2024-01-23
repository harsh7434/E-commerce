const express = require('express');
const routes = express.Router();
const productController = require('../controllers/productController');
const product = require('../models/product');

routes.get('/add_product',productController.add_product);
routes.post('/add_ProductData',product.uploadProductImage,productController.add_ProductData);
routes.get('/view_product',productController.view_product);
routes.get('/view_more/:id',productController.view_more);
routes.get('/setDeactive/:id',productController.setDeactive);
routes.get('/setActive/:id',productController.setActive);
routes.get('/updateproductData/:id',productController.updateproductData);
routes.post('/EditProductData',product.uploadProductImage,productController.EditProductData);
routes.get('/deleteProductData/:id',productController.deleteProductData);

module.exports = routes;