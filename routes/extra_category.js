const express = require('express');
const routes = express.Router();
const extra_categoryController = require('../controllers/extra_categoryController');
const extra_category = require('../models/extra_category');

routes.get('/add_ex_category',extra_categoryController.add_ex_category);
routes.post('/add_extracatData',extra_categoryController.add_extracatData);
routes.get('/view_ex_category',extra_categoryController.view_ex_category);
routes.get('/setDeactive/:id',extra_categoryController.setDeactive);
routes.get('/setActive/:id',extra_categoryController.setActive);
routes.get('/updateExtraData/:id',extra_categoryController.updateExtraData);
routes.post('/EditExtraData',extra_categoryController.EditExtraData);
routes.get('/deleteexcatData/:id',extra_categoryController.deleteexcatData);
routes.post('/deleteAllExtraCat',extra_categoryController.deleteAllExtraCat);
routes.post('/getSubcat',extra_categoryController.getSubcat);
routes.post('/getExtra',extra_categoryController.getExtra);
routes.post('/getBrandTypeData',extra_categoryController.getBrandTypeData);

module.exports = routes;