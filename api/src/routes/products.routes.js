const express = require ('express');
const api = express.Router();
const productController = require('../controllers/product.controller');
const middlewareToken = require('../authentication/auth');


api.post('/createproduct', middlewareToken.verifyToken, productController.createProduct);
api.get('/getproducts/:gender', productController.getProducts);
api.post('/upload-image-product/:id', middlewareToken.verifyToken, productController.saveImages);


module.exports = api;