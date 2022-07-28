const express = require ('express');
const userController = require('../controllers/user.controller');
const api = express.Router();

api.post('/signup', userController.signup);
api.post('/signin', userController.signin);


module.exports = api;