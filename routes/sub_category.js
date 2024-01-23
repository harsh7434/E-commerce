const express = require('express');
const routes = express.Router();
const sub_categoryController = require('../controllers/sub_categoryController');
const sub_category = require('../models/sub_category');

routes.get('/add_sub_category',sub_categoryController.add_sub_category);
routes.post('/add_subcatData',sub_categoryController.add_subcatData);
routes.get('/view_sub_category',sub_categoryController.view_sub_category);
routes.get('/setDeactive/:id',sub_categoryController.setDeactive);
routes.get('/setActive/:id',sub_categoryController.setActive);
routes.get('/updatesubcatData/:id',sub_categoryController.updatesubcatData);
routes.post('/EditSubcatData',sub_categoryController.EditSubcatData);
routes.get('/deletesubcatData/:id',sub_categoryController.deletesubcatData);
routes.post('/deleteAllSubCat',sub_categoryController.deleteAllSubCat);


module.exports = routes;