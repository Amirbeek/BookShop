const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignUp);

router.get('/signup', authController.getSignUp);

router.post('/logout', authController.postLogout);

router.get('/reset' , authController.getReset);

router.post('/reset' , authController.postReset);

router.get('/update-password/:token', authController.getNewPassword);

router.post('/update-password',  authController.postNewPassword)

module.exports = router;