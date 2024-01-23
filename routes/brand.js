const express = require('express');
const routes = express.Router();
const brandController = require('../controllers/brandController');
const brand = require('../models/brand');

routes.get('/add_brand',brandController.add_brand);
routes.post('/add_BrandData',brandController.add_BrandData);
routes.get('/view_brand',brandController.view_brand);
routes.get('/setDeactive/:id',brandController.setDeactive);
routes.get('/setActive/:id',brandController.setActive);
routes.get('/updateBrandData/:id',brandController.updateBrandData);
routes.post('/EditBrandData',brandController.EditBrandData);
routes.get('/deleteBrandData/:id',brandController.deleteBrandData);
routes.post('/deleteAllBrand',brandController.deleteAllBrand);
module.exports = routes;