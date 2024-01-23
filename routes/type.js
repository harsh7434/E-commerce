const express = require('express');
const routes = express.Router();
const typeController = require('../controllers/typeController');
const type = require('../models/type');

routes.get('/add_type',typeController.add_type);
routes.post('/add_TypeData',typeController.add_TypeData);
routes.get('/view_type',typeController.view_type);
routes.get('/setDeactive/:id',typeController.setDeactive);
routes.get('/setActive/:id',typeController.setActive);
routes.get('/updateTypeData/:id',typeController.updateTypeData);
routes.post('/EditTypeData',typeController.EditTypeData);
routes.get('/deleteTypeData/:id',typeController.deleteTypeData);
routes.post('/deleteAllType',typeController.deleteAllType);



module.exports = routes;