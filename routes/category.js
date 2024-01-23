const express = require('express');
const routes = express.Router();
const categoryController = require('../controllers/categoryController');
const category = require('../models/category');

routes.get('/add_category',async(req,res)=>{
    return res.render("add_category");
})

routes.post('/add_category',categoryController.add_category);
routes.get('/view_category',categoryController.view_category);
routes.get('/setDeactive/:id',categoryController.setDeactive);
routes.get('/setActive/:id',categoryController.setActive);
routes.get('/updatecategoryData/:id',categoryController.updatecategoryData);
routes.post('/EditCategoryData',categoryController.EditCategoryData);
routes.get('/deletecategoryData/:id',categoryController.deletecategoryData);
routes.post('/deleteAllcategory',categoryController.deleteAllcategory);

module.exports = routes;