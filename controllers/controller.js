const passport = require('passport');
const bcrypt = require('bcryptjs');
const db = require('../db/queries');
const { body, validationResult } = require("express-validator");

const validateRegister = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .custom(async (value) => {
      const user = await db.findUser(value);
      if (user[0]) {
        throw new Error('Username already in use');
      }})
   .isAlphanumeric().withMessage('Username must be alphanumeric')
   .matches(/^[^\s]+$/).withMessage('Username cannot contain spaces')
   .isLength({min: 1, max: 30}).withMessage(`Username must be between 1 and 30 characters`),
  body('password')
    .notEmpty().withMessage('Password is required')
    .matches(/^[^\s]+$/).withMessage('Password cannot contain spaces')
    .isLength({min: 1, max: 30}).withMessage(`Password must be between 1 and 30 characters`),
  body('verify-password')
    .custom((value, { req }) => {
      return value === req.body.password;
    }).withMessage('Passwords must match'),
  body('firstname').trim()
   .notEmpty().withMessage('First name is required')
   .isAlpha().withMessage('First name should contain only letters')
   .isLength({min: 1, max: 30}).withMessage(`First name must be between 1 and 30 characters`),
  body('lastname').trim()
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name should contain only letters')
    .isLength({min: 1, max: 30}).withMessage(`Last name must be between 1 and 30 characters`),
]
validateMessage = [
  body('title').trim()
    .notEmpty().withMessage('Title is required')
    .isLength({min: 1, max: 30}).withMessage(`Last name must be between 1 and 30 characters`),
  body('message_body').trim()
    .notEmpty().withMessage('Message is required')
    .isLength({min: 1, max: 250}).withMessage(`Last name must be between 1 and 250 characters`)
]

const login = passport.authenticate('local', {
  successRedirect: "/login-success",
  failureRedirect: "/login-failure"
});

const register = [
  validateRegister,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("register", {
        errors: errors.array(),
      });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      try {
        await db.createUser(
          req.body.username,
          hashedPassword,
          req.body.firstname,
          req.body.lastname
        );
        res.redirect("/login");
      } catch(err) {
        return next(err);
      }
    })
}
]

const index = async (req, res, next) => {
  try{
    let messages = await db.getAllMessages()
    res.render('index', {messages: messages})
  } catch (err){
    return next(err)
  }
}

const loginForm = (req, res, next) => {
  res.render('login')
}

const registerForm = (req, res, next) => {
  res.render('register')
}

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  }
  );
}

const redirectIndex = (req, res, next) => {
  res.redirect('/');
}

const loginFailure =  (req, res, next) => {
  res.render('login', {errors:[{msg:'Username or password did not match'}]})
}

const membership = (req, res, next) => {
  res.render('membership')
}

const addMember = async (req, res, next) => {
  if (req.body.membership === process.env.MEMBER_PASSWORD) {
    try { 
      await db.addMember(res.locals.currentUser.id)
      res.redirect('/')
    } catch (err) {
      return next(err);
    }
  } else {
    res.render('membership', {errors:[{msg:'Membership password was incorrect'}]})
  }
}

const messageForm = (req, res) => {
  res.render('message');
}

const createMessage = [
  validateMessage,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("message", {
        errors: errors.array(),
      });
    }
  try {
    await db.createMessage(req.body.title, req.body.message_body, res.locals.currentUser.id);
    res.redirect('/')
  } catch (err) {
    return next(err);
  }
}
]

const admin = (req, res) => {
  res.render('admin');
}

const addAdmin = async (req, res, next) => {
  if (req.body.admin === process.env.ADMIN_PASSWORD) {
    try { 
      await db.addAdmin(res.locals.currentUser.id)
      res.redirect('/')
    } catch (err) {
      return next(err);
    }
  } else {
    res.render('admin', {errors:[{msg:'Admin password was incorrect'}]})
  }
}

const deleteConfirm = async (req, res) =>{
  const message = await db.getMessage(req.params.id)
  res.render('delete', {id : req.params.id, messages: message})
}

const deleteMessage = async (req, res, next ) => {
  try {
    await db.deleteMessage(req.params.id)
    res.redirect('/')
  } catch (err) {
  return next(err)
  }
}

module.exports = {login, register, index, loginForm, registerForm, logout, redirectIndex, loginFailure, membership, addMember, messageForm, createMessage, admin, addAdmin, deleteConfirm, deleteMessage}