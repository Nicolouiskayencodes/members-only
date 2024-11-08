const router = require('express').Router();
// const passport = require('passport');
// const pool = require('../db/pool')
// const bcrypt = require('bcryptjs')
const controller = require('../controllers/controller.js')

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/', controller.index);
router.get('/login', controller.loginForm);
router.get('/register', controller.registerForm);
router.get('/logout', controller.logout);
router.get('/login-success', controller.redirectIndex);
router.get('/login-failure', controller.loginFailure);
router.get('/membership', controller.membership)
router.post('/membership', controller.addMember)
router.get('/message', controller.messageForm)
router.post('/message', controller.createMessage)
router.get('/admin', controller.admin)
router.post('/admin', controller.addAdmin)
router.get('/delete/:id', controller.deleteConfirm)
router.post('/delete/:id', controller.deleteMessage)
module.exports = router;